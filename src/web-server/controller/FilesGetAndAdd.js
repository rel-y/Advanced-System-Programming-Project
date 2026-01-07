const { singletonMetadataModel, NodeType } = require("../model/metadataModel");
const {createFile} = require("../model/FileModel");

function getFileController(req, res) {
  let loggedInUsername = req.user.username;
  const data = singletonMetadataModel.getAllBaseNodes();
  filteredByPermissions = data.filter(item => singletonMetadataModel.isAbaleTo(loggedInUsername, item.id, "READ"));
  const metadata = filteredByPermissions.map(item => singletonMetadataModel.getAllMetadata(item, loggedInUsername));
  res.status(200).json(metadata);
}

function getFolderFileController(req, res) {
  const loggedInUsername = req.user.username;
  const folderId = req.params.Id;
  
  let Folder = singletonMetadataModel.map.get(folderId);
    if(folderId === undefined || folderId === null || Folder === undefined || Folder.type !== NodeType.FOLDER){
      return res.status(400).json({ error: "bad request, folder id is invalid" });
    }
  
  if (!isAbaleTo(loggedInUsername, folderId, "READ")) {
    return res.status(401).json({ error: "user doesnt have read permissions for folder" });
  }

  const data = singletonMetadataModel.getAllFolderNodes(folderId);
  filteredByPermissions = data.filter(item => singletonMetadataModel.isAbaleTo(loggedInUsername, item.id, "READ"));
  const metadata = filteredByPermissions.map(item => singletonMetadataModel.getAllMetadata(item, loggedInUsername));
  res.status(200).json(metadata);
}

function createFileController(req, res) {
  let { name, type, parent, content} = req.body;
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

  if (!singletonMetadataModel.map.has(parent)) {
    return res.status(404).json({ error: "parent folder does not exist" });
  }
  if (parent !== 0 && !isAbaleTo(loggedInUsername, parent, "WRITE")) {
    return res.status(401).json({ error: "user hase no WRITE permissions to parent folder" });
  }

  if (type === NodeType.FILE) {
    if (content === undefined || content === null) {
      return res.status(400).json({ error: "bad request, data is required for file type" });
    }
    //create the file in the file server
    let id;
    try 
    {
      id = singletonMetadataModel.addFileNode(name, type, parent, uid);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
    createFile(id, content)
      .then(response => {
        singletonMetadataModel.setSize(id,content.length);
        return res.status(201).json([{
          id: id,
          name: name
        }]);
      })
      .catch(err => {
        try { singletonMetadataModel.deleteFileNode(id); } catch (_) {
          console.log("prob")
        } //rollback metadata creation
        return  res.status(500).json({ error: err.message });
      });
    return;
  }

  //for folder type, we just create the metadata node

  try {
    let id = singletonMetadataModel.addFileNode(name, type, parent, uid);
    return res.status(201).json([{
          id: id,
          name: name
        }]);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = { getFileController, createFileController,getFolderFileController };
