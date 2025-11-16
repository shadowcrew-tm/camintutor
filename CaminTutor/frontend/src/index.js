import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // This imports your Tailwind styles
import App from './App';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// This tells React to render your <App /> component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);