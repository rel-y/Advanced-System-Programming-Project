const {singletonMetadataModel, PermissionType, AbilityRequirement} = require("../model/metadataModel");

function getFilePermissionController(req, res){
    const {id} = req.params;
    const permissions = singletonMetadataModel.getFilePermission(id);
    if(permissions === undefined || permissions === null){
        return res.status(404).json({ error: "file/folder doesn't exist" });//check if file/folder exists
    }

    const loggedInUsername = req.user.username;
    if (!singletonMetadataModel.isAbaleTo(loggedInUsername, id, "READ_PERMISSIONS")) {
        return res.status(401).json({ error: "user does not have READ_PERMISSIONS permission for this file" });
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
    
    if (!singletonMetadataModel.map.has(id)) {
        return res.status(404).json({ error: "file/folder doesn't exists" });
    }

    const loggedInUsername = req.user.username;
    if (!singletonMetadataModel.isAbaleTo(loggedInUsername, id, "CHANGE_FILE_PERMISSIONS")) {
        return res.status(401).json({ error: "user does not have CHANGE_FILE_PERMISSIONS permission for this file" });
    }

    singletonMetadataModel.setFilePermission(id, PermissionType[filePermission]);
    return res.status(200).json({ message: "file/folder permission updated successfully" });

    /*
    if(singletonMetadataModel.setFilePermission(id, PermissionType[filePermission]) !== null){
        const loggedInUsername = req.user.username;
        if (!singletonMetadataModel.isAbaleTo(loggedInUsername, id, "CHANGE_FILE_PERMISSIONS")) {
            return res.status(401).json({ error: "user does not have CHANGE_FILE_PERMISSIONS permission for this file" });
        }
        return res.status(200).json({ message: "file/folder permission updated successfully" });
    } else {
        return res.status(500).json({ error: "file/folder doesn't exists" });
    }
        */
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
    

    const loggedInUsername = req.user.username;
    
    if (singletonMetadataModel.isAbaleTo(loggedInUsername, id, "CHANGE_ALL_USER_PERMISSIONS")) { // if useer is owner allow
        singletonMetadataModel.setUserFilePermission(id, pid, PermissionType[filePermission]);
        return res.status(200).json({ message: "file/folder permission updated successfully" });
    }

    if (singletonMetadataModel.isAbaleTo(pid, id, "CHANGE_FILE_PERMISSIONS")) { // if trying to set for FILE_MANAGER dont allow
        return res.status(401).json({ error: "non-owner cannot change permissions of a file manager" });
    }

    if (!singletonMetadataModel.isAbaleTo(loggedInUsername, id, "CHANGE_REGULAR_USER_PERMISSIONS")) {
        return res.status(401).json({ error: "user does not have CHANGE_REGULAR_USER_PERMISSIONS for this file" });
    }

    singletonMetadataModel.setUserFilePermission(id, pid, PermissionType[filePermission]);
        return res.status(200).json({ message: "file/folder permission updated successfully" });
    
    /*
    if(singletonMetadataModel.setUserFilePermission(id, pid, PermissionType[filePermission]) !== null){
        return res.status(200).json({ message: "file/folder permission updated successfully" });
    } else{
        return res.status(500).json({ error: "file/folder doesn't exist"});
    } */
}

function deleteFilePermissionController(req, res){
    const {id, pid} = req.params;

    if(id === undefined || pid === undefined){
        return res.status(400).json({ error: "bad request, missing fields" });
    }
    try{
        if (!singletonMetadataModel.map.has(id)) {
            return res.status(404).json({ error: "file/folder doesn't exists" });
        }

        const loggedInUsername = req.user.username;
        if (!singletonMetadataModel.isAbaleTo(loggedInUsername, id, "DELETE")) {
            return res.status(401).json({ error: "user does not have DELETE permission for this file" });
        }
        
        singletonMetadataModel.setUserFilePermission(id, pid, PermissionType.NON);
        return res.status(200).json({ message: "user file/folder permission deleted successfully" });
    } catch (err) {
        return res.status(500).json({ error: "file/folder doesn't exists" });
    }
}

module.exports = {getFilePermissionController, setFilePermissionController,
     patchFilePermissionController, deleteFilePermissionController};