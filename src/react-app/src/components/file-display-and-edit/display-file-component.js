import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './display-file-component.css';
import Element from "../login and singup/Element";

import fetchFromWebServer from  '../../api';


function DisplayFileComponent() {
    
    const [data, setData] = useState('');
    
    const {id : paramId } = useParams();
    const idRef = useRef(paramId); // 0 is root
    console.log(idRef.current);
    fetchFromWebServer(`http://localhost:8080/api/files/${idRef.current}`, {
        //body: JSON.stringify(this.state),
        headers: {
            'content-type': 'application/json'
        },
        method: 'GET'
    }).then(async (response) => {
        console.log(response);
        if (response.status === 200) { //user was created passing to login
            const d = await response.json();
            setData(d);
        } else { //waiting for the response to tell the user what went wrong
          const errorData = await response.json();
          console.log(errorData);
          //setGeneralError(errorData.error || "Unknown error");
        }
      });
    console.log(data);
    return (
    <div className="file-container">
        <h2>{data.name}</h2>

        <pre className="file-content">
        {data.content}
        </pre>
    </div>
    );
}

export default DisplayFileComponent;