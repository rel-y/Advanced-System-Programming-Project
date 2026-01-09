import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import LoginInComponent from './components/login and singup/signing-in-component';
import SigningUpComponent from './components/login and singup/signing-up-component';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
    <Routes>
          <Route path="/api/users/login" element={<LoginInComponent />} />
          <Route path="/api/users/signup" element={<SigningUpComponent />} />
      </Routes>
    </BrowserRouter>
);
