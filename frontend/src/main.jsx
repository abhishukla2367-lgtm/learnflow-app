import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

// ✅ Removed StrictMode — it breaks socket connections in dev
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);