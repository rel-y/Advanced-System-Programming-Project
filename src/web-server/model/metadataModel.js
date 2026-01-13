const crypto = require("crypto");//yooo crypto :)
const {singletonUsersModel} = require("./usersModel")

const idLength = 16; //length of the id in hex characters

const NodeType = Object.freeze({
  FILE: "FILE",
  FOLDER: "FOLDER",
});

const PermissionType = Object.freeze({
  OWNER: 5,
  FILE_MANAGER: 4,
  WRITER: 3,
  COMMENTER: 2,
  VIEWER: 1,
  NON: 0,
}); 

const AbilityRequirement = Object.freeze({
  READ: PermissionType.VIEWER,
  COMMENT: PermissionType.COMMENTER,
  WRITE: PermissionType.WRITER,
  READ_PERMISSIONS: PermissionType.FILE_MANAGER,
  CHANGE_FILE_PERMISSIONS: PermissionType.FILE_MANAGER,
  CHANGE_REGULAR_USER_PERMISSIONS: PermissionType.FILE_MANAGER,
  CHANGE_ALL_USER_PERMISSIONS: PermissionType.OWNER,
  DELETE: PermissionType.OWNER,
});

class FileNode {
  constructor(name, type, parent = null, uid = null) {
    this.name = name;
    this.type = type;
    this.parent = parent;
    this.uid = uid; // owner user id
    this.filePermissions = PermissionType.NON; //deafult permission of a random user
    this.userFilePermissions = new Map();
    this.userFilePermissions.set(uid, PermissionType.OWNER); //the creator is the owner of the file/folder
    this.isInTrash = false;
    this.createdAt = new Date();
    this.size;
  }
}

class MetadataNode {
  constructor() {
    this.map = new Map(); // id -> FileNode
    this.childrenByParent = new Map()
    // root
    const root = new FileNode("/", NodeType.FOLDER, null, null);
    root.userFilePermissions.set(null, PermissionType.READ_PERMISSIONS); // everyone is owner of root
    this.map.set(0, root); //root folder with id 0
    this.childrenByParent.set(0, new Set()); // root children set
  }
  getFileNode(id) 
  {
    if(!this.map.has(id)) {
        return undefined;
    }
    let file = this.map.get(id);
    return {
      ...file,
      userFilePermissions: Object.fromEntries(
        [...file.userFilePermissions].map(([userName, permission]) => [
          userName,
          Object.keys(PermissionType).find(key => PermissionType[key] == permission)
        ])
      )
    }
  }

  listChildIds(parentId) {
    return new Set(this.childrenByParent.get(parentId) || []);
  }

  listChildren(parentId) {
    const ids = this.childrenByParent.get(parentId);
    if (!ids) return [];
    return [...ids].map((id) => ({ id, node: this.map.get(id) })).filter(x => x.node);
  }

  addFileNode(name, type = NodeType.FILE, parent = 0, uid = null) {
    let id;
    do {
        id = crypto.randomBytes(idLength).toString("hex");
    } while (this.map.has(id));
    const parentNode = this.map.get(parent);
    if (!parentNode) {
      throw new Error(`Parent node with id ${parent} does not exist.`);
    }
    if (parentNode.type !== NodeType.FOLDER) {
      throw new Error(`Parent node with id ${parent} is not a folder.`);
    }
    if (type !== NodeType.FILE && type !== NodeType.FOLDER) {
      throw new Error(`Invalid node type: ${type}.`);
    }

    const node = new FileNode(name, type, parent, uid);
    this.map.set(id, node);

    // register child under parent
    if (!this.childrenByParent.has(parent)) {
      this.childrenByParent.set(parent, new Set());
    }
    this.childrenByParent.get(parent).add(id);

    // if it's a folder, create an empty children set for it
    if (type === NodeType.FOLDER && !this.childrenByParent.has(id)) {
      this.childrenByParent.set(id, new Set());
    }
    return id;
  }

  deleteFileNode(id) {
    if (id === 0) throw new Error("Cannot delete root.");
    const node = this.map.get(id);
    if (!node) {
      throw new Error(`Node with id ${id} does not exist.`);
    }

    // folder must be empty
    const kids = this.childrenByParent.get(id);
    if (node.type === NodeType.FOLDER && kids && kids.size > 0) {
      throw new Error(`Cannot delete folder with id ${id} because it is not empty.`);
    }

    // remove from parent's children set
    if (node.parent !== null && node.parent !== undefined) {
      this.childrenByParent.get(node.parent)?.delete(id);
    }

    // cleanup bookkeeping
    this.childrenByParent.delete(id);
    this.map.delete(id);
  }


