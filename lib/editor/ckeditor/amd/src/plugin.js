define(["@ckeditor/ckeditor5-core/src/command","@ckeditor/ckeditor5-core/src/plugin","@ckeditor/ckeditor5-ui/src/button/buttonview","@ckeditor/ckeditor5-ui/src/dropdown/button/splitbuttonview","@ckeditor/ckeditor5-ui/src/dropdown/utils","@ckeditor/ckeditor5-ui/src/toolbar/toolbarseparatorview"], function(__WEBPACK_EXTERNAL_MODULE__ckeditor_ckeditor5_core_src_command__, __WEBPACK_EXTERNAL_MODULE__ckeditor_ckeditor5_core_src_plugin__, __WEBPACK_EXTERNAL_MODULE__ckeditor_ckeditor5_ui_src_button_buttonview__, __WEBPACK_EXTERNAL_MODULE__ckeditor_ckeditor5_ui_src_dropdown_button_splitbuttonview__, __WEBPACK_EXTERNAL_MODULE__ckeditor_ckeditor5_ui_src_dropdown_utils__, __WEBPACK_EXTERNAL_MODULE__ckeditor_ckeditor5_ui_src_toolbar_toolbarseparatorview__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./plugin.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@ckeditor/ckeditor5-core/theme/icons/eraser.svg":
/*!**********************************************************************!*\
  !*** ./node_modules/@ckeditor/ckeditor5-core/theme/icons/eraser.svg ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<svg viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M8.636 9.531l-2.758 3.94a.5.5 0 0 0 .122.696l3.224 2.284h1.314l2.636-3.736L8.636 9.53zm.288 8.451L5.14 15.396a2 2 0 0 1-.491-2.786l6.673-9.53a2 2 0 0 1 2.785-.49l3.742 2.62a2 2 0 0 1 .491 2.785l-7.269 10.053-2.147-.066z\"/><path d=\"M4 18h5.523v-1H4zm-2 0h1v-1H2z\"/></svg>");

/***/ }),

/***/ "./node_modules/@ckeditor/ckeditor5-highlight/src/highlight.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@ckeditor/ckeditor5-highlight/src/highlight.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Highlight; });
/* harmony import */ var _ckeditor_ckeditor5_core_src_plugin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ckeditor/ckeditor5-core/src/plugin */ "@ckeditor/ckeditor5-core/src/plugin");
/* harmony import */ var _ckeditor_ckeditor5_core_src_plugin__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_ckeditor_ckeditor5_core_src_plugin__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _highlightediting__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./highlightediting */ "./node_modules/@ckeditor/ckeditor5-highlight/src/highlightediting.js");
/* harmony import */ var _highlightui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./highlightui */ "./node_modules/@ckeditor/ckeditor5-highlight/src/highlightui.js");
/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module highlight/highlight
 */






/**
 * The highlight plugin.
 *
 * For a detailed overview, check the {@glink features/highlight Highlight feature} documentation.
 *
 * This is a "glue" plugin which loads the {@link module:highlight/highlightediting~HighlightEditing} and
 * {@link module:highlight/highlightui~HighlightUI} plugins.
 *
 * @extends module:core/plugin~Plugin
 */
class Highlight extends _ckeditor_ckeditor5_core_src_plugin__WEBPACK_IMPORTED_MODULE_0___default.a {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ _highlightediting__WEBPACK_IMPORTED_MODULE_1__["default"], _highlightui__WEBPACK_IMPORTED_MODULE_2__["default"] ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'Highlight';
	}
}

/**
 * The highlight option descriptor. See {@link module:highlight/highlight~HighlightConfig} to learn more.
 *
 *		{
 *			model: 'pinkMarker',
 *			class: 'marker-pink',
 *			title: 'Pink Marker',
 *			color: 'var(--ck-highlight-marker-pink)',
 *			type: 'marker'
 *		}
 *
 * @typedef {Object} module:highlight/highlight~HighlightOption
 * @property {String} title The user-readable title of the option.
 * @property {String} model The unique attribute value in the model.
 * @property {String} color The CSS `var()` used for the highlighter. The color is used in the user interface to represent the highlighter.
 * There is a possibility to use the default color format like rgb, hex or hsl, but you need to care about the color of `<mark>`
 * by adding CSS classes definition.
 * @property {String} class The CSS class used on the `<mark>` element in the view. It should match the `color` setting.
 * @property {'marker'|'pen'} type The type of highlighter:
 *
 * * `'marker'` &ndash; Uses the `color` as the `background-color` style,
 * * `'pen'` &ndash; Uses the `color` as the font `color` style.
 */

