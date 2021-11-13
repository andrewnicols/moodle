let tinyMCEPromise;

export const getTinyMCE = () => {
    if (tinyMCEPromise) {
        return tinyMCEPromise;
    }

    tinyMCEPromise = new Promise((resolve, reject) => {
        const head = document.querySelector('head');
        let script = head.querySelector('script[data-tinymce="tinymce"]');
        if (script) {
            resolve(window.tinyMCE);
        }

        script = document.createElement('script');
        script.dataset.tinymce = 'tinymce';
        script.src = `${M.cfg.wwwroot}/lib/editor/tiny/js/tinymce/tinymce.js`;
        script.async = true;

        script.addEventListener('load', () => {
            resolve(window.tinyMCE);
        }, false);

        script.addEventListener('error', (err) => {
            reject(err);
        }, false);

        head.append(script);
    });

    return tinyMCEPromise;
};
