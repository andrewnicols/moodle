YUI.add('moodle-form-shortforms', function (Y, NAME) {

/**
 * Provides the form shortforms class.
 *
 * @module moodle-form-shortforms
 */

/**
 * A class for a shortforms.
 *
 * @class M.form.shortforms
 * @constructor
 * @extends Base
 */
function SHORTFORMS() {
    SHORTFORMS.superclass.constructor.apply(this, arguments);
}

var SELECTORS = {
    COLLAPSEEXPAND: '.collapsible-actions .collapseexpand',
    COLLAPSED: '.collapsed',
    FIELDSETCOLLAPSIBLE: 'fieldset.collapsible',
    FIELDSETLEGENDLINK: 'fieldset.collapsible .fheader',
    FHEADER: '.fheader',
    LEGENDFTOGGLER: 'legend.ftoggler'
};
// eslint-disable-next-line
var CSS = {
    COLLAPSEALL: 'collapse-all',
    COLLAPSED: 'collapsed',
    FHEADER: 'fheader'
};

Y.extend(SHORTFORMS, Y.Base, {
    /**
     * A reference to the form.
     *
     * @property form
     * @protected
     * @type Node
     * @default null
     */
    form: null,

    /**
     * Reference to the new core_forms/shortforms AMD module
     *
     * @property shortforms
     * @protected
     * @type Object
     */
    shortforms: null,

    /**
     * The initializer for the shortforms instance.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        this.form = Y.one('#' + this.get('formid'));
        if (!this.form) {
            return;
        }
        window.console.log('The moodle-form-shortforms module has been deprecated and replaced with core_forms/shortforms');

        require(['core_form/shortforms'], function(shortforms) {
            this.shortforms = shortforms;
            shortforms.init();
        }.bind(this));

        var btn;
        var link;
        var idlist;

        // Look through collapsible fieldset divs.
        this.form.all(SELECTORS.FIELDSETCOLLAPSIBLE).each(this.process_fieldset, this);

        // Make the collapse/expand a link.
        btn = this.form.one(SELECTORS.COLLAPSEEXPAND);
        if (btn) {
            link = Y.Node.create('<a href="#"></a>');
            link.setHTML(btn.getHTML());
            link.setAttribute('class', btn.getAttribute('class'));
            link.setAttribute('role', 'button');

            // Get list of IDs controlled by this button to set the aria-controls attribute.
            idlist = [];
            this.form.all(SELECTORS.FIELDSETLEGENDLINK).each(function(node) {
                idlist[idlist.length] = node.generateID();
            });
            link.setAttribute('aria-controls', idlist.join(' '));
            link.setAttribute('data-action', "core_form-shortforms-toggleall");
            btn.replace(link);
        }
    },

    /**
     * Process the supplied fieldset to add appropriate links, and ARIA
     * roles.
     *
     * @method process_fieldset
     * @param {Node} fieldset The Node relating to the fieldset to add collapsing to.
     * @chainable
     */
    process_fieldset: function(fieldset) {
        // Get legend element.
        var legendelement = fieldset.one(SELECTORS.LEGENDFTOGGLER);

        // Turn headers to links for accessibility.
        var headerlink = Y.Node.create('<a href="#"></a>');
        headerlink.addClass(CSS.FHEADER);
        headerlink.appendChild(legendelement.get('firstChild'));
        headerlink.setAttribute('role', 'button');
        headerlink.setAttribute('aria-controls', fieldset.generateID());
        headerlink.setAttribute('data-action', "core_form-shortforms-toggle-section");
        if (legendelement.ancestor(SELECTORS.COLLAPSED)) {
            fieldset.setAttribute('aria-expanded', 'false');
        } else {
            fieldset.setAttribute('aria-expanded', 'true');
        }
        legendelement.prepend(headerlink);

        return this;
    },

    /**
     * Set the collapsed state for the specified fieldset.
     *
     * @method set_state
     * @param {Node} fieldset The Node relating to the fieldset to set state on.
     * @param {Boolean} [collapsed] Whether the fieldset is collapsed.
     * @chainable
     */
    set_state: function(fieldset, collapsed) {
        if (collapsed) {
            this.shortforms.expandFieldset(fieldset.getDOMNode());
        } else {
            this.shortforms.collapseFieldset(fieldset.getDOMNode());
        }
    },

    /**
     * Set the state for all fieldsets in the form.
     *
     * @method set_state_all
     * @param {EventFacade} e
     */
    set_state_all: function(e) {
        var collapsed = e.target.hasClass(CSS.COLLAPSEALL);
        if (collapsed) {
            this.shortforms.expandForm(e.target.getDOMNode());
        } else {
            this.shortforms.collapseForm(e.target.getDOMNode());
        }

    },

    /**
     * Toggle the state for the fieldset that was clicked.
     *
     * @method switch_state
     * @param {EventFacade} e
     */
    switch_state: function(e) {
        e.preventDefault();
        this.shortforms.toggleFieldset(e.target.getDOMNode());
    },

    /**
     * Update the Expand/Collapse all buttons as required.
     *
     * @method update_btns
     * @chainable
     */
    update_btns: function() {
        window.console.log('The update_btns method is no longer available.');
    },

    /**
     * Expand the fieldset, which contains an error.
     *
     * @method expand_fieldset
     * @param {EventFacade} e
     */
    expand_fieldset: function(e) {
        e.preventDefault();
        this.shortforms.expandFieldset(e.target.getDOMNode());
    }
}, {
    NAME: 'moodle-form-shortforms',
    ATTRS: {
        formid: {
            value: null,
        },
    },
});

M.form = M.form || {};
M.form.shortforms = M.form.shortforms || function(params) {
    return new SHORTFORMS(params);
};


}, '@VERSION@', {"requires": ["node", "base", "selector-css3", "moodle-core-event"]});
