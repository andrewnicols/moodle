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

namespace core\dml;

/**
 * Iterator that walks through a moodle_recordset applying the provided function.
 *
 * The internal recordset can be closed using the close() function.
 *
 * Note that consumers of this class are responsible of closing the recordset,
 * although there are some implicit closes under some ciscumstances:
 * - Once all recordset records have been iterated
 * - The object is destroyed
 *
 * @since      Moodle 2.9
 * @package    core
 * @category   dml
 * @copyright  2015 David Monllao
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class recordset_walk implements \Iterator {
    /** @var \Closure The callback */
    protected readonly \Closure $callback;

    /**
     * Create a new iterator applying the callback to each record.
     *
     * @param recordset $recordset Recordset to iterate.
     * @param callable $callback Apply this function to each record. If using a method, it should be public.
     * @param mixed $callbackextra An extra single parameter to pass to the callback. Use a container to pass multiple values.
     */
    public function __construct(
        /** @var recordset The recordset */
        protected readonly recordset $recordset,
        callable $callback,
        /** @var mixed|null Extra param for the callback */
        protected mixed $callbackextra = null,
    ) {
        $this->callback = \Closure::fromCallable($callback);
    }

    /**
     * Closes the recordset.
     */
    public function __destruct() {
        $this->close();
    }

    /**
     * Returns the current element after applying the callback.
     *
     * @return mixed|bool The returned value type will depend on the callback.
     */
    #[\ReturnTypeWillChange]
    #[\Override]
    public function current(): mixed {
        if (!$this->recordset->valid()) {
            return false;
        }

        if (!$record = $this->recordset->current()) {
            return false; // @codeCoverageIgnore
        }

        // Apply callback and return.
        if ($this->callbackextra !== null) {
            // If we have an extra parameter, pass it to the callback.
            return call_user_func($this->callback, $record, $this->callbackextra);
        }
        return call_user_func($this->callback, $record);
    }

    #[\Override]
    public function next(): void {
        $this->recordset->next();
    }

    #[\ReturnTypeWillChange]
    #[\Override]
    public function key(): mixed {
        return $this->recordset->key();
    }

    /**
     * Returns whether the current position is valid or not.
     *
     * If we reached the end of the recordset we close as we
     * don't allow rewinds. Doing do so we reduce the chance
     * of unclosed recordsets.
     *
     * @return bool
     */
    #[\Override]
    public function valid(): bool {
        if (!$valid = $this->recordset->valid()) {
            $this->close();
        }
        return $valid;
    }

    /**
     * Rewind is not supported.
     */
    #[\Override]
    public function rewind(): void {
        // No rewind as it is not implemented in moodle_recordset.
        return;
    }

    /**
     * Closes the recordset.
     */
    public function close(): void {
        $this->recordset->close();
    }
}