/**
 * The configuration of the {@link module:highlight/highlight~Highlight} feature.
 *
 * Read more in {@link module:highlight/highlight~HighlightConfig}.
 *
 * @member {module:highlight/highlight~HighlightConfig} module:core/editor/editorconfig~EditorConfig#highlight
 */

/**
 * The configuration of the {@link module:highlight/highlight~Highlight highlight feature}.
 *
 *		ClassicEditor
 *			.create( editorElement, {
 * 				highlight:  ... // Highlight feature configuration.
 *			} )
 *			.then( ... )
 *			.catch( ... );
 *
 * See {@link module:core/editor/editorconfig~EditorConfig all editor options}.
 *
 * @interface HighlightConfig
 */

/**
 * The available highlight options. The default value is:
 *
 *		options: [
 *			{
 *				model: 'yellowMarker',
 *				class: 'marker-yellow',
 *				title: 'Yellow marker',
 *				color: 'var(--ck-highlight-marker-yellow)',
 *				type: 'marker'
 *			},
 *			{
 *				model: 'greenMarker',
 *				class: 'marker-green',
 *				title: 'Green marker',
 *				color: 'var(--ck-highlight-marker-green)',
 *				type: 'marker'
 *			},
 *			{
 *				model: 'pinkMarker',
 *				class: 'marker-pink',
 *				title: 'Pink marker',
 *				color: 'var(--ck-highlight-marker-pink)',
 *				type: 'marker'
 *			},
 *			{
 *				model: 'blueMarker',
 *				class: 'marker-blue',
 *				title: 'Blue marker',
 *				color: 'var(--ck-highlight-marker-blue)',
 *				type: 'marker'
 *			},
 *			{
 *				model: 'redPen',
 *				class: 'pen-red',
 *				title: 'Red pen',
 *				color: 'var(--ck-highlight-pen-red)',
 *				type: 'pen'
 *			},
 *			{
 *				model: 'greenPen',
 *				class: 'pen-green',
 *				title: 'Green pen',
 *				color: 'var(--ck-highlight-pen-green)',
 *				type: 'pen'
 *			}
 *		]
 *
 * There are two types of highlighters available:
 *
 * * `'marker'` &ndash; Rendered as a `<mark>` element, styled with the `background-color`.
 * * `'pen'` &ndash; Rendered as a `<mark>` element, styled with the font `color`.
 *
 * **Note**: The highlight feature provides a stylesheet with the CSS classes and corresponding colors defined
 * as CSS variables.
 *
 *		:root {
 *			--ck-highlight-marker-yellow: #fdfd77;
 *			--ck-highlight-marker-green: #63f963;
 *			--ck-highlight-marker-pink: #fc7999;
 *			--ck-highlight-marker-blue: #72cdfd;
 *			--ck-highlight-pen-red: #e91313;
 *			--ck-highlight-pen-green: #118800;
 *		}
 *
 *		.marker-yellow { ... }
 *		.marker-green { ... }
 *		.marker-pink { ... }
 *		.marker-blue { ... }
 *		.pen-red { ... }
 *		.pen-green { ... }
 *
 * It is possible to define the `color` property directly as `rgba(R, G, B, A)`,
 * `#RRGGBB[AA]` or `hsla(H, S, L, A)`. In such situation, the color will **only** apply to the UI of
 * the editor and the `<mark>` elements in the content must be styled by custom classes provided by
 * a dedicated stylesheet.
 *
 * **Note**: It is recommended for the `color` property to correspond to the class in the content
 * stylesheet because it represents the highlighter in the user interface of the editor.
 *
 *		ClassicEditor
 *			.create( editorElement, {
 *				highlight: {
 *					options: [
 *						{
 *							model: 'pinkMarker',
 *							class: 'marker-pink',
 *							title: 'Pink Marker',
 *							color: 'var(--ck-highlight-marker-pink)',
 *							type: 'marker'
 *						},
 *						{
 *							model: 'redPen',
 *							class: 'pen-red',
 *							title: 'Red Pen',
 *							color: 'var(--ck-highlight-pen-red)',
 *							type: 'pen'
 *						},
 *					]
 *				}
 *		} )
 *		.then( ... )
 *		.catch( ... );
 *
 * @member {Array.<module:highlight/highlight~HighlightOption>} module:highlight/highlight~HighlightConfig#options
 */


