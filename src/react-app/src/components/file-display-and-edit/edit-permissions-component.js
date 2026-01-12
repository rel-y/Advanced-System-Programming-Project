import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './edit-permissions-component.css';
import fetchFromWebServer from '../../api';

function EditPermissionsComponent() {
  const { id: paramId } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [permission, setPermission] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  // actual setter, logic is in here
  const savePermissions = async () => {
    setError('');

    try {
      const response = await fetchFromWebServer(
        `http://localhost:8080/api/files/${paramId}/permissions/${username}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({filePermission: permission})
        }
      );

      if (response.ok) {
        setShowSuccess(true);
      } else {
        setError('Failed to update permissions');
      }
    } catch (err) {
      console.error(err);
      setError('Server error while updating permissions');
    }
  };

  return (
    <div className="file-page container-fluid">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <div className="file-card">
            <div className="file-card-body">

              <h4 className="text-center mb-4">Edit File Permissions</h4>

              {/* Username */}
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* Permission selector */}
              <div className="mb-3">
                <label className="form-label">Permission</label>
                <select
                  className="form-select"
                  value={permission}
                  onChange={(e) => setPermission(e.target.value)}
                >
                  <option value="NON">None</option>
                  <option value="VIEWER">Viewer</option>
                  <option value="WRITER">Writer</option>
                  <option value="FILE_MANAGER">File Manager</option>
                </select>
              </div>

              {error && (
                <div className="alert alert-danger">{error}</div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Floating buttons */}
      <div className="floating-btns d-flex gap-2">
        <button
          className="floating-btn primary-btn"
          disabled={!username}
          onClick={savePermissions}
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

      {/* Success popup */}
      {showSuccess && (
        <div className="success-popup-backdrop">
          <div className="success-popup">
            <h5>✅ Permissions updated successfully</h5>
            <button
              className="btn btn-primary mt-3"
              onClick={() => {
                setShowSuccess(false);
                navigate(-1);
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditPermissionsComponent;
