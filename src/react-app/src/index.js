import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from './components/sideBar/SidebarComponent';
import { NodesProvider } from './components/sideBar/nodeListContext';
import LoginInComponent from './components/login and singup/signing-in-component';
import SigningUpComponent from './components/login and singup/signing-up-component';
import DisplayFileComponent from './components/file-display-and-edit/display-file-component';
import EditFileComponent from './components/file-display-and-edit/edit-file-component';
//import EditFilePermissionsComponent from './components/file-display-and-edit/edit-file-permissions-component';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <NodesProvider>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />

        <div style={{ flex: 1, padding: "24px" }}>
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/api/users/login" element={<LoginInComponent />} />
            <Route path="/api/users/signup" element={<SigningUpComponent />} />
            <Route path="/api/files/:id" element={<DisplayFileComponent />} />
            <Route path="/api/files/:id/edit" element={<EditFileComponent />} />
            

          </Routes>
        </div>
      </div>
    </NodesProvider>
  </BrowserRouter>
);
