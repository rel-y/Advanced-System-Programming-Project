const { singletonMetadataModel, PermissionType, NodeType } = require("../model/metadataModel");
const fileModel = require("../model/FileModel");

async function getReqController(req, res) {
    const loggedInUsername = req.headers['username'];
    if (loggedInUsername === undefined) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'user must be logged in. username in header' }));
    }
    
    const inputId = req.params.id;

    const fileNode = singletonMetadataModel.getFileNode(inputId);

    if (fileNode === undefined) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'No such file/folder exists' }));
    }
    singletonMetadataModel.updateLastAccess(inputId, loggedInUsername);
    if(fileNode.type === NodeType.FOLDER){
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const retjson = { id: inputId, ...fileNode,
            filePermissions: Object.keys(PermissionType).find(key => PermissionType[key] === fileNode.filePermissions)
        };
        res.end(JSON.stringify(retjson));
    }else if(fileNode.type === NodeType.FILE){
        let output = await fileModel.getFile(inputId);
        const code = parseInt(output.slice(0, 3), 10);
        if (code !== 200) {
            res.writeHead(code, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "error reading file" }));
        }
        output = output.slice(output.indexOf("\n\n") + 2);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const retjson = { id: inputId, ...fileNode, content: output,
            filePermissions: Object.keys(PermissionType).find(key => PermissionType[key] === fileNode.filePermissions)
         };
        res.end(JSON.stringify(retjson));
    }
}

async function patchReqController(req, res) {
    const loggedInUsername = req.headers['username'];
    if (loggedInUsername === undefined) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'user must be logged in. username in header' }));
    }
    
    const inputId = req.params.id;

    const fileNode = singletonMetadataModel.getFileNode(inputId);

    if (fileNode === undefined) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'No such file/folder exists' }));
    }

    let {name, data, starred, inBin} = req.body;
    if (!name && !data) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Empty change requset' }));
    }
    if (starred !== undefined && starred !== null) {
        singletonMetadataModel.setStarredStatus(inputId, starred,loggedInUsername);
    }
    if (inBin !== undefined && inBin !== null) {
        singletonMetadataModel.setTrashStatus(inputId, inBin);
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
        res.writeHead(code, { 'Content-Type': 'application/json' });
    } else { // only name changes
        res.writeHead(204);
    }

    res.end();
}

async function deleteReqController(req, res) {
    const loggedInUsername = req.headers['username'];
    if (loggedInUsername === undefined) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'user must be logged in. username in header' }));
    }
    
    const inputId = req.params.id;

    const fileNode = singletonMetadataModel.getFileNode(inputId);

    if (fileNode === undefined) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'No such file/folder exists' }));
    }
    if(fileNode.isInTrash === false){
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