import './fileListElement.css'
import fetchFromWebServer from '../../api';
import { ReactComponent as TrashIcon } from "./trash.svg";
import { ReactComponent as RemoveFromTrashIcon } from "./clock-history.svg"
import { useState } from 'react';
import { useNodes } from '../nodeListContext';
import { useNavigate } from 'react-router-dom';
function ListElement({ menu, setMenu, fileId, fileName, owner = "Unable to load user", size = "-", date, isStarred, isTrash, location, funcOnClick }) {
    const [starred, setStarred] = useState(isStarred);
    const [trash, setTrash] = useState(isTrash);
    const { nodes, setNodes } = useNodes();
    const navigate = useNavigate();

    if (location === 0) {
        location = "My Drive";
    }
    const customMenu = (e) => {
        e.preventDefault();
        if (!menu) {
            setMenu({
                id: fileId,
                x: e.clientX,
                y: e.clientY
            });
        } else if (menu.id !== fileId) {
            setMenu(prev => ({
                ...prev,
                id: fileId,
                x: e.clientX,
                y: e.clientY
            }));
        } else {
            setMenu(null);
        }
    }
    const setStarredStatus = async () => {
        try {
            const response = await fetchFromWebServer(`http://localhost:8080/api/files/${fileId}`, {
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    starred: !starred
                }),
                method: 'PATCH'
            });
            if (response.ok) {
                setStarred(!starred);
            } else {
                console.error('error staring item');
            }
        } catch (err) {
            console.error('Error fetching file:', err);
        }
    }
    const deleteFile = async () => {
        try {
            const response = await fetchFromWebServer(`http://localhost:8080/api/files/${fileId}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'DELETE'
            });
            if (response.ok) {
                if (trash) {
                    setNodes((prev) => prev.filter(node => node.id !== fileId));
                } else {
                    setTrash(true);
                }
            } else {
                console.error('error deleting item');
            }
        } catch (err) {
            console.error('Error fetching file:', err);
        }
    }
    const removeFromTrash = async () => {
        try {
            const response = await fetchFromWebServer(`http://localhost:8080/api/files/${fileId}`, {
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trash: false
                }),
                method: 'PATCH'
            });
            if (response.ok) {
                setTrash(false);
            } else {
                console.error('error removing item from trash');
            }
        } catch (err) {
            console.error('Error fetching file:', err);
        }
    }

    const formattedDate = new Date(date).toLocaleDateString('en-GB');

    return (
        <ul className="list-group list-group-horizontal lineHover-bg" onContextMenu={customMenu} onBlur={() => setMenu(null)}
  tabIndex={0} onClick={() => funcOnClick()}>
            <li className="p-2 list-group-item text-truncate detailBox" style={{ width: "35%" }}>{fileName}</li>
            <li className="p-2 list-group-item detailBox" style={{ width: "15%" }}>{formattedDate}</li>
            <li className="p-2 list-group-item detailBox" style={{ width: "10%" }}>{owner}</li>
            <li className="p-2 list-group-item detailBox" style={{ width: "10%" }}>{size}</li>
            <li className="p-2 list-group-item detailBox" style={{ width: "15%" }}>{location}</li>
            {!trash && <li className="p-2 list-group-item detailBox" style={{ width: "5%" }}></li>}
            <li className="rounded-pill p-2 list-group-item detailBox" style={{ width: "5%" }}>
                <button className="position-absolute top-50 translate-middle-y btn buttonElement rounded-pill" onClick={(e) => {
                    e.stopPropagation()
                    setStarredStatus()
                }}>&#9734;</button>
            </li>
            <li className="p-2 list-group-item detailBox" style={{ width: "5%" }}>
                <button className="position-absolute top-50 translate-middle-y btn buttonElement rounded-pill" onClick={(e) => {
                    e.stopPropagation()
                    deleteFile()
                }}><TrashIcon width={16} height={16} className="icon" /></button>
            </li>
            {trash && <li className="p-2 list-group-item detailBox" style={{ width: "5%" }}>
                <button className="position-absolute top-50 translate-middle-y btn buttonElement rounded-pill" onClick={(e) => {
                    e.stopPropagation()
                    removeFromTrash()
                }}><RemoveFromTrashIcon width={16} height={16} className="icon" /></button>
            </li>}
            {menu && menu.id === fileId && (
                <div className="customMenu"
                    style={{
                        top: menu.y,
                        left: menu.x,
                    }}>
                    <button
                        type="button"
                        className="btn optionsElement"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/api/files/${fileId}`);
                        }}>
                        View And Edit
                    </button>
                </div>
            )}

        </ul>
    )
}

export default ListElement;