/***/ }),

/***/ "./node_modules/@ckeditor/ckeditor5-highlight/src/highlightcommand.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@ckeditor/ckeditor5-highlight/src/highlightcommand.js ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return HighlightCommand; });
/* harmony import */ var _ckeditor_ckeditor5_core_src_command__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ckeditor/ckeditor5-core/src/command */ "@ckeditor/ckeditor5-core/src/command");
/* harmony import */ var _ckeditor_ckeditor5_core_src_command__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_ckeditor_ckeditor5_core_src_command__WEBPACK_IMPORTED_MODULE_0__);
/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module highlight/highlightcommand
 */



/**
 * The highlight command. It is used by the {@link module:highlight/highlightediting~HighlightEditing highlight feature}
 * to apply the text highlighting.
 *
 *		editor.execute( 'highlight', { value: 'greenMarker' } );
 *
 * **Note**: Executing the command without a value removes the attribute from the model. If the selection is collapsed
 * inside a text with the highlight attribute, the command will remove the attribute from the entire range
 * of that text.
 *
 * @extends module:core/command~Command
 */
class HighlightCommand extends _ckeditor_ckeditor5_core_src_command__WEBPACK_IMPORTED_MODULE_0___default.a {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const model = this.editor.model;
		const doc = model.document;

		/**
		 * A value indicating whether the command is active. If the selection has some highlight attribute,
		 * it corresponds to the value of that attribute.
		 *
		 * @observable
		 * @readonly
		 * @member {undefined|String} module:highlight/highlightcommand~HighlightCommand#value
		 */
		this.value = doc.selection.getAttribute( 'highlight' );
		this.isEnabled = model.schema.checkAttributeInSelection( doc.selection, 'highlight' );
	}

	/**
	 * Executes the command.
	 *
	 * @param {Object} [options] Options for the executed command.
	 * @param {String} [options.value] The value to apply.
	 *
	 * @fires execute
	 */
	execute( options = {} ) {
		const model = this.editor.model;
		const document = model.document;
		const selection = document.selection;

		const highlighter = options.value;

		model.change( writer => {
			const ranges = model.schema.getValidRanges( selection.getRanges(), 'highlight' );

			if ( selection.isCollapsed ) {
				const position = selection.getFirstPosition();

				// When selection is inside text with `highlight` attribute.
				if ( selection.hasAttribute( 'highlight' ) ) {
					// Find the full highlighted range.
					const isSameHighlight = value => {
						return value.item.hasAttribute( 'highlight' ) && value.item.getAttribute( 'highlight' ) === this.value;
					};

					const highlightStart = position.getLastMatchingPosition( isSameHighlight, { direction: 'backward' } );
					const highlightEnd = position.getLastMatchingPosition( isSameHighlight );

					const highlightRange = writer.createRange( highlightStart, highlightEnd );

					// Then depending on current value...
					if ( !highlighter || this.value === highlighter ) {
						// ...remove attribute when passing highlighter different then current or executing "eraser".
						writer.removeAttribute( 'highlight', highlightRange );
						writer.removeSelectionAttribute( 'highlight' );
					} else {
						// ...update `highlight` value.
						writer.setAttribute( 'highlight', highlighter, highlightRange );
						writer.setSelectionAttribute( 'highlight', highlighter );
					}
				} else if ( highlighter ) {
					writer.setSelectionAttribute( 'highlight', highlighter );
				}
			} else {
				for ( const range of ranges ) {
					if ( highlighter ) {
						writer.setAttribute( 'highlight', highlighter, range );
					} else {
						writer.removeAttribute( 'highlight', range );
					}
				}
			}
		} );
	}
}


/***/ }),

/***/ "./node_modules/@ckeditor/ckeditor5-highlight/src/highlightediting.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@ckeditor/ckeditor5-highlight/src/highlightediting.js ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return HighlightEditing; });
/* harmony import */ var _ckeditor_ckeditor5_core_src_plugin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ckeditor/ckeditor5-core/src/plugin */ "@ckeditor/ckeditor5-core/src/plugin");
/* harmony import */ var _ckeditor_ckeditor5_core_src_plugin__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_ckeditor_ckeditor5_core_src_plugin__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _highlightcommand__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./highlightcommand */ "./node_modules/@ckeditor/ckeditor5-highlight/src/highlightcommand.js");
/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module highlight/highlightediting
 */





