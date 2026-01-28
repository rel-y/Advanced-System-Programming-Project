const {PermissionType} = require("../model/metadataModelMongo");

const {getUser, addUser, updateUserTokenVersion, getUsertokenVersion, isFileAccessedByUser} = require("../services/usersServices");

const { ensureRootExists, toClientNode, getFileNode, listChildIds, listChildren, addFileNode, deleteFileNode,updateLastAccess,renameFileNode,searchFileIdByName,isAbaleTo,getFilePermissionsForUser,getFilePermission,setFilePermission,setUserFilePermission,setStarredStatus,setTrashStatus,setSize,getAllFolderNodes,getAllBaseNodes,getAllMetadata,getAllNodes} = require("../services/metadataServices");


async function getFilePermissionController(req, res){
    const {id} = req.params;
    const permissions = await getFilePermission(id);
    if(permissions === undefined || permissions === null){
        return res.status(404).json({ error: "file/folder doesn't exist" });//check if file/folder exists
    }

    const loggedInUsername = req.user.username;
    if (!(await isAbaleTo(loggedInUsername, id, "READ_PERMISSIONS"))) {
        return res.status(401).json({ error: "user does not have READ_PERMISSIONS permission for this file" });
    }

    return res.status(200).json({ filePermissions: Object.keys(PermissionType).find(key => PermissionType[key] === permissions.filePermissions)});
}

async function setFilePermissionController(req, res){
    const {id} = req.params;
    const {filePermission} = req.body;
    if(id === undefined || filePermission === undefined){
        return res.status(400).json({ error: "missing fields" });//id and permission type are required
    }
    if(!Object.keys(PermissionType).includes(filePermission)){
        return res.status(400).json({ error: "invalid permission type" });//invalid permission type
    }

    const fileNode = await getFileNode(id);
    
    if (fileNode === undefined) {
        return res.status(404).json({ error: "file/folder doesn't exists" });
    }

    const loggedInUsername = req.user.username;
    if (!(await isAbaleTo(loggedInUsername, id, "CHANGE_FILE_PERMISSIONS"))) {
        return res.status(401).json({ error: "user does not have CHANGE_FILE_PERMISSIONS permission for this file" });
    }

    await setFilePermission(id, PermissionType[filePermission]);
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

async function patchFilePermissionController(req, res){
    const {id,pid} = req.params;
    const {filePermission} = req.body;

    if(id === undefined || filePermission === undefined || pid === undefined){
        return res.status(400).json({ error: "bad request, missing fields" });
    }
    if(!Object.keys(PermissionType).includes(filePermission)){
        return res.status(400).json({ error: "bad request, invalid permission type" });
    }

    const requestedUser = await getUser(pid);

    if (requestedUser === undefined) {
        return res.status(400).json({ error: "person with id pid does not exist" });
    }

    const Node = await getFileNode(id)
    if(Node === undefined){
        return res.status(404).json({ error: "file/folder doesn't exist" });
    }
    

    const loggedInUsername = req.user.username;
    
    if (await isAbaleTo(loggedInUsername, id, "CHANGE_ALL_USER_PERMISSIONS")) { // if user is owner allow
        await setUserFilePermission(id, pid, PermissionType[filePermission]);
        return res.status(200).json({ message: "file/folder permission updated successfully" });
    }

    if (await isAbaleTo(pid, id, "CHANGE_FILE_PERMISSIONS")) { // if trying to set for FILE_MANAGER dont allow
        return res.status(401).json({ error: "non-owner cannot change permissions of a file manager" });
    }

    if (!await isAbaleTo(loggedInUsername, id, "CHANGE_REGULAR_USER_PERMISSIONS")) {
        return res.status(401).json({ error: "user does not have CHANGE_REGULAR_USER_PERMISSIONS for this file" });
    }

    await setUserFilePermission(id, pid, PermissionType[filePermission]);
    return res.status(200).json({ message: "file/folder permission updated successfully" });
    
    /*
    if(singletonMetadataModel.setUserFilePermission(id, pid, PermissionType[filePermission]) !== null){
        return res.status(200).json({ message: "file/folder permission updated successfully" });
    } else{
        return res.status(500).json({ error: "file/folder doesn't exist"});
    } */
}

async function deleteFilePermissionController(req, res){
    const {id, pid} = req.params;

    if(id === undefined || pid === undefined){
        return res.status(400).json({ error: "bad request, missing fields" });
    }
    try{
        const fileNode = await getFileNode(id);
        if (fileNode === undefined) {
            return res.status(404).json({ error: "file/folder doesn't exists" });
        }

        const loggedInUsername = req.user.username;

            
        if (await isAbaleTo(loggedInUsername, id, "CHANGE_ALL_USER_PERMISSIONS")) { // if user is owner allow
            await setUserFilePermission(id, pid, PermissionType[0]);
            return res.status(200).json({ message: "file/folder permission updated successfully" });
        }

        if (await isAbaleTo(pid, id, "CHANGE_FILE_PERMISSIONS")) { // if trying to set for FILE_MANAGER dont allow
            return res.status(401).json({ error: "non-owner cannot change permissions of a file manager" });
        }

        if (!(await isAbaleTo(loggedInUsername, id, "CHANGE_REGULAR_USER_PERMISSIONS"))) {
            return res.status(401).json({ error: "user does not have CHANGE_REGULAR_USER_PERMISSIONS for this file" });
        }

        await setUserFilePermission(id, pid, PermissionType[0]);
        return res.status(200).json({ message: "file/folder permission updated successfully" });
        
    } catch (err) {
        return res.status(500).json({ error: "file/folder doesn't exists" });
    }
}

module.exports = {getFilePermissionController, setFilePermissionController,
     patchFilePermissionController, deleteFilePermissionController};