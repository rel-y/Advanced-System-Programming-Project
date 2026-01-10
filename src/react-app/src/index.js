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
          </Routes>
        </div>
      </div>
    </NodesProvider>
  </BrowserRouter>
);
