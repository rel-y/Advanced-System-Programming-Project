const {singletonMetadataModel, PermissionType, AbilityRequirement} = require("../model/metadataModel");

function patchFilePermissionController(req, res){
    const {id,pld} = req.params;
    const {filePermission} = req.body;
    const {username} = req.body; // from authentication middleware
    if(username === undefined || username === null){
        return res.status(401).json({ error: "unauthorized" });
    }
    if(id === undefined || filePermission === undefined || pld === undefined){
        return res.status(400).json({ error: "bad request, missing fields" });
    }
    if(!Object.keys(PermissionType).includes(filePermission)){
        return res.status(400).json({ error: "bad request, invalid permission type" });
    }
    const Node = singletonMetadataModel.getFileNode(id)
    if(Node == undefined){
        return res.status(404).json({ error: "file/folder doesn't exist" });
    }
    try{
        singletonMetadataModel.setUserFilePermission(id, pld, filePermission);
        return res.status(200).json({ message: "file/folder permission updated successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

function delteFilePermissionController(req, res){
    const {id, pld} = req.params;
    const {username} = req.body;
    if(username === undefined || username === null){
        return res.status(401).json({ error: "unauthorized" });
    }
    if(id === undefined || pld === undefined){
        return res.status(400).json({ error: "bad request, missing fields" });
    }
    try{
        singletonMetadataModel.setUserFilePermission(id, pld, PermissionType.NON);
        return res.status(200).json({ message: "user file/folder permission deleted successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}