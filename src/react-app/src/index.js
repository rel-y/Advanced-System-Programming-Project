import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from './components/sideBar/SidebarComponent';
import { NodesProvider } from './components/sideBar/nodeListContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
    <NodesProvider>
        <div style={{ display: 'flex' }}>
            <Sidebar />
        </div>
        {/* make sure to put file list here */}
    </NodesProvider>
    <Routes>
          {/* <Route path="/api/users/login" element={<LoginInComponent />} />
          <Route path="/api/users/signup" element={<SigningUpComponent />} /> */}
      </Routes>
    </BrowserRouter>
);
