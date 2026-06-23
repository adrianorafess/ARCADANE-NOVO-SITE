import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Centralized Interceptor for Cross-Origin and Third Party Script Errors in Iframe Sandbox
if (typeof window !== 'undefined') {
  const isIgnorable = (message: string, source: string) => {
    const msg = String(message || '').toLowerCase();
    const src = String(source || '').toLowerCase();
    return !message || 
           msg.includes('script error') || 
           msg.includes('error') ||
           src.includes('google') || 
           src.includes('vlibras') || 
           src.includes('onertravel');
  };

  window.addEventListener('error', (event) => {
    if (isIgnorable(event.message, event.filename)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  // Filter console.error from third-party scripts
  const originalConsoleError = console.error;
  console.error = function(...args: any[]) {
    const argStr = args.map(arg => {
      try {
        return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
      } catch (err) {
        return String(arg);
      }
    }).join(' ').toLowerCase();

    if (argStr.includes('script error') || 
        argStr.includes('vlibras') || 
        argStr.includes('google') || 
        argStr.includes('onertravel')) {
      return;
    }
    originalConsoleError.apply(console, args);
  };

  window.onerror = function (message, source, lineno, colno, error) {
    if (isIgnorable(String(message || ''), String(source || ''))) {
      return true; // Suppress cross-origin / third-party background scripts error bubble
    }
    return false;
  };

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason ? (event.reason.message || String(event.reason)) : '';
    if (isIgnorable(reason, '')) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

