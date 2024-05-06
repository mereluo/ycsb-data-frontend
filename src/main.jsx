import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { FieldProvider } from './context/FieldContext.jsx';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <FieldProvider>
        <App />
      </FieldProvider>
    </Router>
  </React.StrictMode>
);
