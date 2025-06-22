// client/src/main.jsx
import React from 'react-dom/client'; // Jangan impor React secara langsung
import ReactDOM from 'react-dom/client'; // Import ReactDOM
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // Hapus <React.StrictMode>
  <App />
  // Hapus </React.StrictMode>
);