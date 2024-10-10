import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/js/bootstrap.bundle";
import './index.css';
import RouteNav from '../src/routes/RouteNav';
import { AuthProvider } from './context/Auth';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouteNav />
    </AuthProvider>

  </React.StrictMode>
);


