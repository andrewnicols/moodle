import Form from 'react-bootstrap/Form';
import {InputGroup} from "react-bootstrap";

function CalendarForm(props) {
    return (
        <Form>
            <Form.Group className="mb-3" controlId="formEventTitle">
                <Form.Label>Event title</Form.Label>
                <Form.Control type="text" placeholder="Enter event name" defaultValue={props.title}/>
            </Form.Group>
            <InputGroup className="mb-3">
                <InputGroup.Text id="formStart">Time start:</InputGroup.Text>
                <Form.Control
                    aria-label="Time start"
                    aria-describedby="formStart"
                    placeholder="Enter time start"
                    defaultValue={props.start}
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Text id="formEnd">Time end:</InputGroup.Text>
                <Form.Control
                    aria-label="Time end"
                    aria-describedby="formEnd"
                    placeholder="Enter time end"
                    defaultValue={props.end}
                />
            </InputGroup>

            {/* <Button variant="primary" type="submit"> */}
            {/*     Submit */}
            {/* </Button> */}
        </Form>
    );
}

export default CalendarForm;
