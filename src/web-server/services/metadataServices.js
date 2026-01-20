const { MetadataNode, NodeType, PermissionType, AbilityRequirement } = require("../models/metadataModelMongo");
const User = require("../models/usersModelMongo");

const crypto = require("crypto");
const idLengthBytes = 16;

const ensureRootExists = async () => { // do this upon connection
  const exists = await MetadataNode.exists({ _id: "0" });
  if (exists) return;

  await MetadataNode.create({ 
    _id: "0",
    name: "/",
    type: NodeType.FOLDER,
    parent: null,
    uid: null,
    filePermissions: PermissionType.FILE_MANAGER,
    isInTrash: false,
  });
};

const toClientNode = (node) => { // we user this because rest of code expects id and not _id 
  const { _id, ...rest } = node;
  return { id: _id, ...rest };
};

const getFileNode = async (id) => {
  const node = await MetadataNode.findById(id).lean();
  if (!node) return undefined;

  const permsObj = node.userFilePermissions || {};

  const userFilePermissions = Object.fromEntries(
    Object.entries(permsObj).map(([userName, permissionNumber]) => [
      userName,
      Object.keys(PermissionType).find(
        (key) => PermissionType[key] === permissionNumber
      ),
    ])
  );

  const outNode = toClientNode(node);

  return {
    ...outNode,
    userFilePermissions,
  };
};

const listChildIds = async (parentId) => {
  const nodes = await MetadataNode.find(
    { parent: parentId }, // those who match parent
    { _id: 1 } // project and send only id
  ).lean();

  return new Set(nodes.map((node) => node._id));
};


const listChildren = async (parentId) => {
  const nodes = await MetadataNode.find({ parent: parentId }).lean();

  return nodes.map((node) => ({
    id: node._id,
    node: toClientNode(node), // node has id not _id
  }));
};

const addFileNode = async (name, type = NodeType.FILE, parent = "0", uid = null) => {
    if (type !== NodeType.FILE && type !== NodeType.FOLDER) {
        throw new Error(`Invalid node type: ${type}.`);
    }

    const parentNode = await MetadataNode.findById(parent).lean();
    if (!parentNode) {
        throw new Error(`Parent node with id ${parent} does not exist.`);
    }
    if (parentNode.type !== NodeType.FOLDER) {
        throw new Error(`Parent node with id ${parent} is not a folder.`);
    }

    const userFilePermissions = new Map();
    if (uid !== null && uid !== undefined) {
        userFilePermissions.set(uid, PermissionType.OWNER);
    }

    while (true) {
        const id = crypto.randomBytes(idLength).toString("hex");

        try {
            await MetadataNode.create({
            _id: id,
            name,
            type,
            parent,
            uid,
            filePermissions: PermissionType.NON,
            userFilePermissions,
            isInTrash: false,
            // createdAt, size are set default
            });
            return id;
        } catch (err) {
            if (err && err.code === 11000) continue; // error is because dup
            throw err;
        }
    }
};

const deleteFileNode = async (id) => {
    const idString = String(id); // if call passes a number, maybe problematic for "0"
    
    if (idString === "0") throw new Error("Cannot delete root.");
    const node = await MetadataNode.findById(idString).lean();
    if (!node) {
      throw new Error(`Node with id ${idString} does not exist.`);
    }

    if (node.type === NodeType.FOLDER) {
        const hasChildren = await MetadataNode.exists({ parent: idString });
        if (hasChildren) {
            throw new Error(`Cannot delete folder with id ${idString} because it is not empty.`);
        }
    }

    await MetadataNode.deleteOne({ _id: idString });
};

const updateLastAccess = async (fileId, userId) => {
    const user = await User.findOne({username: userId}, {_id: 1}).lean();
    if (!user) {
        return undefined;
    }

    const now = new Date();

    const res = await User.updateOne(
        { username: userId, [`filemap.${fileId}`]: { $exists: true } },
        { $set: { [`filemap.${fileId}.lastAccessed`]: now } }
    );

    if (res.matchedCount > 0) return true;

    await User.updateOne(
        { username: userId },
        { $set: { [`filemap.${fileId}`]: { lastAccessed: now, starred: false } } } 
    );
};

