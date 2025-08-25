import React, { Fragment, useState, useCallback } from 'react';

// Pseudo design system imports.
import CalendarShim from './design-system/calendar.jsx';
import EventModal from './design-system/modal.jsx';
import CalendarForm from "./design-system/form";

// Standard Bootstrap imports.
import Button from 'react-bootstrap/Button';

export default function App({ events }) {
    const newEventString = "New Event";

    const [myEvents, setEvents] = useState(events);
    const [modalShow, setModalShow] = useState(false);
    const [title, setTitle] = useState(newEventString);
    const [body, setBody] = useState("");
    const [footer, setFooter] = useState("");

    const handleSelectSlot = useCallback(
        ({ start }) => {
            setTitle(newEventString);
            setBody(
                <>
                    <CalendarForm start={start.toString()}/>
                </>
            );
            setModalShow(true);
            setFooter(
                <Button variant="primary" onClick={() => {
                    const newEvent = {
                        id: myEvents.length + 1,
                        title: newEventString,
                        start: start,
                        end: start
                    };
                    setEvents([...myEvents, newEvent]);
                    setModalShow(false);
                }}>
                    Add Event
                </Button>
            );
        }, [setEvents, setBody, setModalShow]
    );

    const handleSelectEvent = useCallback(
        (event) => {
            setTitle(event.title);
            setBody(
                <>
                    <CalendarForm start={event.start.toString()} end={event.end.toString()} title={event.title}/>
                </>
            );
            setModalShow(true);
            setFooter(
                <>
                    <Button variant="danger" onClick={() => {
                        setEvents(myEvents.filter(e => e.id !== event.id));
                        setModalShow(false);
                    }}>
                        Delete Event
                    </Button>
                    <Button variant="primary" onClick={() => {
                        const updatedEvents = myEvents.map(e => {
                            if (e.id === event.id) {
                                return {
                                    ...e,
                                    title: title,
                                    start: new Date(document.getElementById('formStart').value),
                                    end: new Date(document.getElementById('formEnd').value)
                                };
                            }
                            return e;
                        });
                        setModalShow(false);
                    }}>
                        Update Event
                    </Button>
                </>
            );
        }, [setModalShow, setTitle]
    );

    const onClickHandler = () => {
        setTitle(newEventString);
        setBody(
            <Fragment>
                <CalendarForm/>
            </Fragment>
        );
        setFooter(
            <Button variant="primary" onClick={() => {
                const newEvent = {
                    id: myEvents.length + 1,
                    title: newEventString,
                    start: new Date(),
                    end: new Date()
                };
                setEvents([...myEvents, newEvent]);
                setModalShow(false);
            }}>
                Add Event
            </Button>
        );
        setModalShow(true)
    };

    return (
        <>
            <Button variant="primary" onClick={onClickHandler}>
                {newEventString}
            </Button>
            <EventModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                title={title}
                body={body}
                footer={footer}
            />
            <CalendarShim events={myEvents} onSelectEvent={handleSelectEvent} onSelectSlot={handleSelectSlot} />
        </>
    );
}
