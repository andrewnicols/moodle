<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

namespace editor_tiny;

/**
 * Tiny Editor Plugin manager.
 *
 * @package    editor_tiny
 * @copyright  2021 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class manager {
    /**
     * Get a list of the buttons provided by this plugin.
     *
     * @return string[]
     */
    public function get_available_buttons(): array {
        // The following list is defined at:
        // https://www.tiny.cloud/docs/advanced/available-toolbar-buttons/#thecoretoolbarbuttons.
        return [
            // These are always available, without requiring additional plugins.
            'aligncenter',
            'alignjustify',
            'alignleft',
            'alignnone',
            'alignright',
            'blockquote',
            'backcolor',
            'bold',
            'copy',
            'cut',
            'fontselect',
            'fontsizeselect',
            'forecolor',
            'formatselect',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'indent',
            'italic',
            'language',
            'lineheight',
            'newdocument',
            'outdent',
            'paste',
            'redo',
            'remove',
            'removeformat',
            'selectall',
            'strikethrough',
            'styleselect',
            'subscript',
            'superscript',
            'underline',
            'undo',
            'visualaid',
        ];
    }

    /**
     * Get a list of the menu items provided by this plugin.
     *
     * @return string[]
     */
    public function get_available_menuitems(): array {
        return [
            'align' => 'format',
            'backcolor' => 'format',
            'blockformats' => 'format',
            'bold' => 'format',
            'codeformat' => 'format',
            'copy' => 'copy',
            'cut' => 'copy',
            'forecolor' => 'format',
            'formats' => 'format',
            'fontformats' => 'format',
            'fontsizes' => 'format',
            'italic' => 'format',
            'language' => 'format',
            'lineheight' => 'format',
            'newdocument' => 'file',
            'paste' => 'copy',
            'redo' => 'copy',
            'removeformat' => 'format',
            'selectall' => 'edit',
            'strikethrough' => 'format',
            'subscript' => 'format',
            'superscript' => 'format',
            'underline' => 'format',
            'undo' => 'copy',
            'visualaid' => 'view',
        ];
    }

    /**
     * Return a list of the available plugins built into TinyMCE and not shipped as separate Moodle plugins.
     *
     * Each plugin is returned as an array element containing:
     * - a list of buttons (if applicable); and
     * - a list of menuitems (if applicable).
     *
     * Note: Not all plugins include buttons, and not all plugins include menuitems.
     * These array keys are optional.
     *
     * @return array
     */
    public function get_available_plugins(): array {
        $plugins = $this->get_core_plugins();
        if ($this->premium_plugins_enabled()) {
            $plugins += $this->get_premium_plugins();
        }

        $plugins += $this->get_moodle_plugins();

        return $plugins;
    }

    /**
     * Get a list of the available buttons.
     *
     * @return array
     */
    public function get_available_button_list(): array {
        $buttonlist = [];

        foreach ($this->get_available_plugins() as $pluginname => $config) {
            if (empty($config['buttons'])) {
                continue;
            }

            foreach ($config['buttons'] as $button) {
                $buttonlist[$button] = $pluginname;
            }
        }

        return $buttonlist;
    }

    /**
     * Get a list of the available menu items.
     *
     * @return array
     */
    public function get_available_menuitem_list(): array {
        $menuitems = [];

        foreach ($this->get_available_plugins() as $pluginname => $config) {
            if (empty($config['menuitems'])) {
                continue;
            }

            foreach ($config['menuitems'] as $menuitem) {
                $menuitems[$menuitem] = $pluginname;
            }
        }

        return $menuitems;
    }

    /**
     * Get a list of the core plugins with their button, and menuitem, configuration.
     *
     * @return array[]
     */
    protected function get_core_plugins(): array {
        // The following list is defined at:
        // https://www.tiny.cloud/docs/advanced/available-toolbar-buttons/#thecoretoolbarbuttons.
        return [
            'anchor' => [
                'buttons' => [
                    'anchor',
                ],
                'menuitems' => [
                    'anchor' => 'insert',
                ],
            ],
            'autosave' => [
                'buttons' => [
                    'restoredraft',
                ],
                'menuitems' => [
                    'restoredraft' => 'file',
                ],
            ],
            'charmap' => [
                'buttons' => [
                    'charmap',
                ],
                'menuitems' => [
                    'charmap' => 'insert',
                ],
            ],
            'code' => [
                'buttons' => [
                    'code',
                ],
                'menuitems' => [
                    'code' => 'view',
                ],
            ],
            'codesample' => [
                'buttons' => [
                    'codesample',
                ],
                'menutiems' => [
                    'codesample' => 'insert',
                ],
            ],
            'directionality' => [
                'buttons' => [
                    'ltr',
                    'rtl',
                ],
            ],
            'emoticons' => [
                'buttons' => [
                    'emoticons',
                ],
                'menuitems' => [
                    'emoticons' => 'insert',
                ],
            ],
            'fullscreen' => [
                'buttons' => [
                    'fullscreen',
                ],
                'menuitems' => [
                    'fullscreen' => 'view',
                ],
            ],
            'help' => [
                'buttons' => [
                    'help',
                ],
                'menuitems' => [
                    'help' => 'help',
                ],
            ],
            'hr' => [
                'buttons' => [
                    'hr',
                ],
                'menuitems' => [
                    'hr' => 'insert',
                ],
            ],
            'image' => [
                'buttons' => [
                    'image',
                ],
                'menuitems' => [
                    'image' => 'insert',
                ],
            ],
            'imagetools' => [
                'buttons' => [
                    'editimage',
                    'fliph',
                    'flipv',
                    'imageoptions',
                    'rotateleft',
                    'rotateright',
                ],
            ],
            'insertdatetime' => [
                'buttons' => [
                    'insertdatetime',
                ],
                'menuitems' => [
                    'insertdatetime' => 'insert',
                ],
            ],
            'link' => [
                'buttons' => [
                    'link',
                    'openlink',
                    'unlink',
                ],
                'menuitems' => [
                    'link' => 'insert',
                ],
            ],
            'lists' => [
                'buttons' => [
                    'bullist',
                    'numlist',
                ],
            ],
            'media' => [
                'buttons' => [
                    'media',
                ],
                'menuitems' => [
                    'media' => 'insert',
                ],
            ],
            'nonbreaking' => [
                'buttons' => [
                    'nonbreaking',
                ],
                'menuitems' => [
                    'nonbreaking' => 'insert',
                ],
            ],
            'pagebreak' => [
                'buttons' => [
                    'pagebreak',
                ],
                'menuitems' => [
                    'pagebreak' => 'insert',
                ],
            ],
            'paste' => [
                'buttons' => [
                    'pastetext',
                ],
                'menuitems' => [
                    'pastetext' => 'edit',
                ],
            ],
            'preview' => [
                'buttons' => [
                    'preview',
                ],
                'menuitems' => [
                    'preview' => 'file',
                ],
            ],
            'print' => [
                'buttons' => [
                    'print',
                ],
                'menuitems' => [
                    'print' => 'file',
                ],
            ],
            'quickbars' => [
                'buttons' => [
                    'quickimage',
                    'quicklink',
                    'quicktable',
                ],
            ],
            'save' => [
                'buttons' => [
                    'cancel',
                    'save',
                ],
            ],
            'searchreplace' => [
                'buttons' => [
                    'searchreplace',
                ],
                'menuitems' => [
                    'searchreplace' => 'edit',
                ],
            ],
            'spellchecker' => [
                'buttons' => [
                    'spellchecker',
                ],
                'menuitems' => [
                    'spellchecker' => 'tools',
                ],
            ],
            'table' => [
                'buttons' => [
                    'table',
                    'tablecellprops',
                    'tablecopyrow',
                    'tablecutrow',
                    'tabledelete',
                    'tabledeletecol',
                    'tabledeleterow',
                    'tableinsertdialog',
                    'tableinsertcolafter',
                    'tableinsertcolbefore',
                    'tableinsertrowafter',
                    'tableinsertrowbefore',
                    'tablemergecells',
                    'tablepasterowafter',
                    'tablepasterowbefore',
                    'tableprops',
                    'tablerowprops',
                    'tablesplitcells',
                    'tableclass',
                    'tablecellclass',
                    'tablecellvalign',
                    'tablecellborderwidth',
                    'tablecellborderstyle',
                    'tablecaption',
                    'tablecellbackgroundcolor',
                    'tablecellbordercolor',
                    'tablerowheader',
                    'tablecolheader',
                ],
                'menuitems' => [
                    'inserttable' => 'table',
                    'tableprops' => 'table',
                    'deletetable' => 'table',
                    'cell' => 'table',
                    'tablemergecells' => 'table',
                    'tablesplitcells' => 'table',
                    'tablecellprops' => 'table',
                    'column' => 'table',
                    'tableinsertcolumnbefore' => 'table',
                    'tableinsertcolumnafter' => 'table',
                    'tablecutcolumn' => 'table',
                    'tablecopycolumn' => 'table',
                    'tablepastecolumnbefore' => 'table',
                    'tablepastecolumnafter' => 'table',
                    'tabledeletecolumn' => 'table',
                    'row' => 'table',
                    'tableinsertrowbefore' => 'table',
                    'tableinsertrowafter' => 'table',
                    'tablecutrow' => 'table',
                    'tablecopyrow' => 'table',
                    'tablepasterowbefore' => 'table',
                    'tablepasterowafter' => 'table',
                    'tablerowprops' => 'table',
                    'tabledeleterow' => 'table',
                ],
            ],
            'template' => [
                'buttons' => [
                    'template',
                ],
                'menuitems' => [
                    'template' => 'insert',
                ],
            ],
            'toc' => [
                'buttons' => [
                    'toc',
                    'tocupdate',
                ],
                'menuitems' => [
                    'toc' => 'insert',
                ],
            ],
            'visualblocks' => [
                'buttons' => [
                    'visualblocks',
                ],
                'menuitems' => [
                    'visualblocks' => 'view',
                ],
            ],
            'visualchars' => [
                'buttons' => [
                    'visualchars',
                ],
                'menuitems' => [
                    'visualchars' => 'view',
                ],
            ],
            'wordcount' => [
                'buttons' => [
                    'wordcount',
                ],
                'menuitems' => [
                    'wordcount' => 'tools',
                ],
            ],
        ];
    }

    /**
     * Get a list of the Moodle plugins with their button, and menuitem, configuration.
     *
     * @return array[]
     */
    protected function get_moodle_plugins(): array {
        return [
            'tiny_media/insertmedia' => [
                'buttons' => [
                    'tiny_media/insertmedia',
                ],
                'menuitems' => [
                    'tiny_media/insertmedia',
                ],
            ],
            'editor_tiny/testplugin' => [
                'buttons' => [
                    'editor_tiny/testplugin',
                ],
                'menuitems' => [
                    'editor_tiny/testplugin',
                ],
            ],
        ];
    }

    /**
     * Check whether premium plugins are configured and enabled.
     *
     * @return bool
     */
    protected function premium_plugins_enabled(): bool {
        return false;
    }

    /**
     * Get a list of the Tiny Premium plugins with their button, and menuitem, configuration.
     *
     * @return array[]
     */
    protected function get_premium_plugins(): array {
        return [
            'a11ycheck' => [
                'buttons' => [
                    'a11ycheck',
                ],
                'menuitems' => [
                    'a11ycheck',
                ],
            ],
            'advcode' => [
                'buttons' => [
                    'code',
                ],
                'menuitems' => [
                    'code',
                ],
            ]
        ];
    }
}
