const fileModel = require("../model/FileModel");

const {NodeType} = require("../model/metadataModelMongo");

const { ensureRootExists, toClientNode, getFileNode, listChildIds, listChildren, addFileNode, deleteFileNode,updateLastAccess,renameFileNode,searchFileIdByName,isAbaleTo,getFilePermissionsForUser,getFilePermission,setFilePermission,setUserFilePermission,setStarredStatus,setTrashStatus,setSize,getAllFolderNodes,getAllBaseNodes,getAllMetadata,getAllNodes} = require("../services/metadataServices");


async function getReqController(req, res) {

    const inputId = req.params.id;

    const fileNode = await getFileNode(inputId);

    if (fileNode === undefined) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'No such file/folder exists' }));
    }

    const loggedInUsername = req.user.username;
    if (!(await isAbaleTo(loggedInUsername, inputId, "READ"))) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'user has no read permissions for this file/folder' }));
    }

    await updateLastAccess(inputId, loggedInUsername);
    if(fileNode.type === NodeType.FOLDER){
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const retjson = { id: inputId, ...fileNode, permissionsForFile: await getFilePermissionsForUser(loggedInUsername, inputId) };
        
        delete retjson.filePermissions; // dont show permissions
        delete retjson.userFilePermissions;

        res.end(JSON.stringify(retjson));

    }else if(fileNode.type === NodeType.FILE){
        let output = await fileModel.getFile(inputId);
        const code = parseInt(output.slice(0, 3), 10);
        if (code !== 200) {
            res.writeHead(code, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "error reading file" }));
            return;
        }
        output = output.slice(output.indexOf("\n\n") + 2);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const retjson = { id: inputId, ...fileNode, content: output, permissionsForFile: await getFilePermissionsForUser(loggedInUsername, inputId) };
        
        delete retjson.filePermissions; // dont show permissions
        delete retjson.userFilePermissions;

        res.end(JSON.stringify(retjson));
    }
}

async function patchReqController(req, res) {
    const inputId = req.params.id;

    const fileNode = await getFileNode(inputId);

    if (fileNode === undefined) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'No such file/folder exists' }));
    }

    const loggedInUsername = req.user.username;
    let { name, data, starred, trash } = req.body;

    if (!(starred === null || starred === undefined) && !(await isAbaleTo(loggedInUsername, inputId, "READ"))) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'user has no READ permissions for this file/folder' }));
    }
    if ((name || data) && !(await isAbaleTo(loggedInUsername, inputId, "WRITE"))) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'user has no WRITE permissions for this file/folder' }));
    }
    if (!(trash === null || trash === undefined) && !(await isAbaleTo(loggedInUsername, inputId, "DELETE"))) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'user has no DELETE permissions for this file/folder' }));
    }
    //now for every action the user is doing we checked he has the permissions to do it
    if (!name && !data && (starred === null || starred === undefined) && (trash === null || trash === undefined)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Empty change requset' }));
    }
    if (!(starred === null || starred === undefined)) {
        await setStarredStatus(inputId, starred, loggedInUsername);
    }
    if (!(trash === null || trash === undefined)) {
        await setTrashStatus(inputId, trash, loggedInUsername);
    }
    // change name and data, if they are requested
    if (name) {
        try {
            await renameFileNode(inputId, name);
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: err.message }));
        }
    }
    await updateLastAccess(inputId, loggedInUsername);
    if (data && fileNode.type === NodeType.FILE) {
        let output = await fileModel.patchFile(inputId, data);
        const code = parseInt(output.slice(0, 3), 10);
        await setSize(inputId, data.length);
        res.writeHead(code, { 'Content-Type': 'application/json' });
    } else { // didn't change data
        res.writeHead(204);
    }

    res.end();
}

async function deleteReqController(req, res) {

    const inputId = req.params.id;

    const fileNode = await getFileNode(inputId);

    if (fileNode === undefined) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'No such file/folder exists' }));
    }

    const loggedInUsername = req.user.username;
    if (!(await isAbaleTo(loggedInUsername, inputId, "DELETE"))) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'user has no DELETE permissions for this file/folder' }));
    }

    if (fileNode.isInTrash === false) {
        await setTrashStatus(inputId, true);
        res.writeHead(204, { 'Content-Type': 'application/json' });
        return res.end();
    }
    try { // catches if attempting bad deletion
        await deleteFileNode(inputId);
    } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: err.message }));
    }

    if (fileNode.type === NodeType.FOLDER) {
        res.writeHead(204, { 'Content-Type': 'application/json' });
        return res.end();
    }

    let output = await fileModel.deleteFile(inputId);
    const code = parseInt(output.slice(0, 3), 10);
    res.writeHead(code, { 'Content-Type': 'application/json' });
    res.end();
}

module.exports = {
    getReqController,
    patchReqController,
    deleteReqController
};