/**
 * The highlight editing feature. It introduces the {@link module:highlight/highlightcommand~HighlightCommand command} and the `highlight`
 * attribute in the {@link module:engine/model/model~Model model} which renders in the {@link module:engine/view/view view}
 * as a `<mark>` element with a `class` attribute (`<mark class="marker-green">...</mark>`) depending
 * on the {@link module:highlight/highlight~HighlightConfig configuration}.
 *
 * @extends module:core/plugin~Plugin
 */
class HighlightEditing extends _ckeditor_ckeditor5_core_src_plugin__WEBPACK_IMPORTED_MODULE_0___default.a {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'HighlightEditing';
	}

	/**
	 * @inheritDoc
	 */
	constructor( editor ) {
		super( editor );

		editor.config.define( 'highlight', {
			options: [
				{
					model: 'yellowMarker',
					class: 'marker-yellow',
					title: 'Yellow marker',
					color: 'var(--ck-highlight-marker-yellow)',
					type: 'marker'
				},
				{
					model: 'greenMarker',
					class: 'marker-green',
					title: 'Green marker',
					color: 'var(--ck-highlight-marker-green)',
					type: 'marker'
				},
				{
					model: 'pinkMarker',
					class: 'marker-pink',
					title: 'Pink marker',
					color: 'var(--ck-highlight-marker-pink)',
					type: 'marker'
				},
				{
					model: 'blueMarker',
					class: 'marker-blue',
					title: 'Blue marker',
					color: 'var(--ck-highlight-marker-blue)',
					type: 'marker'
				},
				{
					model: 'redPen',
					class: 'pen-red',
					title: 'Red pen',
					color: 'var(--ck-highlight-pen-red)',
					type: 'pen'
				},
				{
					model: 'greenPen',
					class: 'pen-green',
					title: 'Green pen',
					color: 'var(--ck-highlight-pen-green)',
					type: 'pen'
				}
			]
		} );
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;

		// Allow highlight attribute on text nodes.
		editor.model.schema.extend( '$text', { allowAttributes: 'highlight' } );

		const options = editor.config.get( 'highlight.options' );

		// Set-up the two-way conversion.
		editor.conversion.attributeToElement( _buildDefinition( options ) );

		editor.commands.add( 'highlight', new _highlightcommand__WEBPACK_IMPORTED_MODULE_1__["default"]( editor ) );
	}
}

// Converts the options array to a converter definition.
//
// @param {Array.<module:highlight/highlight~HighlightOption>} options An array with configured options.
// @returns {module:engine/conversion/conversion~ConverterDefinition}
function _buildDefinition( options ) {
	const definition = {
		model: {
			key: 'highlight',
			values: []
		},
		view: {}
	};

	for ( const option of options ) {
		definition.model.values.push( option.model );
		definition.view[ option.model ] = {
			name: 'mark',
			classes: option.class
		};
	}

	return definition;
}


/***/ }),

