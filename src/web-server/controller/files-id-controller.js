const { singletonMetadataModel, PermissionType, NodeType } = require("../model/metadataModel");
const {singletonUsersModel} = require("../model/usersModel"); 
const fileModel = require("../model/FileModel");

async function getReqController(req, res) {

    const inputId = req.params.id;

    let access = req.headers.access;// to update last access or not
    if(access === undefined || access === null){
        access = true; // true by defualt so everything old still works
    }
    if(access === "false")
        access = false;
    const fileNode = singletonMetadataModel.getFileNode(inputId);

    if (fileNode === undefined) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'No such file/folder exists' }));
    }

    const loggedInUsername = req.user.username;
    if (!singletonMetadataModel.isAbaleTo(loggedInUsername, inputId, "READ")) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'user has no read permissions for this file/folder' }));
    }
    if(access)
        singletonMetadataModel.updateLastAccess(inputId, loggedInUsername);
    if(fileNode.type === NodeType.FOLDER){
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const retjson = { id: inputId, ...fileNode, permissionsForFile: singletonMetadataModel.getFilePermissionsForUser(loggedInUsername, inputId) };
        
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
        const lastAccess = singletonUsersModel.getUser(loggedInUsername)?.filemap?.get(inputId)?.[0] ?? fileNode.createdAt;
        const isStarred = singletonUsersModel.getUser(loggedInUsername)?.filemap?.get(inputId)?.[1] ?? false;
        const retjson = { id: inputId, ...fileNode,lastAccess:lastAccess,isStarred:isStarred, content: output, permissionsForFile: singletonMetadataModel.getFilePermissionsForUser(loggedInUsername, inputId) };
        
        delete retjson.filePermissions; // dont show permissions
        delete retjson.userFilePermissions;

        res.end(JSON.stringify(retjson));
    }
}

async function patchReqController(req, res) {
    const inputId = req.params.id;

    const fileNode = singletonMetadataModel.getFileNode(inputId);

    if (fileNode === undefined) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'No such file/folder exists' }));
    }

    const loggedInUsername = req.user.username;
    let { name, data, starred, trash } = req.body;

    if (!(starred === null || starred === undefined) && !singletonMetadataModel.isAbaleTo(loggedInUsername, inputId, "READ")) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'user has no READ permissions for this file/folder' }));
    }
    if ((name || data) && !singletonMetadataModel.isAbaleTo(loggedInUsername, inputId, "WRITE")) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'user has no WRITE permissions for this file/folder' }));
    }
    if (!(trash === null || trash === undefined) && !singletonMetadataModel.isAbaleTo(loggedInUsername, inputId, "DELETE")) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'user has no DELETE permissions for this file/folder' }));
    }
    //now for every action the user is doing we checked he has the permissions to do it
    if (!name && !data && (starred === null || starred === undefined) && (trash === null || trash === undefined)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Empty change requset' }));
    }
    if (!(starred === null || starred === undefined)) {
        singletonMetadataModel.setStarredStatus(inputId, starred, loggedInUsername);
    }
    if (!(trash === null || trash === undefined)) {
        singletonMetadataModel.setTrashStatus(inputId, trash, loggedInUsername);
    }
    // change name and data, if they are requested
    if (name) {
        try {
            singletonMetadataModel.renameFileNode(inputId, name);
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: err.message }));
        }
    }
    singletonMetadataModel.updateLastAccess(inputId, loggedInUsername);
    if (data && fileNode.type === NodeType.FILE) {
        let output = await fileModel.patchFile(inputId, data);
        const code = parseInt(output.slice(0, 3), 10);
        singletonMetadataModel.setSize(inputId, data.length);
        res.writeHead(code, { 'Content-Type': 'application/json' });
    } else { // didn't change data
        res.writeHead(204);
    }

    res.end();
}

async function deleteReqController(req, res) {

    const inputId = req.params.id;

    const fileNode = singletonMetadataModel.getFileNode(inputId);

    if (fileNode === undefined) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'No such file/folder exists' }));
    }

    const loggedInUsername = req.user.username;
    if (!singletonMetadataModel.isAbaleTo(loggedInUsername, inputId, "DELETE")) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'user has no DELETE permissions for this file/folder' }));
    }

    if (fileNode.isInTrash === false) {
        singletonMetadataModel.setTrashStatus(inputId, true);
        res.writeHead(204, { 'Content-Type': 'application/json' });
        return res.end();
    }
    try { // catches if attempting bad deletion
        singletonMetadataModel.deleteFileNode(inputId);
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
