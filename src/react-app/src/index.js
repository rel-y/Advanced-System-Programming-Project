import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from './components/sideBar/SidebarComponent';
import { NodesProvider } from './components/nodeListContext';
import LoginInComponent from './components/login and singup/signing-in-component';
import SigningUpComponent from './components/login and singup/signing-up-component';
import TopBar from './components/TopBar/TopBarComponent';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <NodesProvider>
      {/* <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <TopBar />

        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
          <Sidebar /> */}

          <div style={{ flex: 1, padding: "24px", overflow: "auto" }}>
            <Routes>
              <Route path="/" element={<div>Home</div>} />
              <Route path="/api/users/login" element={<LoginInComponent />} />
              <Route path="/api/users/signup" element={<SigningUpComponent />} />
            </Routes>
          </div>
        {/* </div>
      </div> */}
    </NodesProvider>
  </BrowserRouter>
);
