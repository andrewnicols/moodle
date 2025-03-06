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

namespace core\output;

use core_cache\cache;

/**
 * Mustache Cache for Moodle.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class mustache_cache extends \Mustache_Cache_AbstractCache {
    /** @var cache A reference to the cache instance used by Mustache */
    private ?cache $cache = null;

    #[\Override]
    public function load($key) {
        $cache = $this->get_cache();
        $cachekey = $this->get_cache_key($key);

        $template = $cache->get($cachekey);

        if ($template === false) {
            return false;
        }

        $this->run_template($template);
        return true;
    }

    #[\Override]
    public function cache($key, $value): void {
        $cache = $this->get_cache();
        $cachekey = $this->get_cache_key($key);

        $this->log(
            \Mustache_Logger::DEBUG,
            'Writing template to cache with key: "{cachekey}"',
            ['cachekey' => $cachekey],
        );

        $cache->set($cachekey, $value);

        $this->run_template($value);
    }

    /**
     * Build the cache filename.
     * Subclasses should override for custom cache directory structures.
     *
     * @param string $name
     *
     * @return string
     */
    protected function get_cache_key(string $name): string {
        return $name;
    }

    /**
     * Get the MUC Cache Implementation.
     *
     * @return \core_cache\cache
     */
    private function get_cache(): cache {
        if ($this->cache === null) {
            $this->cache = cache::make('core', 'mustache');
        }
        return $this->cache;
    }

    /**
     * Source the template to load the template class.
     *
     * @param string $template
     */
    private function run_template(string $template): void {
        // Yes, this is evil. But realistically it is no more evil than writing the same content to the filesystem and loading it.
        eval('?>' . $template); // phpcs:ignore moodle.PHP.ForbiddenTokens.Found
    }
}