const renameFileNode = async (id, newName) => {
    const idString = String(id);
    
    if (typeof newName !== "string" || newName.trim() === "") {
        throw new Error("Invalid file name");
    }

    const res = await MetadataNode.updateOne(
        {_id: idString},
        {$set: {name: newName}}
    );
    
    if (res.matchedCount === 0) {throw new Error(`File/Folder with id ${idString} does not exist`);}
};

const searchFileIdByName = async (query) => {
    if (typeof query !== "string" || query === "") return [];

    const regex = new RegExp(query);  // works like includes()

    const nodes = await MetadataNode.find(
        { name: regex },
        { _id: 1 }
    ).lean();

    return nodes.map((n) => n._id);
};

const isAbaleTo = async (userId, fileId, ability) => {
    const idString = String(fileId);
    const node = await MetadataNode.findOne({_id: idString}).lean();
    
    if (!node) return false; // no such file
    let defaultForFile = node.filePermissions;

    let permsForUsersList = node.userFilePermissions || {};
    let fileContainsUser = Object.prototype.hasOwnProperty.call(permsForUsersList, userId);
    let userPermission = "";

    if (fileContainsUser) {
      userPermission = permsForUsersList[userId];
    } else {
      userPermission = defaultForFile;
    }

    if(!((typeof userPermission === "number" && Object.values(PermissionType).includes(userPermission)) &&
        typeof ability === "string" && Object.prototype.hasOwnProperty.call(AbilityRequirement, ability))){
        //didn't get a number for the permission level or a currect key in for ability
        return false;
    }
    return userPermission >= AbilityRequirement[ability];
};

const getFilePermissionsForUser = async (userId, fileId) => {
    const idString = String(fileId);
    const node = await MetadataNode.findOne({_id: idString}).lean();
    
    if (!node) return false; // no such file
    let defaultForFile = node.filePermissions;

    let permsForUsersList = node.userFilePermissions || {};
    let fileContainsUser = Object.prototype.hasOwnProperty.call(permsForUsersList, userId);
    let userPermission = "";

    if (fileContainsUser) {
      userPermission = permsForUsersList[userId];
    } else {
      userPermission = defaultForFile;
    }

    if(!((typeof userPermission === "number" && Object.values(PermissionType).includes(userPermission)))){
          //didn't get a number for the permission level or a currect key in for ability
          return false;
         }
    return userPermission;
};

const getFilePermission = async (fileId) => {
    const idString = String(fileId);
    const node = await MetadataNode.findOne({_id: idString}).lean();

    if (!node) return null;

    return {
        filePermissions: node.filePermissions, 
        userFilePermissions: node.userFilePermissions
    };
};

const setFilePermission = async (fileId, newFilePermission) => {
    const idString = String(fileId);

    const res = await MetadataNode.updateOne(
        {_id: idString}, 
        {$set: {filePermissions: newFilePermission}}
    );

    if (res.matchedCount === 0) return null;
    return true;
};

const setUserFilePermission = async (fileId, userId, newFilePermission) => {
    const idString = String(fileId);

    const res = await MetadataNode.updateOne(
        {_id: idString}, 
        {$set: { [`userFilePermissions.${userId}`] : newFilePermission }}
    );

    if (res.matchedCount === 0) return null;
    return true;
};

