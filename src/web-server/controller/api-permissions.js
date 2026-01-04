const {singletonMetadataModel, PermissionType, AbilityRequirement} = require("../model/metadataModel");

function getFilePermissionController(req, res){
    const {id} = req.params;
    const permissions = singletonMetadataModel.getFilePermission(id);
    if(permissions === undefined || permissions === null){
        return res.status(404).json({ error: "file/folder doesn't exist" });//check if file/folder exists
    }
    return res.status(200).json({ filePermissions: Object.keys(PermissionType).find(key => PermissionType[key] === permissions.filePermissions)});
}

function setFilePermissionController(req, res){
    const {id} = req.params;
    const {filePermission} = req.body;
    if(id === undefined || filePermission === undefined){
        return res.status(400).json({ error: "missing fields" });//id and permission type are required
    }
    if(!Object.keys(PermissionType).includes(filePermission)){
        return res.status(400).json({ error: "invalid permission type" });//invalid permission type
    }
    if(singletonMetadataModel.setFilePermission(id, PermissionType[filePermission]) !== null){
        
        return res.status(200).json({ message: "file/folder permission updated successfully" });
    } else {
        return res.status(500).json({ error: "file/folder doesn't exists" });
    }
}

function patchFilePermissionController(req, res){
    const {id,pid} = req.params;
    const {filePermission} = req.body;

    if(id === undefined || filePermission === undefined || pid === undefined){
        return res.status(400).json({ error: "bad request, missing fields" });
    }
    if(!Object.keys(PermissionType).includes(filePermission)){
        return res.status(400).json({ error: "bad request, invalid permission type" });
    }
    const Node = singletonMetadataModel.getFileNode(id)
    if(Node == undefined){
        return res.status(404).json({ error: "file/folder doesn't exist" });
    }
    if(singletonMetadataModel.setUserFilePermission(id, pid, PermissionType[filePermission]) !== null){
        return res.status(200).json({ message: "file/folder permission updated successfully" });
    } else{
        return res.status(500).json({ error: "file/folder doesn't exist"});
    }
}

function deleteFilePermissionController(req, res){
    const {id, pid} = req.params;

    if(id === undefined || pid === undefined){
        return res.status(400).json({ error: "bad request, missing fields" });
    }
    try{
        singletonMetadataModel.setUserFilePermission(id, pid, PermissionType.NON);
        return res.status(200).json({ message: "user file/folder permission deleted successfully" });
    } catch (err) {
        return res.status(500).json({ error: "file/folder doesn't exists" });
    }
}

module.exports = {getFilePermissionController, setFilePermissionController,
     patchFilePermissionController, deleteFilePermissionController};