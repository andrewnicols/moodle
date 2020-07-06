import {core, plugins} from './ckeditor';

export const init = ({
    element,
    additionalPlugins,
}) => {
    const editorElement = document.querySelector(`#${element}`);
    const editorWrapper = editorElement.closest('[data-editor="ckeditor"]');

    return Promise.all(additionalPlugins.map(pluginSource => {
        return import(pluginSource);
    }))
    .then(additionalPlugins => {
        return core.ClassicEditor.create(
            editorElement,
            {
                plugins: Object.values(plugins).concat(additionalPlugins),
                toolbar: JSON.parse(editorWrapper.dataset.toolbar),
            }
        );
    });
};
