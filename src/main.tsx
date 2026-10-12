import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AdminApp } from './components/admin/AdminApp';

function Root() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  return pathname === '/admin' ? <AdminApp /> : <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);