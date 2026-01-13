import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './filesList.css'
import ListElement from './fileListElement.js';
import fetchFromWebServer from "../../api.js";
import { useNodes } from "../nodeListContext.jsx";

function FileList() {
    const { nodes, setNodes, currentFolder, setCurrentFolder } = useNodes();
    const navigate = useNavigate();
    const [menu, setMenu] = useState(null);

    const changeFolder = async (folderId) => {
        const url = `/api/folders/${folderId}`;

        try {
            const res = await fetchFromWebServer(url, {
                method: "GET",
                headers: { Accept: "application/json" },
            });

            if (!res.ok) throw new Error(`Request failed: ${res.status}`);
                window.history.pushState(
                { page: "my-ui-state", node:nodes, folder: currentFolder},
                    "",
                    window.location.href
                );
            const data = await res.json();
            console.log("Filter fetch data:", data);
            setNodes(Array.isArray(data) ? data : data.nodes ?? data.files ?? []);
            setCurrentFolder(folderId)
        } catch (err) {
            console.error("Filter fetch failed:", err);
        }
    }
    const openFile = (fileId) => {
        navigate(`/api/files/${fileId}`);
    }
    const [folderName, setFolderName] = useState(0);
    useEffect(() => {
        // Fetch file data
        const fetchFileData = async () => {
            if (currentFolder === 0) {
                setFolderName("");
                return;
            }
            try {
                const response = await fetchFromWebServer(`http://localhost:8080/api/files/${currentFolder}`, {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'GET'
                });

                if (response.ok) {
                    const fileData = await response.json();
                    setFolderName(fileData.name);
                } else {
                    console.error('Failed to fetch folder data');
                }
            } catch {
                console.error('network error')
            }
        };

        fetchFileData();
    }, [currentFolder]);
useEffect(() => {
  const onPop = (event) => {
    const state = event.state;

    if (state?.page === "my-ui-state") {
        console.log("idk:" + state.node);
      setNodes(state.node);
      setCurrentFolder(currentFolder);
    }
  };

  window.addEventListener("popstate", onPop);
  return () => window.removeEventListener("popstate", onPop);
}, []);
    return (
        <div
            className="hello" >
            <p className="FolderName fs-1">
                {folderName}
            </p>
            <div style={{ overflowY: "auto" }}>
                <ul className="list-group list-group-horizontal">
                    <li className="p-2 list-group-item TitleBox" style={{ width: "35%" }}>Name</li>
                    <li className="p-2 list-group-item TitleBox" style={{ width: "15%" }}>last Access</li>
                    <li className="p-2 list-group-item TitleBox" style={{ width: "10%" }}>Owner</li>
                    <li className="p-2 list-group-item TitleBox" style={{ width: "10%" }}>Size</li>
                    <li className="p-2 list-group-item TitleBox" style={{ width: "15%" }}>Location</li>
                </ul>
                {nodes.map((file) => {

                    const handleClick = file.type === "FILE" ? openFile : changeFolder;
                    console.log(file);
                    return (<ListElement
                        menu={menu}
                        setMenu={setMenu}
                        fileId={file.id}
                        fileName={file.name}
                        owner={file.uid}
                        size={file.size}
                        date={file.lastAccess}
                        location={file.parentName}
                        isStarred={file.isStarred}
                        isTrash={file.isInTrash}
                        funcOnClick={() => handleClick(file.id)}
                    />
                    )
                })}
            </div>
        </div>
    );
}

export default FileList;