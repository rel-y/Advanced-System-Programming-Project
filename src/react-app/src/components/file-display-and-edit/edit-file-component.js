import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './edit-file-component.css';
import fetchFromWebServer from '../../api';

function EditFileComponent() {
  const { id: paramId } = useParams();
  const navigate = useNavigate();

  
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  return (
    <div className="file-page container-fluid">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="file-card">
            <div className="file-card-body">

              {/* File name input (replaces title) */}
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control file-name-input text-center"
                  placeholder="File name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* File content input (replaces <pre>) */}
              <div className="mb-3">
                <textarea
                  className="form-control file-content-input"
                  placeholder="File content..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Floating buttons */}
      <div className="floating-btns d-flex gap-2">
        <button
          className="floating-btn primary-btn"
          onClick={async () => {
            console.log('Saving file:', { paramId, name, content });

            try {
                const reqbody = {};
                const response = await fetchFromWebServer(`http://localhost:8080/api/files/${paramId}`, {
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ // only include fields if user inputted them. 
                            ...(name ? { name: name } : {}),
                            ...(content ? { data: content } : {})
                        }),
                        method: 'PATCH'
                });



            } catch (error) {
                console.error('Error saving file:', error);
            }

            navigate(-1); // go back after save (for now)
          }}
        >
          Save
        </button>

        <button
          className="floating-btn secondary-btn"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditFileComponent;
