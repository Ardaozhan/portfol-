/**
 * main.jsx — Application entry point
 *
 * Kept intentionally thin: the only responsibility here is mounting React.
 * All application logic lives inside App.jsx and its children.
 *
 * StrictMode is enabled in development to surface side-effect issues early
 * (especially important for GSAP animations and Lenis lifecycle).
 */
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
