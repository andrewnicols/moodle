import React, { Fragment, useState, useCallback, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';

// Import date-fns functions for date localization
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';

// Event management imports.
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

// Import Bootstrap CSS. This would be abstracted elsewhere down the line.
import 'bootstrap/dist/css/bootstrap.min.css';

// Import the CSS for react-big-calendar
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Define the locales for date-fns, Maybe we can look at tacking this from the Moodle locale?
const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

export default function App({ events }) {
    const [myEvents, setEvents] = useState(events);
    const [modalShow, setModalShow] = useState(false);
    const [title, setTitle] = React.useState("New Event");
    // Maybe swap to useCallback??
    const [body, setBody] = React.useState("");

    const handleSelectSlot = useCallback(
        ({ start }) => {
            setTitle("New Event");
            setBody(
                <>
                    <p>Form content goes here</p>
                    <small>Form date: {start.toString()}</small>
                </>
            );
            setModalShow(true);
        }, [setEvents, setModalShow]
    );

    const handleSelectEvent = useCallback(
        (event) => {
            setTitle(event.title);
            setBody(
                <>
                    <p>Start time: {event.start.toString()}</p>
                    <p>End time: {event.end.toString()}</p>
            </>
            );
            setModalShow(true);
        }, [setModalShow, setTitle]
    );

    const { scrollToTime } = useMemo(
        () => ({
            scrollToTime: new Date(1970, 1, 1, 6),
        }),
        []
    );

    return (
        <>
            <Button variant="primary" onClick={() => {
                setTitle("New Event");
                setBody(
                    <>
                        <p>Form content goes here</p>
                    </>
                );
                setModalShow(true)
            }}>
                New event
            </Button>
            <EventModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                title={title}
                body={body}
            />
            <Fragment>
                <Calendar
                    localizer={localizer}
                    events={myEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                    selectable
                    scrollToTime={scrollToTime}
                />
            </Fragment>
        </>
    );
}

function EventModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.body}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
}
