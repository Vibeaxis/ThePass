import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';       // Changed from '@/App' to './App'
import './index.css';         // Changed from '@/index.css' to './index.css'

// IMPORTANT: Match the ID "app" from your index.html
const rootElement = document.getElementById('app'); 

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <App />
  );
}
