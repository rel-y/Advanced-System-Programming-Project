const {singletonMetadataModel, PermissionType, AbilityRequirement} = require("../model/metadataModel");

function patchFilePermissionController(req, res){
    const {id,pld} = req.params;
    const {filePermission} = req.body;

    if(id === undefined || filePermission === undefined || pld === undefined){
        return res.status(400).json({ error: "bad request, missing fields" });
    }
    if(!Object.values(PermissionType).includes(filePermission)){
        return res.status(400).json({ error: "bad request, invalid permission type" });
    }
    const Node = singletonMetadataModel.getFileNode(id)
    if(Node == undefined){
        return res.status(404).json({ error: "file/folder doesn't exist" });
    }
    try{
        singletonMetadataModel.setFilePermission(id, filePermission);
        return res.status(200).json({ message: "file/folder permission updated successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}