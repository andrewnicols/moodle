export const init = (selector) => {
    window.console.log('shim init called with selector: ', selector);
    if (window.ReactApp && typeof window.ReactApp.init === 'function') {
        window.ReactApp.init(selector);
    } else {
        window.console.warn('window.ReactApp.init not found');
    }
};
