export const init = () => {
    document.querySelector('[data-formatchooser-field="selector"]').addEventListener('change', e => {
        const form = e.target.closest('form');
        const updateButton = form.querySelector('[data-formatchooser-field="updateButton"]');
        const fieldset = updateButton.closest('fieldset');

        const url = new URL(form.action);
        url.hash = fieldset.id;

        form.action = url.toString();
        updateButton.click();
    });
};