/***/ "./node_modules/@ckeditor/ckeditor5-highlight/src/highlightui.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@ckeditor/ckeditor5-highlight/src/highlightui.js ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return HighlightUI; });
/* harmony import */ var _ckeditor_ckeditor5_core_src_plugin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ckeditor/ckeditor5-core/src/plugin */ "@ckeditor/ckeditor5-core/src/plugin");
/* harmony import */ var _ckeditor_ckeditor5_core_src_plugin__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_ckeditor_ckeditor5_core_src_plugin__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ckeditor_ckeditor5_ui_src_button_buttonview__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ckeditor/ckeditor5-ui/src/button/buttonview */ "@ckeditor/ckeditor5-ui/src/button/buttonview");
/* harmony import */ var _ckeditor_ckeditor5_ui_src_button_buttonview__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_ckeditor_ckeditor5_ui_src_button_buttonview__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _theme_icons_marker_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../theme/icons/marker.svg */ "./node_modules/@ckeditor/ckeditor5-highlight/theme/icons/marker.svg");
/* harmony import */ var _theme_icons_pen_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../theme/icons/pen.svg */ "./node_modules/@ckeditor/ckeditor5-highlight/theme/icons/pen.svg");
/* harmony import */ var _ckeditor_ckeditor5_core_theme_icons_eraser_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ckeditor/ckeditor5-core/theme/icons/eraser.svg */ "./node_modules/@ckeditor/ckeditor5-core/theme/icons/eraser.svg");
/* harmony import */ var _ckeditor_ckeditor5_ui_src_toolbar_toolbarseparatorview__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ckeditor/ckeditor5-ui/src/toolbar/toolbarseparatorview */ "@ckeditor/ckeditor5-ui/src/toolbar/toolbarseparatorview");
/* harmony import */ var _ckeditor_ckeditor5_ui_src_toolbar_toolbarseparatorview__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_ckeditor_ckeditor5_ui_src_toolbar_toolbarseparatorview__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _ckeditor_ckeditor5_ui_src_dropdown_button_splitbuttonview__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ckeditor/ckeditor5-ui/src/dropdown/button/splitbuttonview */ "@ckeditor/ckeditor5-ui/src/dropdown/button/splitbuttonview");
/* harmony import */ var _ckeditor_ckeditor5_ui_src_dropdown_button_splitbuttonview__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_ckeditor_ckeditor5_ui_src_dropdown_button_splitbuttonview__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _ckeditor_ckeditor5_ui_src_dropdown_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ckeditor/ckeditor5-ui/src/dropdown/utils */ "@ckeditor/ckeditor5-ui/src/dropdown/utils");
/* harmony import */ var _ckeditor_ckeditor5_ui_src_dropdown_utils__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_ckeditor_ckeditor5_ui_src_dropdown_utils__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _theme_highlight_css__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./../theme/highlight.css */ "./node_modules/@ckeditor/ckeditor5-highlight/theme/highlight.css");
/* harmony import */ var _theme_highlight_css__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_theme_highlight_css__WEBPACK_IMPORTED_MODULE_8__);
/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module highlight/highlightui
 */















/**
 * The default highlight UI plugin. It introduces:
 *
 * * The `'highlight'` dropdown,
 * * The `'removeHighlight'` and `'highlight:*'` buttons.
 *
 * The default configuration includes the following buttons:
 *
 * * `'highlight:yellowMarker'`
 * * `'highlight:greenMarker'`
 * * `'highlight:pinkMarker'`
 * * `'highlight:blueMarker'`
 * * `'highlight:redPen'`
 * * `'highlight:greenPen'`
 *
 * See the {@link module:highlight/highlight~HighlightConfig#options configuration} to learn more
 * about the defaults.
 *
 * @extends module:core/plugin~Plugin
 */
class HighlightUI extends _ckeditor_ckeditor5_core_src_plugin__WEBPACK_IMPORTED_MODULE_0___default.a {
	/**
	 * Returns the localized option titles provided by the plugin.
	 *
	 * The following localized titles corresponding with default
	 * {@link module:highlight/highlight~HighlightConfig#options} are available:
	 *
	 * * `'Yellow marker'`,
	 * * `'Green marker'`,
	 * * `'Pink marker'`,
	 * * `'Blue marker'`,
	 * * `'Red pen'`,
	 * * `'Green pen'`.
	 *
	 * @readonly
	 * @type {Object.<String,String>}
	 */
	get localizedOptionTitles() {
		const t = this.editor.t;

		return {
			'Yellow marker': t( 'Yellow marker' ),
			'Green marker': t( 'Green marker' ),
			'Pink marker': t( 'Pink marker' ),
			'Blue marker': t( 'Blue marker' ),
			'Red pen': t( 'Red pen' ),
			'Green pen': t( 'Green pen' )
		};
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'HighlightUI';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const options = this.editor.config.get( 'highlight.options' );

		for ( const option of options ) {
			this._addHighlighterButton( option );
		}

		this._addRemoveHighlightButton();

		this._addDropdown( options );
	}

	/**
	 * Creates the "Remove highlight" button.
	 *
	 * @private
	 */
	_addRemoveHighlightButton() {
		const t = this.editor.t;

		this._addButton( 'removeHighlight', t( 'Remove highlight' ), _ckeditor_ckeditor5_core_theme_icons_eraser_svg__WEBPACK_IMPORTED_MODULE_4__["default"] );
	}

