import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

function init(selector) {
    const container = document.querySelector(selector);
    if (container) {
        const root = createRoot(container);
        root.render(<App />);
    }
}

// Expose to global so AMD shim can call it
window.ReactApp = { init };
