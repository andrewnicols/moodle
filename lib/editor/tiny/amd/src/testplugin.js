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

const plugin = (editor) => {
    // Add a button which asks the question.
    editor.ui.registry.addButton('editor_tiny/testplugin', {
        text: 'My button',
        onAction: function() {
            askTheQuestion(editor, 'Did you click the button?');
        }
    });

    // Add a menu item which asks the question.
    editor.ui.registry.addMenuItem('editor_tiny/testplugin', {
        text: 'Example plugin',
        onAction: function() {
            askTheQuestion(editor, 'Did you click the Menu item?');
        }
    });

    return {
        name: 'Custom plugin',
        url: 'https://example.com/docs/customplugin'
    };
};

export default new Promise((resolve) => {
    getTinyMCE()
    .then(tinyMCE => {
        tinyMCE.PluginManager.add('editor_tiny/testplugin', plugin);

        resolve('editor_tiny/testplugin');

        return tinyMCE;
    })
    .catch(displayException);
});
