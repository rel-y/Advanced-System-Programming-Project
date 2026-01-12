import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NodesProvider } from './components/nodeListContext';
import LoginInComponent from './components/login and singup/signing-in-component';
import SigningUpComponent from './components/login and singup/signing-up-component';
import DisplayFileComponent from './components/file-display-and-edit/display-file-component';
import EditFileComponent from './components/file-display-and-edit/edit-file-component';
import EditPermissionsComponent from './components/file-display-and-edit/edit-permissions-component';
import FileList from './components/file and folder list/filesList';
import NotFound from './components/NotFound/NotFound';
import MainPage from './components/mainPage/mainPageComponent';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <NodesProvider>
          <div>
            <Routes>
              <Route path="/" element={<MainPage/>} />
               <Route path="/files" element={<FileList />} />
              <Route path="/api/users/login" element={<LoginInComponent />} />
              <Route path="/api/users/signup" element={<SigningUpComponent />} />
              <Route path="/api/files/:id" element={<DisplayFileComponent />} />
              <Route path="/api/files/:id/edit" element={<EditFileComponent />} />
              <Route path="/api/files/:id/permissions" element={<EditPermissionsComponent />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
    </NodesProvider>
  </BrowserRouter>
);
