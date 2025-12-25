const { singletonMetadataModel, NodeType } = require("../model/metadataModel");
const fileModel = require("../model/FileModel");

function getReqController(req, res) {
    const inputId = req.params.id;

    const fileNode = singletonMetadataModel.getFileNode(inputId);

    if (fileNode === undefined) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'No such file/folder exists' }));
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    const retjson = { id: inputId, ...fileNode };
    res.end(JSON.stringify(retjson));
}

async function patchReqController(req, res) {
    const inputId = req.params.id;

    const fileNode = singletonMetadataModel.getFileNode(inputId);

    if (fileNode === undefined) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'No such file/folder exists' }));
    }

    let {name, data} = req.body;
    if (!name && !data) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Empty change requset' }));
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
    if (data) {
        let output = await fileModel.patchFile(inputId, data);
        const code = parseInt(output.slice(0, 3), 10);
        res.writeHead(code, { 'Content-Type': 'application/json' });
    } else { // only name changes
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