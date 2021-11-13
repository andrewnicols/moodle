import {
    getTinyMCE,
} from './loader';

const importPluginList = pluginList => {
    return pluginList.map(pluginPath => {
        if (pluginPath.indexOf('/') === -1) {
            // A standard TinyMCE Plugin.
            return pluginPath;
        }

        return import(pluginPath);
    });
};

export const setupForElementId = ({elementId}) => {
    return setupForTarget(document.querySelector(`#${elementId}`));
};

export const setupForTarget = (target) => {
    const pluginList = [
        'anchor',
        'advlist',
        'link',
        'image',
        'lists',
        'editor_tiny/testplugin',
    ];

    return getTinyMCE()
    .then(tinyMCE => Promise.all([tinyMCE, ...importPluginList(pluginList)]))
    .then(([tinyMCE, ...pluginList]) => {
        return tinyMCE.init({
            target,
            toolbar: [
                'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | ' +
                    'outdent indent',
                'editor_tiny/testplugin',
            ],
            plugins: [
                'wordcount',
                ...pluginList,
            ].join(' '),
        });
    })
    .catch(err => {
        window.console.log(err);
    });
};
