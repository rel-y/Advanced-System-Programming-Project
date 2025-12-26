const { singletonMetadataModel, NodeType } = require("../model/metadataModel");
const {searchFiles, getFile} = require("../model/FileModel");

async function getSearchFileController(req, res) {
    const { query } = req.query;
    const {username} = req.user; // from authentication middleware
    if(username === undefined || username === null){
        return res.status(401).json({ error: "unauthorized" });
    }
    if (!query || query.trim() === "") {
        return res.status(400).json({ error: "bad request, query parameter is required" });
    }

    // from metadata model
    const idsFromMetadata = singletonMetadataModel.searchFileIdByName(query); // array of ids

    // from searchFiles
    let idsFromSearch = [];
    try{
    idsFromSearch = ((await searchFiles(query)).split("\n").splice(2))[0].split(" ")
        .map(id => id.trim())
        .filter(Boolean);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

    // combine without duplicates
    const combinedIds = [...new Set([
        ...idsFromMetadata,
        ...idsFromSearch
    ])];
    let results = [];
    for (let i = 0; i < combinedIds.length; i++) {
        const fullPath = singletonMetadataModel.getFullPath(combinedIds[i]);
        const node = singletonMetadataModel.getFileNode(combinedIds[i]);
        results.push({
            id: combinedIds[i],
            name: node.name,
            fullPath: fullPath,
            type: node.type
        });
    }


    return res.status(200).json(results);
}

module.exports = {getSearchFileController};