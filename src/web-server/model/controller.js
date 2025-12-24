const { singletonMetadataModel, NodeType } = require("./metadataModel");

function getFileController(req, res) {
  const data = singletonMetadataModel.getAllBaseNodes();
  const idAndNames = data.map(item => ({ id: item.id, name: item.name }));
  res.status(200).json(idAndNames);
}

function createFileController(req, res) {
  let { name, type, parent, uid,} = req.body;

  if (!name || uid === undefined || uid === null) {//bad request
    return res.status(400).json({ error: "bad request, name and uid are required" });
  }

  if (parent === undefined || parent === null) parent = 0; //default parent is root
  if (type === undefined || type === null) type = NodeType.FILE; //default type is FILE

  try {
    singletonMetadataModel.addFileNode(name, type, parent, uid);
    return res.status(201).json({ message: "File node created successfully" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = { getFileController, createFileController };
