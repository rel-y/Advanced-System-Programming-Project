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
                setFolderName("MyDrive");
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

    return (
        <div>
            <p>
                {folderName}
            </p>
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
                    isStarred={file.isStarred}
                    isTrash={file.isInTrash}
                    funcOnClick={() => handleClick(file.id)}
                />
                )
            })}
        </div>
    );
}

export default FileList;