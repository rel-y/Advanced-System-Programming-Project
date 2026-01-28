const { createFile } = require("../model/FileModel");
const { getUser, addUser, updateUserTokenVersion, getUsertokenVersion, isFileAccessedByUser } = require("../services/usersServices");

const { NodeType } = require("../model/metadataModelMongo");
const { ensureRootExists, toClientNode, getFileNode, listChildIds, listChildren, addFileNode, deleteFileNode, updateLastAccess, renameFileNode, searchFileIdByName, isAbaleTo, getFilePermissionsForUser, getFilePermission, setFilePermission, setUserFilePermission, setStarredStatus, setTrashStatus, setSize, getAllFolderNodes, getAllBaseNodes, getAllMetadata, getAllNodes } = require("../services/metadataServices");
const { get } = require("mongoose");

async function getFileController(req, res) {
  let loggedInUsername = req.user.username;
  const data = await getAllBaseNodes();
  const filteredByPermissions = (
    await Promise.all(
      data.map(async (item) => {
        const allowed = await isAbaleTo(loggedInUsername, item.id, "READ");
        return allowed ? item : null;
      })
    )
  ).filter(Boolean);
  const metadata = await Promise.all(
    filteredByPermissions.map((item) =>
      getAllMetadata(item, loggedInUsername)
    )
  );
  res.status(200).json(metadata);
}

async function getFolderFileController(req, res, filter = undefined) {
  const loggedInUsername = req.user.username;
  let folderId = req.params.id;
  let Folder = await getFileNode(folderId);
  if (folderId === undefined || folderId === null)
    return res.status(400).json({ error: "bad request, folder id is invalid1" });
  if (Folder === undefined || Folder.type !== NodeType.FOLDER)
    return res.status(404).json({ error: "folder does not exist or is a file" });

  const data = await getAllFolderNodes(folderId);
  const filteredByPermissions = (
    await Promise.all(
      data.map(async (item) => {
        const allowed = await isAbaleTo(loggedInUsername, item.id, "READ");
        return allowed ? item : null;
      })
    )
  ).filter(Boolean);
  let metadata = await Promise.all(
    filteredByPermissions.map((item) =>
      getAllMetadata(item, loggedInUsername)
    )
  );

  if (filter !== undefined) { // help me
    const pred = await filter(req);
    
    const results = await Promise.all(metadata.map(async item => ({
      item,
      keep: await pred(item)
    })));

    metadata = results.filter(r => r.keep).map(r => r.item);
  }
  res.status(200).json(metadata);
}

async function getSharedNodes(req, res) {
  const loggedInUsername = req.user.username;
  let list = await getAllNodes(loggedInUsername, "READ");
  if (!list) {
    return res.status(200).json([]);
  }
  const existingNodes = (
    await Promise.all(
      list.map(async (id) => {
        const node = await getFileNode(id);
        return node ? id : null;
      })
    )
  ).filter(Boolean);

  const metadata = (
    await Promise.all(
      existingNodes.map((id) =>
        getAllMetadata({ id }, loggedInUsername)
      )
    )
  ).filter((data) => data.uid !== loggedInUsername);

  return res.status(200).json(metadata);
}

async function createFileController(req, res) {
  let { name, type, parent, content } = req.body;
  const loggedInUsername = req.user.username;
  const uid = loggedInUsername;

  if (!name || uid === undefined || uid === null) {//bad request
    return res.status(400).json({ error: "bad request, name required" });
  }

  if (parent === undefined || parent === null) parent = 0; //default parent is root
  if (type === undefined || type === null) type = NodeType.FILE; //default type is FILE
  if (type !== NodeType.FILE && type !== NodeType.FOLDER) {
    return res.status(400).json({ error: "bad request, type must be FILE or FOLDER" });
  }

  if (!(await getFileNode(parent))) {
    return res.status(404).json({ error: "parent folder does not exist" });
  }
  if (parent !== 0 && !(await isAbaleTo(loggedInUsername, parent, "WRITE"))) {
    return res.status(401).json({ error: "user hase no WRITE permissions to parent folder" });
  }

  if (type === NodeType.FILE) {
    if (content === undefined || content === null) {
      return res.status(400).json({ error: "bad request, data is required for file type" });
    }
    //create the file in the file server
    let id;
    try {
      id = await addFileNode(name, type, parent, uid);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
    try {
      const response = await createFile(id, content);
      console.log(response);

      await setSize(id, content.length);

      return res.status(201).json([
        {
          id,
          name
        }
      ]);
    } catch (err) {
      // rollback metadata creation
      try {
        await deleteFileNode(id);
      } catch (_) {
        console.log("prob");
      }

      return res.status(500).json({ error: err.message });
    }

    return;
  }

  //for folder type, we just create the metadata node

  try {
    let id = await addFileNode(name, type, parent, uid);
    return res.status(201).json([{
      id: id,
      name: name
    }]);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
function All(_req) {
  return () => true;
}
function starFilter(_req) {
  return item => item.isStarred === true || item.isStarred === "true";
}

function myDriveFilter(req) {
  return item => item.uid === req.user.username;
}
function sharedWithMeFilter(req) {
  return item => item.uid !== req.user.username;
}
async function recentFilter(req) {
  return async item => isFileAccessedByUser(req.user.username, item.id) || getFileNode(item.id).uid === req.user.username;
}//if the user is the owner and just created it, it might not be in the accessed list yet
function trashFilter(_req) {
  return item => item.isInTrash === true;
}
module.exports = { getSharedNodes, getFileController, createFileController, getFolderFileController, starFilter, myDriveFilter, sharedWithMeFilter, recentFilter, trashFilter, All };
