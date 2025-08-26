import React from 'react';
import { createRoot } from 'react-dom/client';

// TODO: Make this load from @Moodle/[frankenstyle]/react.
import App from './App.jsx';
import Home from "./component/home";

import "./styles.css";
import { ThemeProvider } from "./context/themeProvider";

function init(selector, props) {
    const container = document.querySelector(selector);
    if (container) {
        const root = createRoot(container);
        root.render(<ThemeProvider><div className="App">
            <Home />
        </div><App {...props} /></ThemeProvider>);
    }
}

// Expose to global so AMD shim can call it
window.ReactApp = { init };
