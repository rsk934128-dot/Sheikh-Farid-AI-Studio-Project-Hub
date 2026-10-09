import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Global error handlers to intercept and suppress Firebase auth popup internal assertion failures
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  const fullText = args
    .map((a) => (typeof a === 'object' && a !== null ? (a.message || a.code || JSON.stringify(a)) : String(a)))
    .join(' ');

  if (
    fullText.includes('Pending promise was never set') ||
    fullText.includes('auth/popup-closed-by-user') ||
    fullText.includes('auth/cancelled-popup-request') ||
    fullText.includes('@firebase/auth')
  ) {
    console.info('[Handled Auth Notice]:', fullText);
    return;
  }
  originalConsoleError.apply(console, args);
};

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  const message = (typeof reason === 'string' ? reason : reason?.message || '') + '';
  
  if (
    message.includes('Pending promise was never set') ||
    message.includes('auth/popup-closed-by-user') ||
    message.includes('auth/cancelled-popup-request') ||
    message.includes('@firebase/auth')
  ) {
    // Suppress console crash and prevent uncaught runtime exception in iframe
    event.preventDefault();
    console.info('[Firebase Auth Handled Rejection]', message);
  }
});

window.addEventListener('error', (event) => {
  const message = event.message || '';
  if (
    message.includes('Pending promise was never set') ||
    message.includes('auth/popup-closed-by-user') ||
    message.includes('@firebase/auth')
  ) {
    event.preventDefault();
    console.info('[Firebase Auth Handled Error]', message);
  }
});

// Cleanup any stale dev Service Worker in browser dev environment
if ('serviceWorker' in navigator && (import.meta as any).env?.DEV) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().catch(() => {});
    }
  }).catch(() => {});
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
