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

use Countable;
use Generator;
use coding_exception;
use renderable;
use renderer_base;
use templatable;

/**
 * A generic tree structure supporting collapsing, lazy loading, and more.
 *
 * TODO: Support lazy loading.
 *
 * @package   core
 * @copyright 2021 Andrew Lyons <andrew@nicols.co.uk>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class tree implements
    Countable,
    renderable,
    templatable
{
    /** @var tree_node The parent tree node if one is set */
    protected $parent;

    /** @var bool Whether this tree structure is collapsible */
    protected $collapsible = true;

    /** @var bool Whether this tree is initially collapsed */
    protected $iscollapsed = false;

    /** @var tree_node[] The ordered nodes in this tree */
    protected $nodes = [];

    /** @var tree_node[] A mapping of identifier to tree_node elements */
    protected $nodemap = [];

    protected $iteratorposition = 0;

    public function __construct() {
        $this->iteratorposition = 0;
        $this->identifier = uniqid();
    }

    /**
     * The number of nodes in the this tree.
     */
    public function count(): int {
        return count($nodes);
    }

    /**
     * Function to export the renderer data in a format that is suitable for a
     * mustache template. This means:
     * 1. No complex types - only stdClass, array, int, string, float, bool
     * 2. Any additional info that is required for the template is pre-calculated (e.g. capability checks).
     *
     * @param renderer_base $output Used to do a final render of any components that need to be rendered for export.
     * @return stdClass
     */
    public function export_for_template(renderer_base $output) {
        return (object) [
            'identifier' => "tree_root_{$this->identifier}",
            'is_collapsible' => $this->is_collapsible(),
            'is_initially_collapsed' => $this->is_collapsed(),
            'nodes' => $this->export_nodes_for_template($output),
            'hasparent' => $this->has_parent(),
        ];
    }

    /**
     * Export a single tree node for template.
     *
     * @param renderer_base $output Used to do a final render of any components that need to be rendered for export.
     * @return stdClass
     */
    protected function export_nodes_for_template(renderer_base $output): array {
        $nodedata = [];
        foreach($this->nodes as $node) {
            $nodedata[] = $node->export_for_template($output);
        }

        return $nodedata;
    }

    /**
     * Set the parent tree_node for this tree.
     *
     * @param tree_node $parent
     */
    public function set_parent(tree_node $parent): void {
        $this->parent = $parent;
    }

    /**
     * Whether this tree has a known parent associated with it
     *
     * @return bool
     */
    public function has_parent(): bool {
        return $this->parent !== null;
    }

    /**
     * Get the parent tree_node if one is set.
     *
     * @return tree_node
     */
    public function get_parent(): ?tree_node {
        return $this->parent;
    }

    /**
     * Set the collapsible state of this tree.
     *
     * @param bool
     */
    public function set_collapsible(bool $collapsible = true): void {
        $this->collapsible = $collapsible;
    }

    /**
     * Get the collapsible state of this tree.
     *
     * @return bool
     */
    public function is_collapsible(): bool {
        return $this->collapsible;
    }

    /**
     * Set the initial collapsed state of this tree.
     *
     * @param bool $collapsed
     */
    public function set_collapsed(bool $collapsed = true): void {
        $this->iscollapsed = $collapsed;
    }

    /**
     * Whether this tree is initially collapsed.
     *
     * @return bool
     */
    public function is_collapsed(): bool {
        return $this->iscollapsed;
    }

    /**
     * Add a new node tot his tree at the specified point in the list.
     *
     * @param tree_node $newnode
     * @param int|null $index
     */
    protected function add_node_at_index(tree_node $newnode, ?int $index): void {
        $identifier = $newnode->get_identifier();
        if (array_key_exists($identifier, $this->nodemap)) {
            throw new coding_exception("The {$identifier} node has already been added to the tree");
        }

        $newnode->set_parent($this);
        $this->nodemap[$identifier] = $newnode;

        if ($index === -1) {
            array_unshift($this->nodes, $newnode);
        } else if ($index === null) {
            $this->nodes[] = $newnode;
        } else {
            array_splice($this->nodes, $index, 0, [$newnode]);
        }

    }

    /**
     * Add a new node to this tree at the end of the list.
     *
     * @param tree_node $newnode
     */
    public function add_node(tree_node $newnode): void {
        $this->add_node_at_index($newnode, null);
    }

    /**
     * Add a new node to this tree before the specified point.
     *
     * @param tree_node $newnode
     * @param string $beforenodekey
     */
    public function insert_node_before(treenode $newnode, string $beforenodekey): void {
        if (!array_key_exists($beforenodekey, $this->nodemap)) {
            throw new coding_exception("Unable to find the specified node '{$beforenodekey}'");
        }

        $beforenode = $this->nodemap[$beforenodekey];
        $beforeindex = array_search($beforenode, $this->nodes);
        $this->add_node_at_index($newnode, $beforeindex);
    }

    /**
     * Add a new node to this tree after the specified point.
     *
     * @param tree_node $newnode
     * @param string $afternodekey
     */
    public function insert_node_after(treenode $newnode, string $afternodekey): void {
        if (!array_key_exists($afternodekey, $this->nodemap)) {
            throw new coding_exception("Unable to find the specified node '{$afternodekey}'");
        }

        $afternode = $this->nodemap[$afternodekey];
        $afterindex = array_search($afternode, $this->nodes);
        $this->add_node_at_index($newnode, $afterindex + 1);
    }

    /**
     * Get the previous sibling of the specified node.
     *
     * @param tree_node $node
     * @return tree_node|null
     */
    public function get_previous_element(tree_node $node): ?tree_node {
        $identifier = $node->get_identifier();
        if (!array_key_exists($identifier, $this->nodemap)) {
            throw new coding_exception("Unable to find a node with identifier '{$identifier}'");
        }

        $node = $this->nodemap[$identifier];
        $index = array_search($node, $this->nodes);

        if ($index === 0) {
            // This was the first element and there is nothing before it.
            return null;
        }

        return $this->nodes[$index - 1];
    }

    /**
     * Get the next sibling of the specified node.
     *
     * @param tree_node $node
     * @return tree_node|null
     */
    public function get_next_element(tree_node $node): ?tree_node {
        $identifier = $node->get_identifier();
        if (!array_key_exists($identifier, $this->nodemap)) {
            throw new coding_exception("Unable to find a node with identifier '{$identifier}'");
        }

        $node = $this->nodemap[$identifier];
        $index = array_search($node, $this->nodes);

        if ($index === (count($this->nodes) - 1)) {
            // This was the last element and there is nothing after it.
            return null;
        }

        return $this->nodes[$index + 1];
    }
}
