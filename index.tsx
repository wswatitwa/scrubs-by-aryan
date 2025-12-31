
import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './pages/index';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
console.log('Mounting React root...');
try {
  root.render(
    <React.StrictMode>
      <Home />
    </React.StrictMode>
  );
  console.log('React root rendered.');
} catch (e) {
  console.error('Error rendering root:', e);
}
