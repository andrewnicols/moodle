import {getString} from 'core/str';

export const init = async (selector) => {
    // window.console.log('shim init called with selector: ', selector);
    if (window.ReactApp && typeof window.ReactApp.init === 'function') {
        let welcomeMessage = await getString('reacttest', 'calendar');
        window.ReactApp.init(selector, { welcomeMessage });
    } else {
        window.console.warn('window.ReactApp.init not found');
    }
};
