import {getTinyMCE} from './loader';
import {
    exception as displayException,
    saveCancel,
} from 'core/notification';

const askTheQuestion = (editor, question) => {
    saveCancel('Title', question, 'Yes', () => {
        editor.setContent('<span data-identifier="SOMEVALUE">' + editor.getContent() + '</span>');
        editor.insertContent('Inserted some content! :)');
    });
};

export default new Promise((resolve) => {
    getTinyMCE()
    .then(tinyMCE => {
        tinyMCE.PluginManager.add('editor_tiny/testplugin', function(editor) {
            /* Add a button that opens a window */
            editor.ui.registry.addButton('editor_tiny/testplugin', {
                text: 'My button',
                onAction: function() {
                    askTheQuestion(editor, 'Did you click the button?');
                }
            });
            /* Adds a menu item, which can then be included in any menu via the menu/menubar configuration */
            editor.ui.registry.addMenuItem('editor_tiny/testplugin', {
                text: 'Example plugin',
                onAction: function() {
                    askTheQuestion(editor, 'Did you click the Menu item?');
                }
            });

            return {
                getMetadata: function() {
                    return {
                        name: 'Custom plugin',
                        url: 'https://example.com/docs/customplugin'
                    };
                }
            };
        });

        resolve('editor_tiny/testplugin');

        return tinyMCE;
    })
    .catch(displayException);
});
