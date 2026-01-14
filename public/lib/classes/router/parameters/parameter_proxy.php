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

namespace core\router\parameters;

/**
 * A proxy object which can be used to lazilly resolve properties from a single source.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class parameter_proxy implements \ArrayAccess {
    /** @var \Closure|null */
    private ?\Closure $hydrator;

    /** @var object|array|null The hydrated object. */
    private mixed $hydrated = null;

    /** @var bool Whether the object has been hydrated. */
    private bool $isfullyhydrated = false;

    /**
     * Create a new proxy instance.
     *
     * @param \Closure $hydrator
     */
    public function __construct(\Closure $hydrator) {
        $this->hydrator = $hydrator;
    }

    /**
     * Ensure that the object is hydrated.
     */
    private function ensure_hydrated(): void {
        if ($this->isfullyhydrated) {
            return;
        }
        if (isset($this->hydrator)) {
            $this->hydrated = ($this->hydrator)();
            $this->hydrator = null;
            $this->isfullyhydrated = true;
        }
    }

    /**
     * Get a property from the proxied object.
     *
     * @param string $name
     * @return mixed
     */
    public function __get(string $name): mixed {
        $this->ensure_hydrated();
        if (is_object($this->hydrated)) {
            return $this->hydrated->$name ?? null;
        }
        if (is_array($this->hydrated)) {
            return $this->hydrated[$name] ?? null;
        }
        return null;
    }

    /**
     * Check if a property is set on the proxied object.
     *
     * @param string $name
     * @return bool
     */
    public function __isset(string $name): bool {
        $this->ensure_hydrated();
        if (is_object($this->hydrated)) {
            return isset($this->hydrated->$name);
        }
        if (is_array($this->hydrated)) {
            return isset($this->hydrated[$name]);
        }
        return false;
    }

    /**
     * Call a method on the proxied object.
     *
     * @param string $name
     * @param array $arguments
     * @return mixed
     */
    public function __call(string $name, array $arguments): mixed {
        $this->ensure_hydrated();
        if (is_object($this->hydrated)) {
            return call_user_func_array([$this->hydrated, $name], $arguments);
        }
        // Cannot call methods on an array.
        throw new \BadMethodCallException("Cannot call method '{$name}' on a proxied array.");
    }

    /**
     * Whether an offset exists.
     *
     * @param mixed $offset
     * @return bool
     */
    public function offsetExists(mixed $offset): bool {
        $this->ensure_hydrated();
        return isset($this->hydrated[$offset]);
    }

    /**
     * Get an offset.
     *
     * @param mixed $offset
     * @return mixed
     */
    public function offsetGet(mixed $offset): mixed {
        $this->ensure_hydrated();
        return $this->hydrated[$offset] ?? null;
    }

    /**
     * Set an offset.
     *
     * @param mixed $offset
     * @param mixed $value
     * @return void
     */
    public function offsetSet(mixed $offset, mixed $value): void {
        $this->ensure_hydrated();
        if (is_null($offset)) {
            $this->hydrated[] = $value;
        } else {
            $this->hydrated[$offset] = $value;
        }
    }

    /**
     * Unset an offset.
     *
     * @param mixed $offset
     * @return void
     */
    public function offsetUnset(mixed $offset): void {
        $this->ensure_hydrated();
        unset($this->hydrated[$offset]);
    }

    public function prepare(string $name): lazy_parameter {
        return new lazy_parameter(fn () => $this->$name);
    }
}