	/**
	 * Creates a toolbar button from the provided highlight option.
	 *
	 * @param {module:highlight/highlight~HighlightOption} option
	 * @private
	 */
	_addHighlighterButton( option ) {
		const command = this.editor.commands.get( 'highlight' );

		// TODO: change naming
		this._addButton( 'highlight:' + option.model, option.title, getIconForType( option.type ), option.model, decorateHighlightButton );

		function decorateHighlightButton( button ) {
			button.bind( 'isEnabled' ).to( command, 'isEnabled' );
			button.bind( 'isOn' ).to( command, 'value', value => value === option.model );
			button.iconView.fillColor = option.color;
			button.isToggleable = true;
		}
	}

	/**
	 * Internal method for creating highlight buttons.
	 *
	 * @param {String} name The name of the button.
	 * @param {String} label The label for the button.
	 * @param {String} icon The button icon.
	 * @param {Function} [decorateButton=()=>{}] Additional method for extending the button.
	 * @private
	 */
	_addButton( name, label, icon, value, decorateButton = () => {} ) {
		const editor = this.editor;

		editor.ui.componentFactory.add( name, locale => {
			const buttonView = new _ckeditor_ckeditor5_ui_src_button_buttonview__WEBPACK_IMPORTED_MODULE_1___default.a( locale );

			const localized = this.localizedOptionTitles[ label ] ? this.localizedOptionTitles[ label ] : label;

			buttonView.set( {
				label: localized,
				icon,
				tooltip: true
			} );

			buttonView.on( 'execute', () => {
				editor.execute( 'highlight', { value } );
				editor.editing.view.focus();
			} );

			// Add additional behavior for buttonView.
			decorateButton( buttonView );

			return buttonView;
		} );
	}

	/**
	 * Creates the split button dropdown UI from the provided highlight options.
	 *
	 * @param {Array.<module:highlight/highlight~HighlightOption>} options
	 * @private
	 */
	_addDropdown( options ) {
		const editor = this.editor;
		const t = editor.t;
		const componentFactory = editor.ui.componentFactory;

		const startingHighlighter = options[ 0 ];

		const optionsMap = options.reduce( ( retVal, option ) => {
			retVal[ option.model ] = option;

			return retVal;
		}, {} );

		componentFactory.add( 'highlight', locale => {
			const command = editor.commands.get( 'highlight' );
			const dropdownView = Object(_ckeditor_ckeditor5_ui_src_dropdown_utils__WEBPACK_IMPORTED_MODULE_7__["createDropdown"])( locale, _ckeditor_ckeditor5_ui_src_dropdown_button_splitbuttonview__WEBPACK_IMPORTED_MODULE_6___default.a );
			const splitButtonView = dropdownView.buttonView;

			splitButtonView.set( {
				tooltip: t( 'Highlight' ),
				// Holds last executed highlighter.
				lastExecuted: startingHighlighter.model,
				// Holds current highlighter to execute (might be different then last used).
				commandValue: startingHighlighter.model,
				isToggleable: true
			} );

			// Dropdown button changes to selection (command.value):
			// - If selection is in highlight it get active highlight appearance (icon, color) and is activated.
			// - Otherwise it gets appearance (icon, color) of last executed highlight.
			splitButtonView.bind( 'icon' ).to( command, 'value', value => getIconForType( getActiveOption( value, 'type' ) ) );
			splitButtonView.bind( 'color' ).to( command, 'value', value => getActiveOption( value, 'color' ) );
			splitButtonView.bind( 'commandValue' ).to( command, 'value', value => getActiveOption( value, 'model' ) );
			splitButtonView.bind( 'isOn' ).to( command, 'value', value => !!value );

			splitButtonView.delegate( 'execute' ).to( dropdownView );

			// Create buttons array.
			const buttons = options.map( option => {
				// Get existing highlighter button.
				const buttonView = componentFactory.create( 'highlight:' + option.model );

				// Update lastExecutedHighlight on execute.
				this.listenTo( buttonView, 'execute', () => dropdownView.buttonView.set( { lastExecuted: option.model } ) );

				return buttonView;
			} );

			// Make toolbar button enabled when any button in dropdown is enabled before adding separator and eraser.
			dropdownView.bind( 'isEnabled' ).toMany( buttons, 'isEnabled', ( ...areEnabled ) => areEnabled.some( isEnabled => isEnabled ) );

			// Add separator and eraser buttons to dropdown.
			buttons.push( new _ckeditor_ckeditor5_ui_src_toolbar_toolbarseparatorview__WEBPACK_IMPORTED_MODULE_5___default.a() );
			buttons.push( componentFactory.create( 'removeHighlight' ) );

			Object(_ckeditor_ckeditor5_ui_src_dropdown_utils__WEBPACK_IMPORTED_MODULE_7__["addToolbarToDropdown"])( dropdownView, buttons );
			bindToolbarIconStyleToActiveColor( dropdownView );

			dropdownView.toolbarView.ariaLabel = t( 'Text highlight toolbar' );

			// Execute current action from dropdown's split button action button.
			splitButtonView.on( 'execute', () => {
				editor.execute( 'highlight', { value: splitButtonView.commandValue } );
				editor.editing.view.focus();
			} );

			// Returns active highlighter option depending on current command value.
			// If current is not set or it is the same as last execute this method will return the option key (like icon or color)
			// of last executed highlighter. Otherwise it will return option key for current one.
			function getActiveOption( current, key ) {
				const whichHighlighter = !current ||
				current === splitButtonView.lastExecuted ? splitButtonView.lastExecuted : current;

				return optionsMap[ whichHighlighter ][ key ];
			}

			return dropdownView;
		} );
	}
}

