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

declare(strict_types=1);

namespace core;

use moodle_url;
use renderable;
use renderer_base;
use stdClass;
use templatable;

/**
 * A generic tree node.
 *
 * @package   core
 * @copyright 2021 Andrew Lyons <andrew@nicols.co.uk>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class tree_node implements
    renderable,
    templatable
{
    /** @var string The identifier for this node */
    protected $identifier;

    /** @var tree The parent tree */
    protected $parent;

    /** @var tree A child tree content */
    protected $childtree;

    /** @var string The visible value shown in the tree */
    protected $value;

    /** @var moodle_url The URL destination for the node */
    protected $link;

    /** @var array A set of attributes to apply to the node */
    protected $attributes = [];

    /** @var string The identifier for a Moodle pix icon */
    protected $iconidentifier;

    /** @var string The component for a Moodle pix icon */
    protected  $iconcomponent;

    /** @var string The label to apply to the icon */
    protected $iconlabel;

    public function __construct(string $identifier, string $value) {
        $this->identifier = $identifier;
        $this->set_value($value);
    }

    /**
     * Export the content of this tree node for rendering in a template.
     *
     * @param renderer_base $output Used to do a final render of any components that need to be rendered for export.
     * @return stdClass
     */
    public function export_for_template(renderer_base $output) {
        return (object) [
            'nodeidentifier' => $this->get_identifier(),
            'value' => $this->get_value(),
            'attributes' => $this->get_attributes(),
            'link' => $this->has_link() ?? $this->get_link()->out(),
            'icon' => $this->get_icon(),
            'tree' => $this->childtree ? $this->childtree->export_for_template($output) : false,
        ];
    }

    /**
     * Get the unique identifer for this node.
     *
     * @return string
     */
    public function get_identifier(): string {
        return $this->identifier;
    }

    /**
     * Set the content of the node - usually a title.
     *
     * @param string $value
     */
    public function set_value(string $value): void {
        $this->value = $value;
    }

    /**
     * Get the value - usually used as a title.
     *
     * @return string
     */
    public function get_value(): string {
        return $this->value;
    }

    /**
     * Set the destination path of the node.
     *
     * @param moodle_url $link
     */
    public function set_link(moodle_url $link): void {
        $this->link = $link;
    }

    public function has_link(): bool {
        return $this->link ? true : false;
    }

    /**
     * Get the destination link for this node.
     *
     * @return moodle_url
     */
    public function get_link(): moodle_url {
        return $this->link;
    }

    /**
     * Set (or add) a single attribute.
     *
     * @param string $name
     * @param string $value
     */
    public function set_attribute(string $name, string $value): void {
        $this->attribute[$name] = $value;
    }

    /**
     * Set (or add) a set of attributes.
     *
     * @param array $attributes In the form of [$name] => $value
     * @see set_attribute
     */
    public function set_attributes(array $attributes): void {
        foreach ($attributes as $name => $value) {
            $this->set_attribute($name, $value);
        }
    }

    /**
     * Unset the named attribute.
     *
     * @param string $name*
     */
    public function remove_attribute(string $name): void {
        unset($this->attributes[$name]);
    }

    /**
     * Get the list of attributes.
     *
     * @return array
     */
    public function get_attributes(): array {
        return $this->attributes;
    }

    /**
     * Set the detail of any icon associated with this node.
     *
     * @param string $identifier
     * @param string $component
     * @param string $label
     */
    public function set_icon(string $identifier, string $component, string $label): void {
        $this->iconidentifier = $identifier;
        $this->iconcomponent = $component;
        $this->iconlabel = $label;
    }

    /**
     * Clear any icon set on this node.
     */
    public function clear_icon(): void {
        $this->iconidentifier = null;
        $this->iconcomponent = null;
        $this->iconlabel = null;
    }

    /**
     * Whether an icon has been set for thistree node.
     *
     * @return bool
     */
    public function has_icon(): bool {
        return !empty($this->iconidentifier);
    }

    /**
     * Fetch the icon data if an icon has been set.
     *
     * @return null|stdClass
     */
    public function get_icon(): ?stdClass {
        if ($this->has_icon()) {
            return (object) [
                'identifier' => $this->iconidentifier,
                'component' => $this->iconcomponent,
                'label' => $this->iconlabel,
            ];
        }

        return null;
    }

    /**
     * Set the parent of this tree node.
     *
     * @param tree $parent
     */
    public function set_parent(tree $parent): void {
        if ($parent === $this->childtree) {
            throw new coding_exception("Unable to add parent as this parent is also a child of this tree");
        }
        $this->parent = $parent;
    }

    /**
     * Set a child tree to the content of this node.
     *
     * @param tree $tree
     */
    public function set_child_tree(tree $childtree): void {
        if ($childtree === $this->parent) {
            throw new coding_exception("Unable to add child as this child is also the parent");
        }

        $childtree->set_parent($this);
        $this->childtree = $childtree;
    }

    /**
     * Get the parent tree.
     *
     * @return tree
     */
    public function get_parent(): ?tree {
        return $this->parent;
    }

    /**
     * Get the child tree.
     *
     * @return tree
     */
    public function get_child_tree(): ?tree {
        return $this->tree;
    }

    /**
     * Get the tree node before the current node in the tree.
     *
     * @return null|tree_node
     */
    public function get_previous_sibling(): ?tree_node {
        return $this->parent->get_previous_sibling($this);
    }

    /**
     * Get the tree node after the current node in the tree.
     *
     * @return null|tree_node
     */
    public function get_next_sibling(): ?tree_node {
        return $this->parent->get_next_sibling($this);
    }
}
