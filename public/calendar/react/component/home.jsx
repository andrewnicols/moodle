import { useTheme } from "../context/themeProvider";
import Form from 'react-bootstrap/Form';
import {InputGroup} from "react-bootstrap";

const Home = () => {
    const { toggleTheme, themeMode } = useTheme();

    return (
        <div>
            <InputGroup className="mb-3">
                <InputGroup.Text id="formStart">Toggle theme</InputGroup.Text>
                <Form.Select aria-label="Default select example" value={themeMode} onChange={toggleTheme}>
                    <option value="dark">Dark mode</option>
                    <option value="light">Light mode</option>
                    <option value="high-contrast">High contrast</option>
                </Form.Select>
            </InputGroup>
        </div>
    );
};

export default Home;
