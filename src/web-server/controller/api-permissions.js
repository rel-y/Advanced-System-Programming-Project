const {singletonMetadataModel, PermissionType, AbilityRequirement} = require("../model/metadataModel");

function getFilePermissionController(req, res){
    const {id} = req.params;
    try{
        const permissions = singletonMetadataModel.getFilePermission(id);
        if(permissions === undefined || permissions === null){
            return res.status(404).json({ error: "file/folder doesn't exist" });
        }
        return res.status(200).json({ filePermissions: permissions.filePermissions});
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

function setFilePermissionController(req, res){
    const {id} = req.params;
    const {filePermission} = req.body;
    const {username} = req.body; // from authentication middleware
    if(username === undefined || username === null){
        return res.status(401).json({ error: "unauthorized" });
    }
    if(id === undefined || filePermission === undefined){
        return res.status(400).json({ error: "missing fields" });
    }
    if(!Object.keys(PermissionType).includes(filePermission)){
        return res.status(400).json({ error: "invalid permission type" });
    }
    try{
        singletonMetadataModel.setFilePermission(id, PermissionType[filePermission]);
        return res.status(200).json({ message: "file/folder permission updated successfully" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}