// Extends split button icon style to reflect last used button style.
function bindToolbarIconStyleToActiveColor( dropdownView ) {
	const actionView = dropdownView.buttonView.actionView;

	actionView.iconView.bind( 'fillColor' ).to( dropdownView.buttonView, 'color' );
}

// Returns icon for given highlighter type.
function getIconForType( type ) {
	return type === 'marker' ? _theme_icons_marker_svg__WEBPACK_IMPORTED_MODULE_2__["default"] : _theme_icons_pen_svg__WEBPACK_IMPORTED_MODULE_3__["default"];
}


/***/ }),

/***/ "./node_modules/@ckeditor/ckeditor5-highlight/theme/highlight.css":
/*!************************************************************************!*\
  !*** ./node_modules/@ckeditor/ckeditor5-highlight/theme/highlight.css ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(/*! ../../../style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !../../../postcss-loader/src??ref--5-1!./highlight.css */ "./node_modules/postcss-loader/src/index.js?!./node_modules/@ckeditor/ckeditor5-highlight/theme/highlight.css");

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {"injectType":"singletonStyleTag","attributes":{"data-cke":true}};

options.insert = "head";
options.singleton = true;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),

/***/ "./node_modules/@ckeditor/ckeditor5-highlight/theme/icons/marker.svg":
/*!***************************************************************************!*\
  !*** ./node_modules/@ckeditor/ckeditor5-highlight/theme/icons/marker.svg ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<svg viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path class=\"ck-icon__fill\" d=\"M10.798 1.59L3.002 12.875l1.895 1.852 2.521 1.402 6.997-12.194z\"/><path d=\"M2.556 16.727l.234-.348c-.297-.151-.462-.293-.498-.426-.036-.137.002-.416.115-.837.094-.25.15-.449.169-.595a4.495 4.495 0 0 0 0-.725c-.209-.621-.303-1.041-.284-1.26.02-.218.178-.506.475-.862l6.77-9.414c.539-.91 1.605-.85 3.199.18 1.594 1.032 2.188 1.928 1.784 2.686l-5.877 10.36c-.158.412-.333.673-.526.782-.193.108-.604.179-1.232.21-.362.131-.608.237-.738.318-.13.081-.305.238-.526.47-.293.265-.504.397-.632.397-.096 0-.27-.075-.524-.226l-.31.41-1.6-1.12zm-.279.415l1.575 1.103-.392.515H1.19l1.087-1.618zm8.1-13.656l-4.953 6.9L8.75 12.57l4.247-7.574c.175-.25-.188-.647-1.092-1.192-.903-.546-1.412-.652-1.528-.32zM8.244 18.5L9.59 17h9.406v1.5H8.245z\"/></svg>");

/***/ }),

