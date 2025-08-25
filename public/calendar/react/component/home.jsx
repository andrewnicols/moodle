import { useTheme } from "../context/themeProvider";

const Home = () => {
    const { toggleTheme, darkMode } = useTheme();

    return (
        <div>
            <label>Toggle theme</label>
            <input
                type="checkbox"
                onChange={toggleTheme}
                checked={darkMode}
            />
        </div>
    );
};

export default Home;
