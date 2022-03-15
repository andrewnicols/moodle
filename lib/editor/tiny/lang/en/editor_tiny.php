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

/**
 * Tiny text editor integration.
 *
 * @package    editor_tiny
 * @copyright  2021 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

$string['pluginname'] = 'TinyMCE editor';
$string['buttondescription:aligncenter'] = 'Center aligns the current block or image.';
$string['buttondescription:alignjustify'] = 'Full aligns the current block or image.';
$string['buttondescription:alignleft'] = 'Left aligns the current block or image.';
$string['buttondescription:alignnone'] = 'Removes the alignment of the current block or image.';
$string['buttondescription:alignright'] = 'Right aligns the current block or image.';
$string['buttondescription:blockquote'] = 'Applies block quote format to the current block level element.';
$string['buttondescription:backcolor'] = 'Applies background color to selection.';
$string['buttondescription:bold'] = 'Applies the bold format to the current selection.';
$string['buttondescription:copy'] = 'Copies the current selection into clipboard.';
$string['buttondescription:cut'] = 'Cuts the current selection into clipboard.';
$string['buttondescription:fontselect'] = 'Dropdown list with font families to apply to selection.';
$string['buttondescription:fontsizeselect'] = 'Dropdown list with font sizes to apply to selection.';
$string['buttondescription:forecolor'] = 'Applies foreground/text color to selection.';
$string['buttondescription:formatselect'] = 'Dropdown list with block formats to apply to selection.';
$string['buttondescription:h1'] = 'Changes current line to the “Heading 1” style.';
$string['buttondescription:h2'] = 'Changes current line to the “Heading 2” style.';
$string['buttondescription:h3'] = 'Changes current line to the “Heading 3” style.';
$string['buttondescription:h4'] = 'Changes current line to the “Heading 4” style.';
$string['buttondescription:h5'] = 'Changes current line to the “Heading 5” style.';
$string['buttondescription:h6'] = 'Changes current line to the “Heading 6” style.';
$string['buttondescription:indent'] = 'Indents the current list item or block element.';
$string['buttondescription:italic'] = 'Applies the italic format to the current selection.';
$string['buttondescription:language'] = 'Dropdown list with languages to apply to the selection. This button requires the content_langs option.';
$string['buttondescription:lineheight'] = 'Dropdown list with line heights to apply to selection.';
$string['buttondescription:newdocument'] = 'Creates a new document.';
$string['buttondescription:outdent'] = 'Outdents the current list item or block element.';
$string['buttondescription:paste'] = 'Pastes the current clipboard into the editor.';
$string['buttondescription:redo'] = 'To redo the last undone operation.';
$string['buttondescription:remove'] = 'Removes (deletes) the selected content or the content before the cursor position.';
$string['buttondescription:removeformat'] = 'Removes the formatting from the current selection.';
$string['buttondescription:selectall'] = 'Selects all content in the editor.';
$string['buttondescription:strikethrough'] = 'Applies strike though format to the current selection.';
$string['buttondescription:styleselect'] = 'Dropdown list with styles to apply to selection.';
$string['buttondescription:subscript'] = 'Applies subscript format to the current selection.';
$string['buttondescription:superscript'] = 'Applies superscript format to the current selection.';
$string['buttondescription:underline'] = 'Applies the underline format to the current selection.';
$string['buttondescription:undo'] = 'To undo the last operation.';
$string['buttondescription:visualaid'] = 'Toggles the visual aids for invisible elements.';




$string['buttondescription:anchor'] = 'Creates/Edits anchor elements.';
$string['buttondescription:restoredraft'] = 'Restores the latest auto saved draft.';
$string['buttondescription:casechange'] = 'Changes the case of text in a block selection to uppercase, lowercase, or title case.';
$string['buttondescription:charmap'] = 'Inserts custom characters into the editor.';
$string['buttondescription:code'] = 'Opens the code dialogue';
$string['buttondescription:codesample'] = 'Inserts code snippets with syntax highlighting.';
$string['buttondescription:ltr'] = 'Sets the directionality of contents to ltr.';
$string['buttondescription:rtl'] = 'Sets the directionality of contents to rtl.';
$string['buttondescription:emoticons'] = 'Opens the emoitocns dialog.';
$string['buttondescription:fullscreen'] = 'Toggles fullscreen mode.';
$string['buttondescription:help'] = 'Opoens the help dialog';
$string['buttondescription:hr'] = 'Inserts a horizontal rule into the editor';
$string['buttondescription:image'] = 'Creates/Edits images within the editor';
$string['buttondescription:editimage'] = 'Edits the current image in the image dialog';
$string['buttondescription:fliph'] = 'Flips the current image horizontally';
$string['buttondescription:flipv'] = 'Flips the current image vertically';
$string['buttondescription:imageoptions'] = 'Opens the image options dialog';
$string['buttondescription:rotateleft'] = 'Rotates the current image counterclockwise';
$string['buttondescription:rotateright'] = 'Rotates the current image clockwise';
$string['buttondescription:insertdatetime'] = 'Inserts the current date/time';
$string['buttondescription:link'] = 'Creates/Edits links within the editor';
$string['buttondescription:openlink'] = 'Opens the selected link in a new tab';
$string['buttondescription:unlink'] = 'Removes links from the current selection';
$string['buttondescription:bullist'] = 'Formats the current selection as a bullet list';
$string['buttondescription:numlist'] = 'Formats the current selection as a numbered list';
$string['buttondescription:media'] = 'Creates/Edits embedded media elements';
$string['buttondescription:nonbreaking'] = 'Inserts a nonbreaking space into the editor';
$string['buttondescription:pagebreak'] = 'Inserts a pagebreak into the editor';
$string['buttondescription:pageembed'] = 'Opens the insert or edit iframe dialog';
$string['buttondescription:pastetext'] = 'Toggles plain text pasting mode on/off. When in plain text mode, all rich content is converted into plain text';
$string['buttondescription:preview'] = 'Previews the current editor contents';
$string['buttondescription:print'] = 'Prints the current editor contents';
$string['buttondescription:quickimage'] = 'Inserts an image from the local machine.';
$string['buttondescription:quicklink'] = 'Inserts a link in a quicker way.';
$string['buttondescription:quicktable'] = 'Inserts a table 2x2.';
$string['buttondescription:cancel'] = 'Cancels/Resets the editor contents to it’s initial state';
$string['buttondescription:save'] = 'Saves the current editor contents to a form or ajax call';
$string['buttondescription:searchreplace'] = 'Searches and/or Replaces contents within the editor';
$string['buttondescription:spellchecker'] = 'Spellchecks the current editor contents';
$string['buttondescription:template'] = 'Inserts templates into the editor';
$string['buttondescription:toc'] = 'Inserts a Table of Contents into the editor';
$string['buttondescription:tocupdate'] = 'Updates the Table of Contents block element';
$string['buttondescription:visualblocks'] = 'Toggles the visibility of block element';
$string['buttondescription:visualchars'] = 'Toggles the visibility of non breaking character element';
$string['buttondescription:wordcount'] = 'Opens a word count dialog showing word and character count';
$string['buttondescription:table'] = 'Creates/Edits table elements.';
$string['buttondescription:tablecellprops'] = 'Opens the Cell properties dialog.';
$string['buttondescription:tablecopyrow'] = 'Copies the current row to the clipboard.';
$string['buttondescription:tablecutrow'] = 'Cuts the current row to the clipboard.';
$string['buttondescription:tabledelete'] = 'Deletes table.';
$string['buttondescription:tabledeletecol'] = 'Deletes the selected column.';
$string['buttondescription:tabledeleterow'] = 'Deletes the current row row.';
$string['buttondescription:tableinsertdialog'] = 'Opens the table properties dialog for creating a new table.';
$string['buttondescription:tableinsertcolafter'] = 'Inserts column after the current one.';
$string['buttondescription:tableinsertcolbefore'] = 'Inserts a column before the current one.';
$string['buttondescription:tableinsertrowafter'] = 'Inserts a new row after the current one.';
$string['buttondescription:tableinsertrowbefore'] = 'Inserts a new row before the current one.';
$string['buttondescription:tablemergecells'] = 'Merges the selected cells.';
$string['buttondescription:tablepasterowafter'] = 'Pastes the row in the clipboard after the current row.';
$string['buttondescription:tablepasterowbefore'] = 'Pastes the row in the clipboard before the current row.';
$string['buttondescription:tableprops'] = 'Opens the table properties dialog.';
$string['buttondescription:tablerowprops'] = 'Opens the Row properties dialog.';
$string['buttondescription:tablesplitcells'] = 'Splits the current merged cell.';
$string['buttondescription:tableclass'] = 'Adds or removes pre-defined classes to the selected table.';
$string['buttondescription:tablecellclass'] = 'Adds or removes pre-defined classes to selected cells in the table.';
$string['buttondescription:tablecellvalign'] = 'Sets the vertical alignment of the selected cells.';
$string['buttondescription:tablecellborderwidth'] = 'Sets the border width of all selected cells.';
$string['buttondescription:tablecellborderstyle'] = 'Sets the style of border for all selected cells.';
$string['buttondescription:tablecaption'] = 'Toggles the caption on the selected table.';
$string['buttondescription:tablecellbackgroundcolor'] = 'Sets the background color of the selected cells.';
$string['buttondescription:tablecellbordercolor'] = 'Sets the border color of the selected cells.';
$string['buttondescription:tablerowheader'] = 'Toggle a row between being a table header row or a table body row.';
$string['buttondescription:tablecolheader'] = 'Toggle a column between being a table header column and a table body column.';


$string['menudescription:align'] = 'Changes alignment to the current block or selection';
$string['menudescription:backcolor'] = 'Applies background color to selection';
$string['menudescription:blockformats'] = 'Applies block formats to current selection';
$string['menudescription:bold'] = 'Applies bold format to current selection';
$string['menudescription:codeformat'] = 'Applies inline code format to current selection';
$string['menudescription:copy'] = 'Copies the current selection into clipboard';
$string['menudescription:cut'] = 'Cuts the current selection into clipboard';
$string['menudescription:forecolor'] = 'Applies foreground/text color to selection';
$string['menudescription:formats'] = 'Menu of all available formats';
$string['menudescription:fontformats'] = 'Dropdown list with font families to apply to selection';
$string['menudescription:fontsizes'] = 'Dropdown list with font sizes to apply to selection';
$string['menudescription:italic'] = 'Applies italic format to current selection';
$string['menudescription:language'] = 'Dropdown list with languages to apply to the selection. This item requires the content_langs option';
$string['menudescription:lineheight'] = 'Dropdown list with line heights to apply to selection.';
$string['menudescription:newdocument'] = 'Creates a new document';
$string['menudescription:paste'] = 'Pastes the current clipboard contents into editor';
$string['menudescription:redo'] = 'To redo the last undo-ed operation';
$string['menudescription:removeformat'] = 'Removes all formats form the current selection';
$string['menudescription:selectall'] = 'Selects all the editor contents';
$string['menudescription:strikethrough'] = 'Applies strikethrough format to current selection';
$string['menudescription:subscript'] = 'Applies subscript format to current selection';
$string['menudescription:superscript'] = 'Applies superscript format to current selection';
$string['menudescription:underline'] = 'Applies underline format to current selection';
$string['menudescription:undo'] = 'To undo the last operation';
$string['menudescription:visualaid'] = 'Toggles visual aids on/off';
$string['menudescription:anchor'] = 'Inserts an anchor into the editor';
$string['menudescription:restoredraft'] = 'Restores to the latest auto saved draft';
$string['menudescription:charmap'] = 'Opens the charmap dialog';
$string['menudescription:code'] = 'Opens the code dialog';
$string['menudescription:codesample'] = 'Inserts code snippets with syntax highlighting';
$string['menudescription:emoticons'] = 'Opens the emoticons dialog';
$string['menudescription:fullscreen'] = 'Toggles fullscreen on/off';
$string['menudescription:help'] = 'Opens the help dialog';
$string['menudescription:hr'] = 'Inserts a horizontal rule into the editor';
$string['menudescription:image'] = 'Opens the image dialog';
$string['menudescription:insertdatetime'] = 'Inserts the current date/time into the editor';
$string['menudescription:link'] = 'Opens the link dialog';
$string['menudescription:media'] = 'Opens the media dialog';
$string['menudescription:nonbreaking'] = 'Inserts a nonbreaking space into the editor';
$string['menudescription:pagebreak'] = 'Inserts a pagebreak into the editor';
$string['menudescription:pageembed'] = 'Opens the insert or edit iframe dialog';
$string['menudescription:pastetext'] = 'Toggles paste as plain text on/off. When in plain text mode, all rich content is converted into plain text';
$string['menudescription:preview'] = 'Previews the current document';
$string['menudescription:print'] = 'Prints the current document';
$string['menudescription:searchreplace'] = 'Opens the search/replace dialog';
$string['menudescription:spellchecker'] = 'Toggles the spellchecker on/off';
$string['menudescription:inserttable'] = 'Inserts table grid menu';
$string['menudescription:tableprops'] = 'Opens the table properties dialog';
$string['menudescription:deletetable'] = 'Deletes the current table';
$string['menudescription:cell'] = 'Cell menu item with related controls';
$string['menudescription:tablemergecells'] = 'Merges all currently selected cells';
$string['menudescription:tablesplitcells'] = 'Splits merged cells';
$string['menudescription:tablecellprops'] = 'Opens the cell properties dialog';
$string['menudescription:column'] = 'Column menu item with related controls';
$string['menudescription:tableinsertcolumnbefore'] = 'Insert column before the currently selected column';
$string['menudescription:tableinsertcolumnafter'] = 'Insert column after the currently selected column';
$string['menudescription:tablecutcolumn'] = 'Cut the currently selected column or columns';
$string['menudescription:tablecopycolumn'] = 'Copy the currently selected column or columns';
$string['menudescription:tablepastecolumnbefore'] = 'Paste column before the currently selected column';
$string['menudescription:tablepastecolumnafter'] = 'Paste column after the currently selected column';
$string['menudescription:tabledeletecolumn'] = 'Deletes the currently selected column or columns';
$string['menudescription:row'] = 'Row menu item with related controls';
$string['menudescription:tableinsertrowbefore'] = 'Inserts row before the currently selected row';
$string['menudescription:tableinsertrowafter'] = 'Inserts row after the currently selected row';
$string['menudescription:tablecutrow'] = 'Cut the currently selected row or rows';
$string['menudescription:tablecopyrow'] = 'Copy the currently selected row or rows';
$string['menudescription:tablepasterowbefore'] = 'Paste row before the currently selected row';
$string['menudescription:tablepasterowafter'] = 'Paste row after the currently selected row';
$string['menudescription:tablerowprops'] = 'Opens the row properties dialog';
$string['menudescription:tabledeleterow'] = 'Deletes the currently selected row or rows';
$string['menudescription:template'] = 'Inserts templates into the editor';
$string['menudescription:toc'] = 'Inserts a Table of Contents into the editor';
$string['menudescription:visualblocks'] = 'Toggles block visibility on/off';
$string['menudescription:visualchars'] = 'Toggles visibility of nonbreaking spaces on/off';
$string['menudescription:wordcount'] = 'Opens a word count dialog showing word and character counts';