const setStarredStatus = async (fileId, isStarred, uid) => {
    const idString = String(fileId);
    const userIdString = String(uid);

    const res = await User.updateOne(
        {username: userIdString, [`filemap.${idString}`]: { $exists: true } },
        { $set: { [`filemap.${idString}.starred`]: isStarred } }
    );

    if (res.matchedCount > 0) return true;

    const nodeData = await MetadataNode.findOne({_id: idString}).lean();
    if (!nodeData) return null;

    await User.updateOne(
        {username: userIdString },
        { $set: { [`filemap.${idString}`]: 
            {lastAccessed: nodeData.createdAt, 
            starred: isStarred} } }
    );
    return true;
};

const setTrashStatus = async (fileId, isInTrash) => {
    const idString = String(fileId);

    const res = await MetadataNode.updateOne(
        {_id: idString}, 
        {$set: { isInTrash : isInTrash }}
    );

    if (res.matchedCount === 0) return null;
    return true;
};

const setSize = async (fileId, size) => {
    const idString = String(fileId);

    const res = await MetadataNode.updateOne(
        {_id: idString}, 
        {$set: { size : size }}
    );

    if (res.matchedCount === 0) return null;
    return true;
};

const getAllFolderNodes = async (id = "0") => {
    const parentId = String(id);
    
    const res = await MetadataNode.find(
        {parent: parentId},
        {_id: 1}
    ).lean();

    return res.map((node) => ({id: node._id}));
}

const getAllBaseNodes = async () => {
    return (await getAllFolderNodes());
};

const getAllMetadata = async (nodeIdItem, userId) => {
    if(!nodeIdItem || !nodeIdItem.id){
      return null;
    }
    const idString = String(nodeIdItem.id);

    const node = await MetadataNode.findOne({_id: idString}).lean();
    if (!node) return null;

    const user = await User.findOne(
        { username: String(userId) },
        { filemap: 1 }
    ).lean();

    const fileEntry = user?.filemap?.[nodeId]; // with lean(), filemap is a plain object
    const lastAccess = fileEntry?.lastAccessed ?? node.createdAt;
    const isStarred = fileEntry?.starred ?? false;

    let parentName = null;
    if (node.parent !== null && node.parent !== undefined) {
        const parent = await MetadataNode.findOne(
        { _id: String(node.parent) },
        { name: 1 }
        ).lean();
        parentName = parent ? parent.name : null;
    }

    return {
        id: nodeId,
        name: node.name,
        type: node.type,
        parent: node.parent,
        parentName,
        uid: node.uid,
        isStarred,
        isInTrash: node.isInTrash,
        createdAt: node.createdAt,
        lastAccess,
        size: node.size,
        filePermissions: Object.keys(PermissionType).find(
        (key) => PermissionType[key] === node.filePermissions
        ),
    };
};

const getAllNodes = async (username, ability, id = 0) => {
    // DFS over the tree, but "stop early" when a folder is accessible
    const result = [];
    const stack = [id];

    while (stack.length > 0) {
        const parentId = stack.pop();

        const children = await getAllFolderNodes(parentId); // returns [{id: childId}, ...]
        for (const child of children) {
        const childId = child.id;
        const node = await getFileNode(childId);
        if (!node) continue;

        const allowed = await isAbaleTo(username, childId, ability);

        if (node.type === "FILE") {
            if (allowed) result.push(childId);
            // if not allowed: ignore
            continue;
        }

        if (node.type === "FOLDER") {
            if (allowed) {
            // add folder and DO NOT traverse inside it
            result.push(childId);
            } else {
            // not allowed: traverse children
            stack.push(childId);
            }
        }
        }
    }

    return result;
}

module.exports = { 
    ensureRootExists, 
    toClientNode, 
    getFileNode, 
    listChildIds, 
    listChildren, 
    addFileNode, 
    deleteFileNode,
    updateLastAccess,
    renameFileNode,
    searchFileIdByName,
    isAbaleTo,
    getFilePermissionsForUser,
    getFilePermission,
    setFilePermission,
    setUserFilePermission,
    setStarredStatus,
    setTrashStatus,
    setSize,
    getAllFolderNodes,
    getAllBaseNodes,
    getAllMetadata,
    getAllNodes,
};

