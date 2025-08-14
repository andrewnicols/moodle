import * as CalendarRepository from 'core_calendar/repository';
import Notification from 'core/notification';

export const init = async (selector) => {
    // window.console.log('shim init called with selector: ', selector);
    if (window.ReactApp && typeof window.ReactApp.init === 'function') {
        const events = await CalendarRepository.getCalendarUpcomingData(1, 1)
            .then((context) => {
                return context.events.map((event) => {
                    return {
                        title: event.name,
                        start: new Date(event.timestart * 1000),
                        end: new Date((event.timestart + event.timeduration) * 1000),
                        id: event.id
                    };
                });
            })
            .fail(Notification.exception);
        window.ReactApp.init(selector, { events });
    } else {
        window.console.warn('window.ReactApp.init not found');
    }
};