/***/ "./node_modules/@ckeditor/ckeditor5-highlight/theme/icons/pen.svg":
/*!************************************************************************!*\
  !*** ./node_modules/@ckeditor/ckeditor5-highlight/theme/icons/pen.svg ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<svg viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path class=\"ck-icon__fill\" d=\"M10.126 2.268L2.002 13.874l1.895 1.852 2.521 1.402L14.47 5.481l-1.543-2.568-2.801-.645z\"/><path d=\"M4.5 18.088l-2.645-1.852-.04-2.95-.006-.005.006-.008v-.025l.011.008L8.73 2.97c.165-.233.356-.417.567-.557l-1.212.308L4.604 7.9l-.83-.558 3.694-5.495 2.708-.69 1.65 1.145.046.018.85-1.216 2.16 1.512-.856 1.222c.828.967 1.144 2.141.432 3.158L7.55 17.286l.006.005-3.055.797H4.5zm-.634.166l-1.976.516-.026-1.918 2.002 1.402zM9.968 3.817l-.006-.004-6.123 9.184 3.277 2.294 6.108-9.162.005.003c.317-.452-.16-1.332-1.064-1.966-.891-.624-1.865-.776-2.197-.349zM8.245 18.5L9.59 17h9.406v1.5H8.245z\"/></svg>");

/***/ }),

/***/ "./node_modules/postcss-loader/src/index.js?!./node_modules/@ckeditor/ckeditor5-highlight/theme/highlight.css":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/postcss-loader/src??ref--5-1!./node_modules/@ckeditor/ckeditor5-highlight/theme/highlight.css ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":root{--ck-highlight-marker-yellow:#fdfd77;--ck-highlight-marker-green:#62f962;--ck-highlight-marker-pink:#fc7899;--ck-highlight-marker-blue:#72ccfd;--ck-highlight-pen-red:#e71313;--ck-highlight-pen-green:#128a00}.ck-content .marker-yellow{background-color:var(--ck-highlight-marker-yellow)}.ck-content .marker-green{background-color:var(--ck-highlight-marker-green)}.ck-content .marker-pink{background-color:var(--ck-highlight-marker-pink)}.ck-content .marker-blue{background-color:var(--ck-highlight-marker-blue)}.ck-content .pen-red{color:var(--ck-highlight-pen-red);background-color:transparent}.ck-content .pen-green{color:var(--ck-highlight-pen-green);background-color:transparent}"

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : undefined;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && btoa) {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./plugin.js":
/*!*******************!*\
  !*** ./plugin.js ***!
  \*******************/
/*! exports provided: plugins */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "plugins", function() { return plugins; });
/* harmony import */ var _ckeditor_ckeditor5_highlight_src_highlight__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ckeditor/ckeditor5-highlight/src/highlight */ "./node_modules/@ckeditor/ckeditor5-highlight/src/highlight.js");
// app.js



const plugins = {
    Highlight: _ckeditor_ckeditor5_highlight_src_highlight__WEBPACK_IMPORTED_MODULE_0__["default"],
};


/***/ }),

/***/ "@ckeditor/ckeditor5-core/src/command":
/*!*******************************************************!*\
  !*** external "@ckeditor/ckeditor5-core/src/command" ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__ckeditor_ckeditor5_core_src_command__;

/***/ }),

/***/ "@ckeditor/ckeditor5-core/src/plugin":
/*!******************************************************!*\
  !*** external "@ckeditor/ckeditor5-core/src/plugin" ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__ckeditor_ckeditor5_core_src_plugin__;

/***/ }),

/***/ "@ckeditor/ckeditor5-ui/src/button/buttonview":
/*!***************************************************************!*\
  !*** external "@ckeditor/ckeditor5-ui/src/button/buttonview" ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__ckeditor_ckeditor5_ui_src_button_buttonview__;

/***/ }),

/***/ "@ckeditor/ckeditor5-ui/src/dropdown/button/splitbuttonview":
/*!*****************************************************************************!*\
  !*** external "@ckeditor/ckeditor5-ui/src/dropdown/button/splitbuttonview" ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__ckeditor_ckeditor5_ui_src_dropdown_button_splitbuttonview__;

/***/ }),

/***/ "@ckeditor/ckeditor5-ui/src/dropdown/utils":
/*!************************************************************!*\
  !*** external "@ckeditor/ckeditor5-ui/src/dropdown/utils" ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__ckeditor_ckeditor5_ui_src_dropdown_utils__;

/***/ }),

/***/ "@ckeditor/ckeditor5-ui/src/toolbar/toolbarseparatorview":
/*!**************************************************************************!*\
  !*** external "@ckeditor/ckeditor5-ui/src/toolbar/toolbarseparatorview" ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__ckeditor_ckeditor5_ui_src_toolbar_toolbarseparatorview__;

/***/ })

/******/ })});;
//# sourceMappingURL=plugin.js.map