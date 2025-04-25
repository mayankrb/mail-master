import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <BrowserRouter>
          <div className="dark:bg-gray-900 dark:text-white min-h-screen">
              <App/>
          </div>
      </BrowserRouter>
  </React.StrictMode>
);
