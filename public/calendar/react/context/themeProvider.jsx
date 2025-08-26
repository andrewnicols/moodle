import { useState, createContext, useContext, useEffect } from "react";

const ThemeContext = createContext();

// See: https://medium.com/@riteshbhagat/implementing-theme-in-react-using-context-api-196149967c9d

export const useTheme = () => {
    return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState('light');

    const toggleTheme = (e) => {
        setThemeMode(e.currentTarget.value);
    };

    useEffect(() => {
        document.documentElement.setAttribute(
            "data-theme",
            themeMode
        );
    }, [themeMode]);

    return (
        <ThemeContext.Provider value={{ toggleTheme, themeMode }}>
            {children}
        </ThemeContext.Provider>
    );
};
