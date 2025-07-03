<?php

define('CLI_SCRIPT', true);
require(__DIR__ . '/config.php');

$filename = $argv[1] ?? null;

(new class($filename) {
    private string $newfilename;
    private string $component;

    public function __construct(
        private string $filename,
    ) {
        global $CFG;

        if ($filename === null) {
            echo "No filename provided.\n";
            exit(1);
        }
        
        if (!file_exists($filename) && file_exists(__DIR__ . "/{$filename}")) {
            $filename = __DIR__ . "/{$filename}";
        }
        
        if (!file_exists($filename)) {
            echo "File does not exist: {$filename}\n";
            exit(1);
        }

        // Normalise the filename.
        $filename = substr(
            str_replace(realpath($CFG->dirroot), '', realpath($filename)),
            1,
        );

        $this->component = basename($filename, ".php");
        $this->component = \core\component::normalize_componentname($this->component);

        $dirname = dirname($filename);
        $this->newfilename = "{$dirname}/{$this->component}.json";

        if (file_exists($this->newfilename)) {
            throw new \UnexpectedValueException(
                "File already exists: {$this->newfilename}.",
            );
        }
    }

    public function process(): void {
        $strings = $this->fetch_strings();

        file_put_contents(
            $this->newfilename,
            json_encode(
                [
                    'strings' => $strings,
                    'deprecatedkeys' => $this->get_deprecated_strings(),
                ],
                JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE,
            ) . "\n",
        );
        $this->write_backwards_compatibility_file();
    }

    public function fetch_strings(): array {
        $string = [];
        require(__DIR__ . "/{$this->filename}");
        if ($string === null) {
            error_log("No strings found in {$this->filename}.");
            return [];
        }

        ksort($string);

        return $string;
    }

    public function get_deprecated_strings(): array {
        $deprecatedstringspath = dirname($this->filename) . '/deprecated.txt';
        if (file_exists($deprecatedstringspath)) {
            $deprecatedstringlist = trim(file_get_contents($deprecatedstringspath));
            $matchfunction = function (string $line): bool {
                if ($this->component === 'core' || $this->component === 'moodle') {
                    // For core or moodle, we match all lines that end with either ",moodle" or ",core".
                    // This is to ensure we capture all deprecated strings for the core component.
                    return str_ends_with($line, ",moodle") || str_ends_with($line, ",core");
                }

                // Check if the line ends with ",component" to match the deprecated string format.
                return str_ends_with($line, ",{$this->component}");
            };

            $deprecatedstrings = array_values(
                array_map(
                    fn($line) => trim(explode(',', $line)[0]),
                    array_filter(
                        explode("\n", $deprecatedstringlist),
                        $matchfunction,
                    ),
                ),
            );

            $stringdata = file_get_contents($this->filename);
            $stringdata = array_reverse(explode("\n", $stringdata), true);

            // Find deprecation comments.
            $strings = [];
            $deprecationversions = [];
            foreach ($stringdata as $line) {
                // Skip empty lines.
                if (trim($line) === '') {
                    continue;
                }

                if (preg_match('/^\$string\[\'(?<stringname>[^\']+)\'\].*/', $line, $matches)) {
                    $strings[] = $matches['stringname'];
                    continue;
                }

                if (preg_match('@// Deprecated since (Moodle )?(?<version>\d+\.\d+)@', $line, $matches)) {
                    // This line contains a deprecation comment.
                    $version = $matches['version'];
                    foreach ($strings as $string) {
                        $deprecationversions[$string] = (float) $version;
                    }

                    $strings = [];
                }
            }

            // Calculate when they were deprecated.
            $finaldeprecatedstrings = [];
            foreach ($deprecatedstrings as $string) {
                if (array_key_exists($string, $deprecationversions)) {
                    // If we have a deprecation version for this string, use it.
                    $version = $deprecationversions[$string];
                } else {
                    // Otherwise, we assume it was deprecated in the current version.
                    error_log(
                        "No deprecation version found for string '{$string}' in {$this->filename}. Assuming it was deprecated in the current version.",
                    );
                    $version = 5.1;
                }
                $finaldeprecatedstrings[$string] = $version;
            }

            return $finaldeprecatedstrings;
        }

        return [];
    }

    public function write_backwards_compatibility_file(): void {
        $bcfile = <<<EOF
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
         * Backwards compatibility helper for the lang file migration.
         *
         * @package   {$this->component}
         * @copyright Andrew Lyons <andrew@nicols.co.uk>
         * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
         */
        \$stringvalues = json_decode(file_get_contents(__DIR__ . "/{$this->component}.json"), true, 512, JSON_THROW_ON_ERROR);
        \$string = \$stringvalues['strings'] ?? [];

        EOF;
        unlink($this->filename);
        file_put_contents($this->filename, $bcfile);
    }
})->process();
