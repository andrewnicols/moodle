import React, { useMemo } from "react";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';

// Import date-fns functions for date localization
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';

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

// Import the CSS for react-big-calendar
import 'react-big-calendar/lib/css/react-big-calendar.css';

export default function CalendarShim(props) {
    const { scrollToTime } = useMemo(
        () => ({
            scrollToTime: new Date(1970, 1, 1, 6),
        }),
        []
    );

    return (
        <>
            <Calendar
                {...props}
                localizer={localizer}
                events={props.events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                selectable
                scrollToTime={scrollToTime}
            />
        </>
    );
}
