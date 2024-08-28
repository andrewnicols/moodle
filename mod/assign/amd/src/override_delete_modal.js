import * as CustomEvents from 'core/custom_interaction_events';
import Modal from 'core/modal';

// Custom modal.
let modal = null;

const SELECTORS = {
    DELETE_BUTTONS: '.delete-override',
    RECACULATION_CHECKBOX: '#recalculatepenalties',
};

/**
 * Custom Modal
 */
export default class OverrideDeleteModal extends Modal {
    static TYPE = "mod_assign/override_delete_modal";
    static TEMPLATE = "mod_assign/override_delete_modal";

    /**
     * Register the modal type.
     * @param {string} confirmMessage The message to display in the modal.
     * @param {boolean} showRecalculationCheckBox Whether to show the recalculation checkbox.
     * @returns {Promise<void>}
     */
    static async init(confirmMessage, showRecalculationCheckBox) {
        // Create the modal.
        modal = await OverrideDeleteModal.create({
            templateContext: {
                confirmmessage: confirmMessage,
                showpenaltyrecalculation: showRecalculationCheckBox,
            },
        });

        // Add event listeners.
        document.querySelectorAll(SELECTORS.DELETE_BUTTONS).forEach(button => {
            button.addEventListener('click', async(event) => {
                event.preventDefault();
                modal.setOverrideId(button.getAttribute('data-overrideid'));
                modal.setSessionKey(button.getAttribute('data-sesskey'));
                modal.show();
            });
        });
    }

    /**
     * Configure the modal.
     *
     * @param {Object} modalConfig
     */
    configure(modalConfig) {
        // Add question modals are always large.
        modalConfig.large = true;

        // Always show on creation.
        modalConfig.show = false;
        modalConfig.removeOnClose = false;

        // Apply standard configuration.
        super.configure(modalConfig);
    }

    /**
     * Constructor.
     * Set required data to null.
     *
     * @param {HTMLElement} root
     */
    constructor(root) {
        super(root);

        // Recalculate penalties checkbox.
        this.recalculationCheckbox = this.getModal().find(SELECTORS.RECACULATION_CHECKBOX);

        // Data.
        this.setOverrideId(null);
        this.setSessionKey(null);
    }

    /**
     * Set the override id.
     *
     * @param {number} id The override id.
     */
    setOverrideId(id) {
        this.overrideId = id;
    }

    /**
     * Get the override id.
     *
     * @returns {*}
     */
    getOverrideId() {
        return this.overrideId;
    }

    /**
     * Set the session key.
     *
     * @param {string} key
     */
    setSessionKey(key) {
        this.sessionKey = key;
    }

    /**
     * Get the session key.
     *
     * @returns {*}
     */
    getSessionKey() {
        return this.sessionKey;
    }

    /**
     * Register events.
     *
     */
    registerEventListeners() {
        // Apply parent event listeners.
        super.registerEventListeners(this);

        // Register to close on cancel.
        this.registerCloseOnCancel();

        // Register the delete action.
        this.getModal().on(CustomEvents.events.activate, this.getActionSelector('delete'), () => {
            this.deleteOverride();
        });
    }

    /**
     * Delete a override.
     *
     */
    deleteOverride() {
        // Check if the recalculation checkbox is checked.
        const recalculate = this.recalculationCheckbox.prop('checked');

        // Redirect to the delete URL.
        window.location.href = M.cfg.wwwroot + '/mod/assign/overridedelete.php?id=' + this.getOverrideId() +
            '&sesskey=' + this.getSessionKey() + '&confirm=1'
            + (recalculate ? '&recalculate=1' : '');

        // Hide the modal.
        this.hide();
    }

    /**
     * Reset the modal data when hiding.
     *
     */
    hide() {
        // Reset the data.
        this.setOverrideId(null);
        this.setSessionKey(null);

        // Reset the recalculation checkbox.
        this.recalculationCheckbox.prop('checked', false);

        super.hide();
    }
}

OverrideDeleteModal.registerModalType();
