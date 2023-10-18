<?php
if (!defined('MOODLE_INTERNAL')) {
    die('Direct access to this script is forbidden.');    ///  It must be included from a Moodle page
}

require_once($CFG->libdir.'/formslib.php');

class mod_glossary_import_form extends moodleform {

    function definition() {
        global $CFG;
        $mform =& $this->_form;
        $cmid = $this->_customdata['id'] ?? null;

        $mform->addElement('filepicker', 'file', get_string('filetoimport', 'mod_glossary'));
        $mform->addHelpButton('file', 'filetoimport', 'mod_glossary');
        $options = array();
        $options['current'] = get_string('currentglossary', 'mod_glossary');
        $options['newglossary'] = get_string('newglossary', 'mod_glossary');
        $mform->addElement('select', 'dest', get_string('destination', 'mod_glossary'), $options);
        $mform->addHelpButton('dest', 'destination', 'mod_glossary');
        $mform->addElement('checkbox', 'catsincl', get_string('importcategories', 'mod_glossary'));
        $submit_string = get_string('submit');
        $mform->addElement('hidden', 'id');
        $mform->setType('id', PARAM_INT);
        $this->add_action_buttons(true, $submit_string);
    }
}
