// frontend/src/main.tsx (MODIFIED - Option 1: If Router is removed from App.tsx)

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
// import { BrowserRouter } from 'react-router-dom'; // Cần import nếu chưa có

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <BrowserRouter> */}
        <App />
    {/* </BrowserRouter> */}
  </StrictMode>,
);
