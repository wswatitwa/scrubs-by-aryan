
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
console.log('Mounting React root...');
try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('React root rendered.');
} catch (e) {
  console.error('Error rendering root:', e);
}

// Register PWA Service Worker
import { registerSW } from 'virtual:pwa-register';

if ("serviceWorker" in navigator) {
  registerSW({
    onNeedRefresh() { },
    onOfflineReady() {
      console.log('App is ready to work offline.');
    },
  });
}
