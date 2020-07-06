// app.js

import UiButtonButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import CorePlugin from '@ckeditor/ckeditor5-core/src/plugin';
import CoreCommand from '@ckeditor/ckeditor5-core/src/command';
import UiToolbarToolbarSeparateView from '@ckeditor/ckeditor5-ui/src/toolbar/toolbarseparatorview';
import UiDropdownButtonSplitButtonView from '@ckeditor/ckeditor5-ui/src/dropdown/button/splitbuttonview';
import UiDropdownUtils from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

export const dependencies = {
    UiButtonButtonView,
    CorePlugin,
    UiToolbarToolbarSeparateView,
    UiDropdownButtonSplitButtonView,
    UiDropdownUtils,
};

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';

import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Code from '@ckeditor/ckeditor5-basic-styles/src/code';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';

import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock';

import Link from '@ckeditor/ckeditor5-link/src/link';

import List from '@ckeditor/ckeditor5-list/src/list';

export const core = {
    ClassicEditor,
};

export const plugins = {
    Essentials,
    Paragraph,

    Heading,
    Indent,
    IndentBlock,

    Bold,
    Italic,
    Underline,
    Strikethrough,
    Code,
    Subscript,
    Superscript,

    Link,
    List,
};
