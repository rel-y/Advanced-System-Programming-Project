const { singletonMetadataModel, NodeType } = require("../model/metadataModel");
const {createFile} = require("../model/FileModel");

function getFileController(req, res) {

  const data = singletonMetadataModel.getAllBaseNodes();
  const idAndNames = data.map(item => ({ id: item.id, name: item.name }));
  res.status(200).json(idAndNames);
}

function createFileController(req, res) {
  let { name, type, parent, uid, content} = req.body;

  if (!name || uid === undefined || uid === null) {//bad request
    return res.status(400).json({ error: "bad request, name and uid are required" });
  }

  if (parent === undefined || parent === null) parent = 0; //default parent is root
  if (type === undefined || type === null) type = NodeType.FILE; //default type is FILE
  if (type !== NodeType.FILE && type !== NodeType.FOLDER) {
    return res.status(400).json({ error: "bad request, type must be FILE or FOLDER" });
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
        
        return res.status(201).json([{
          id: id,
          name: name
        }]);
      })
      .catch(err => {
        try { singletonMetadataModel.deleteFileNode(id); } catch (_) {} //rollback metadata creation
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

module.exports = { getFileController, createFileController };
