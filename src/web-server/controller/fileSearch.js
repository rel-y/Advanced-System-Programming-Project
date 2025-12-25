const { singletonMetadataModel, NodeType } = require("../model/metadataModel");
const {searchFiles, getFile} = require("../model/FileModel");

async function getSearchFileController(req, res) {
    const { query } = req.query;
    if (!query || query.trim() === "") {
        return res.status(400).json({ error: "bad request, query parameter is required" });
    }

    // from metadata model
    const idsFromMetadata = singletonMetadataModel.searchFileIdByName(query); // array of ids

    // from searchFiles
    let idsFromSearch = [];
    try{
    idsFromSearch = (await searchFiles(query))
        .split(" ")
        .map(id => id.trim())
        .filter(Boolean); // filter out empty strings
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
        let content;
        if(node.type === NodeType.FOLDER){
            content = null;
        } else
            try{
                content = await getFile(combinedIds[i]);
                content = content.substring(0,content.length -1)
            } catch (err) {
                content = `Error retrieving file ${combinedIds[i]} content with error: ${err.message}`;
            }
        results.push({
            id: combinedIds[i],
            name: node.name,
            content: content?? null,
            fullPath: fullPath,
            type: node.type
        });
    }


    return res.status(200).json(results);
}

    