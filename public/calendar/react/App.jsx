import React, { Fragment, useState, useCallback, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';

// Import date-fns functions for date localization
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';

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

    const handleSelectSlot = useCallback(
        ({ start, end }) => {
            const title = window.prompt('New Event name');
            if (title) {
                setEvents((prev) => [...prev, { start, end, title }]);
            }
        }, [setEvents]
    );

    const handleSelectEvent = useCallback(
        (event) => window.alert(event.title),
        []
    );

    const { scrollToTime } = useMemo(
        () => ({
            scrollToTime: new Date(1970, 1, 1, 6),
        }),
        []
    );

    return <Fragment>
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
        </Fragment>;
}
