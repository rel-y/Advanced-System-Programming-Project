import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './fileListElement.css'
function ListElement({ fileName, owner = "Unable to load user", size = "-", date, location }) {
    if (location === 0) {
        location = "My Drive";
    }
    return (
        <ul className="list-group list-group-horizontal lineHover-bg">
            <li className="p-2 list-group-item text-truncate detailBox" style={{width: "40%"}}>{fileName}</li>
            <li className="p-2 list-group-item detailBox" style={{width: "15%"}}>{date.toLocaleDateString()}</li>
            <li className="p-2 list-group-item detailBox" style={{width: "10%"}}>{owner}</li>
            <li className="p-2 list-group-item detailBox" style={{width: "10%"}}>{size}</li>
            <li className="p-2 list-group-item detailBox" style={{width: "15%"}}>{location}</li>
        </ul>
    )
}

export default ListElement;