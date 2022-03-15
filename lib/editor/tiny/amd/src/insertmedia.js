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

const plugin = class {
    constructor(editor) {
        // Add a button which asks the question.
        editor.ui.registry.addButton('editor_tiny/image', {
            text: 'Insert image',
            onAction: function() {
                askTheQuestion(editor, 'Did you click the button?');
            }
        });

        // Add a menu item which asks the question.
        editor.ui.registry.addMenuItem('editor_tiny/image', {
            text: 'Insert image',
            onAction: function() {
                askTheQuestion(editor, 'Did you click the Menu item?');
            }
        });

        return {
            getMetadata: function() {
                return {
                    name: 'Moodle Media plugin',
                    url: 'https://docs.moodle.org/410/en/tiny_media'
                };
            }
        };
    }

    getDialogue() {
        return;
    }
};

export default new Promise((resolve) => {
    getTinyMCE()
    .then(tinyMCE => {
        tinyMCE.PluginManager.add('editor_tiny/insertmedia', plugin);

        resolve('editor_tiny/insertmedia');

        return tinyMCE;
    })
    .catch(displayException);
});
