const {searchFiles, getFile} = require("../model/FileModel");

const { ensureRootExists, toClientNode, getFileNode, listChildIds, listChildren, addFileNode, deleteFileNode,updateLastAccess,renameFileNode,searchFileIdByName,isAbaleTo,getFilePermissionsForUser,getFilePermission,setFilePermission,setUserFilePermission,setStarredStatus,setTrashStatus,setSize,getAllFolderNodes,getAllBaseNodes,getAllMetadata,getAllNodes} = require("../services/metadataServices");

async function getSearchFileController(req, res) {
    const { query } = req.params;

    if (!query || query.trim() === "") {
        return res.status(400).json({ error: "bad request, query parameter is required" });
    }

    // from metadata model
    const idsFromMetadata = await searchFileIdByName(query); // array of ids

    // from searchFiles
    let idsFromSearch = [];
    try{
        let matchesInCServer = await searchFiles(query);
        if (matchesInCServer === "200 OK\n") { // no matches in cServer
            idsFromSearch = []
        } else {
            idsFromSearch = ((matchesInCServer).split("\n").splice(2))[0].split(" ")
            .map(id => id.trim())
            .filter(Boolean);
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

    // combine without duplicates
    const combinedIds = [...new Set([
        ...idsFromMetadata,
        ...idsFromSearch
    ])];

    const loggedInUsername = req.user.username;

    const filteredByPermissions = (
        await Promise.all(
        combinedIds.map(async (id) => {
            const allowed = await isAbaleTo(loggedInUsername, id, "READ");
            return allowed ? item : null;
        })
        )
    ).filter(Boolean);

    const metadata = await Promise.all(
        filteredByPermissions.map((id) =>
        getAllMetadata({id:id}, loggedInUsername)
        )
    );

    return res.status(200).json(metadata);
}

module.exports = {getSearchFileController};