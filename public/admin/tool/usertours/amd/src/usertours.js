/**
 * User tour control library.
 *
 * @module     tool_usertours/usertours
 * @copyright  2016 Andrew Nicols <andrew@nicols.co.uk>
 */
import {appendToDom} from 'core/component';

/**
 * Initialise the user tour for the current page.
 *
 * @method  init
 * @param   {Array}    tourDetails      The matching tours for this page.
 * @param   {Array}    filterNames      The names of all client side filters.
 */
export const init = (tourDetails, filterNames) => {
    appendToDom(
        '@moodle/lms/tool_usertours/UserTours',
        {tourDetails, filterNames},
        document.body,
    );
};