  getAllFolderNodes(id = 0) {
    // "base" = children of root
    const ids = this.childrenByParent.get(id);
    if (!ids) return [];
    const out = [];
    for (const id of ids) {
      const node = this.map.get(id);
      if (node) out.push({ id:id});
    }
    return out;
  }
  getAllNodes(username, ability, id = 0) {
  // DFS over the tree, but "stop early" when a folder is accessible
  const result = [];
  const stack = [id];

  while (stack.length > 0) {
    const parentId = stack.pop();

    const children = this.getAllFolderNodes(parentId); // returns [{id: childId}, ...]
    for (const child of children) {
      const childId = child.id;
      const node = this.map.get(childId);
      if (!node) continue;

      const allowed = this.isAbaleTo(username, childId, ability);

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

  
  getAllBaseNodes() {
    return this.getAllFolderNodes();
  }
  getAllMetadata(nodeIdItem, userId){
    if(!nodeIdItem){
      return null;
    }
    if(!this.map.has(nodeIdItem.id)){
      return null;
    }
    let node = this.map.get(nodeIdItem.id);
    const lastAccess = singletonUsersModel.getUser(userId)?.filemap?.get(nodeIdItem.id)?.[0] ?? node.createdAt;
    const isStarred = singletonUsersModel.getUser(userId)?.filemap?.get(nodeIdItem.id)?.[1] ?? false;
    let parentName = this.map.get(node.parent).name;
    return {
      id: nodeIdItem.id,
      name: node.name,
      type: node.type,
      parent: node.parent,
      parentName: parentName,
      uid: node.uid,
      isStarred: isStarred,
      isInTrash: node.isInTrash,
      createdAt: node.createdAt,
      lastAccess: lastAccess,
      size: node.size,
      filePermissions:  Object.keys(PermissionType).find(key => PermissionType[key] === node.filePermissions)};
  }
  updateLastAccess(fileId, userId){
    const user = singletonUsersModel.getUser(userId);
    if(!user){
      return;
    }
    const currect = user.filemap.get(fileId);
    if(currect){
      user.filemap.set(fileId, [new Date(),currect[1]]);//first time access
      return;
    }
    user.filemap.set(fileId,[new Date(),false])
  }
  renameFileNode(id, newName) {
    if (typeof newName !== "string" || newName.trim() === "") {
        throw new Error("Invalid file name");
    }

    const node = this.map.get(id);
    if (!node) {
        throw new Error(`File/Folder with id ${id} does not exist`);
    }

    node.name = newName;
  }
  searchFileIdByName(query) {
    const results = [];
    for (const [id, node] of this.map.entries()) {
        if (node.name.includes(query)) {
            results.push(id);
        }
    }
    return results;
  }
  getFullPath(id) {
    const node = this.map.get(id);
    if (!node) {
        throw new Error(`File/Folder with id ${id} does not exist`);
    }

    let path = '';
    let currentId = id;

    while (currentId !== null && currentId !== undefined) {
        const currentNode = this.map.get(currentId);
        if (!currentNode) break;
        path = `/${currentNode.name}${path}`;
        currentId = currentNode.parent;
    }

    return path || '/';
  }
  isAbaleTo(userId, fileId, ability){
    if (!this.map.has(fileId)) {
      return false;
    }
    const fileNode = this.map.get(fileId);
    let defaultForFile = fileNode.filePermissions;
    let fileContainsUser = fileNode.userFilePermissions.has(userId);
    let userPermission = ""

    if (fileContainsUser) {
      userPermission = fileNode.userFilePermissions.get(userId);
    } else {
      userPermission = defaultForFile;
    }
    
    if(!((typeof userPermission === "number" && Object.values(PermissionType).includes(userPermission)) &&
     typeof ability === "string" && Object.prototype.hasOwnProperty.call(AbilityRequirement, ability))){
      //didn't get a number for the permission level or a currect key in for ability
      return false;
     }
    return userPermission >= AbilityRequirement[ability];
  }
  
   getFilePermissionsForUser(userId, fileId){
    if (!this.map.has(fileId)) {
      return false;
    }
    const fileNode = this.map.get(fileId);
    let defaultForFile = fileNode.filePermissions;
    let fileContainsUser = fileNode.userFilePermissions.has(userId);
    let userPermission = ""

    if (fileContainsUser) {
      userPermission = fileNode.userFilePermissions.get(userId);
    } else {
      userPermission = defaultForFile;
    }
    
    if(!((typeof userPermission === "number" && Object.values(PermissionType).includes(userPermission)))){
      //didn't get a number for the permission level or a currect key in for ability
      return false;
     }
    return userPermission;
  }

  getFilePermission(fileId){
    return {
      filePermissions: this.map.get(fileId).filePermissions,
      userFilePermissions: this.map.get(fileId).userFilePermissions
    };
  }
  setFilePermission(fileId, newFilePermission){
    let file = this.map.get(fileId);
    if(file === undefined){
      return null;
    }
    file.filePermissions = newFilePermission;
  }
  getUserFilePermission(fileId, userId){
    if(!this.map.has(fileId)){
      return null;
    }
    return this.map.get(fileId).userFilePermissions.get(userId);
  }
  setUserFilePermission(fileId, userId, newFilePermission){
    if(!this.map.has(fileId)){
      return null;
    }
    this.map.get(fileId).userFilePermissions.set(userId, newFilePermission);
  }
  setStarredStatus(fileId, isStarred,uid){
    if(!this.map.has(fileId)){
      return null;
    }
    if(!singletonUsersModel.map.get(uid).filemap.has(fileId)){
      singletonUsersModel.map.get(uid).filemap.set(fileId,[this.map.get(fileId).createdAt, isStarred]);
      return;
    }
    const time = singletonUsersModel.map.get(uid).filemap.get(fileId)[0];// [time, isStarred]
    singletonUsersModel.map.get(uid).filemap.set(fileId, [time, isStarred])
  }
  setTrashStatus(fileId, isInTrash){
    if(!this.map.has(fileId)){
      return null;
    }
    this.map.get(fileId).isInTrash = isInTrash;
  }
  setSize(fileId, size){
    if(!this.map.has(fileId)){
      return null;
    }
    this.map.get(fileId).size = size;
  }
}

const singletonMetadataModel = new MetadataNode();
module.exports = { singletonMetadataModel, NodeType, PermissionType, AbilityRequirement };