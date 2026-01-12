import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './display-file-component.css';
import fetchFromWebServer from '../../api';

function DisplayFileComponent() {
  const [data, setData] = useState('');
  const [userPerms, setuserPerms] = useState('');
  

  const { id: paramId } = useParams();
  const navigate = useNavigate();

  // using useEffect to not make an infinite loop
  useEffect(() => {
    // Fetch file data
    const fetchFileData = async () => {
      try {
        const response = await fetchFromWebServer(`http://localhost:8080/api/files/${paramId}`, {
          headers: { 'Content-Type': 'application/json' },
          method: 'GET'
        });

        if (response.ok) {
          const fileData = await response.json();
          setData(fileData);

          setuserPerms(fileData.permissionsForFile);

        } else {
          console.error('Failed to fetch file data');
        }
      } catch (err) {
        console.error('Error fetching file or permissions:', err);
      }
    };

    fetchFileData();
  }, [paramId]);

    useEffect(() => {console.log(data);}, [data]);
    useEffect(() => {console.log(userPerms);}, [userPerms]);

  return (
    <div className="file-page container-fluid">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="file-card">
            <div className="file-card-body">
              <h5 className="file-title text-center mb-3">{data.name}</h5>
              <pre className="file-content">{data.content}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Floating buttons */}
      <div className="floating-btns d-flex gap-2">
        {userPerms >= 3 && (// only displays this if user can edit file, 3 is file editor
            <button className="floating-btn primary-btn"
                    onClick={() => navigate(`/api/files/${paramId}/edit`)}>
                Edit file
            </button>
        )}
        {userPerms >= 4 && (
            <button className="floating-btn secondary-btn"
                    onClick={() => navigate(`/api/files/${paramId}/permissions`)}>
                Edit permissions
            </button>)}
      </div>
    </div>
  );
}

export default DisplayFileComponent;
