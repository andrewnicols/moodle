import {saveCancel} from 'core/notification';

const confirmedPromise = (title, question, saveLabel) => new Promise((resolve, reject) => {
    saveCancel(title, question, saveLabel, resolve, reject);
});


// The new listener for all confirmation modals:
const registerConfirmationListeners = () => {
    document.addEventListener('click', e => {
        const confirmRequest = e.target.closest('[data-confirmation="modal"]');
        if (confirmRequest) {
            e.preventDefault();
            confirmedPromise(
                confirmRequest.dataset.confirmationTitle,
                confirmRequest.dataset.confirmationQuestion,
                confirmRequest.dataset.confirmationYesButton
            )
            .then(() => {
                window.location.href = confirmRequest.dataset.confirmationDestination;
                return;
            })
            .catch();
        }
    });
};

// Register the listner:
registerConfirmationListeners();
