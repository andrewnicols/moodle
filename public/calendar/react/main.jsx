import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

function init(selector, props) {
    const container = document.querySelector(selector);
    if (container) {
        const root = createRoot(container);
        root.render(<App {...props} />);
    }
}

// Expose to global so AMD shim can call it
window.ReactApp = { init };
