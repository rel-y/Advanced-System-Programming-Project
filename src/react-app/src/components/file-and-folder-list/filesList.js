import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './filesList.css'
import ListElement from './fileListElement.js';
import fetchFromWebServer from "../../api.js";
import { useNodes } from "../nodeListContext.jsx";

function FileList() {
    const { nodes, setNodes, currentFolder, setCurrentFolder } = useNodes();
    const navigate = useNavigate();

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
<<<<<<< HEAD:src/react-app/src/components/file and folder list/filesList.js
            if(currentFolder === 0){
                setFolderName("");
=======
            if (currentFolder === 0) {
                setFolderName("MyDrive");
>>>>>>> 3e588820ad378e5366660ed6791ec320080ebe87:src/react-app/src/components/file-and-folder-list/filesList.js
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
<<<<<<< HEAD:src/react-app/src/components/file and folder list/filesList.js
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
=======

>>>>>>> 3e588820ad378e5366660ed6791ec320080ebe87:src/react-app/src/components/file-and-folder-list/filesList.js
    return (
        <div
            className='hello'
              style={{
                flex: 1,
                overflowY: "auto",
                minHeight: 0,
                
              }}
        >
            <p>
                {folderName}
            </p>
            <div style={{overflowY: "auto"}}>
            {nodes.map((file) => {

                const handleClick = file.type === "FILE" ? openFile : changeFolder;
                console.log(file);
                return (<ListElement
                    fileId={file.id}
                    fileName={file.name}
                    owner={file.uid}
                    size={file.size}
                    date={file.lastAccess}
                    location={file.parentName}
                    funcOnClick={() => handleClick(file.id)}
                />
                )
            })}
            </div>
        </div>
    );
}

export default FileList;