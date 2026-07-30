import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Global fetch interceptor to handle expired/invalid tokens (401 Unauthorized)
const originalFetch = window.fetch;
window.fetch = async function (...args) {
  const response = await originalFetch(...args);
  if (response.status === 401) {
    const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
    if (url && !url.includes('/login') && !url.includes('/logout')) {
      localStorage.removeItem('cmsHomeCare_auth');
      window.location.href = '/login';
    }
  }
  return response;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
