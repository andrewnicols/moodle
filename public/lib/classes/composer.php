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

namespace core;

use core\exception\moodle_exception;

/**
 * Composer helper class.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class composer {
    /** @var string The path to the composer installer */
    private readonly string $installerurl;

    /** @var string The path to the composer.phar file */
    private readonly string $composerpath;

    /** @var \Composer\Autoload\ClassLoader The Composer Autoloader */
    private $autoloader;

    /**
     * Constructor for the composer helper.
     *
     * Checks if the class can be used.
     *
     * @throws moodle_exception
     */
    public function __construct() {
        $this->installerurl = 'https://getcomposer.org/installer';
        $this->composerpath = dirname(__DIR__, 3) . '/composer.phar';
    }

    /**
     * Download and install Composer.
     *
     * This will download the Composer installer and run it to install
     * Composer in the Moodle root directory.
     *
     * Note: This does not install any dependencies, that is done
     * separately by install_dependencies().
     *
     * Note: The composer install is called using a call to the phpbinary.
     * If $CFG->phpbinary is not set, then this will fail.
     * This is due to a limitation of the composer installer which will
     * exit when the installation is complete.
     *
     * @return bool Whether the composer was installed (true if it was already present).
     */
    public function install_composer(): bool {
        $this->require_runnable();
        if ($this->is_composer_installed()) {
            return true;
        }

        $targetdir = make_request_directory();
        $composerinstallerpath = $targetdir . '/installer';

        $composerinstaller = file_get_contents($this->installerurl, false, stream_context_create([
            'ssl' => [
                'verify_peer' => true,
                'verify_peer_name' => true,
                'allow_self_signed' => false,
            ],
        ]));

        file_put_contents($composerinstallerpath, $composerinstaller);

        // Run the installer.
        $scriptpath = escapeshellarg($composerinstallerpath);

        $exitcode = $this->passthru_via_mtrace($scriptpath);

        if ($exitcode === 0) {
            return true;
        }

        return false;
    }

    /**
     * Require that composer is installed.
     *
     * @throws moodle_exception If composer is not installed.
     */
    public function require_composer_installed(): void {
        if (!$this->is_composer_installed()) {
            throw new moodle_exception('composernotinstalled', 'core');
        }
    }

    /**
     * Whether Composer dependnecies are installed.
     *
     * @return bool
     */
    public function are_dependencies_installed(): bool {
        return file_exists($this->get_installedfile_path());
    }

    /**
     * Require that composer dependencies are installed.
     *
     * @throws moodle_exception If composer dependencies are not installed.
     */
    public function require_dependencies_installed(): void {
        if (!$this->are_dependencies_installed()) {
            throw new moodle_exception('composerdependenciesnotinstalled', 'core');
        }
    }

    /**
     * Upgrade composer to the latest version.
     *
     * @return bool Whether the upgrade was successful.
     */
    public function upgrade_composer(): bool {
        $this->require_runnable();
        if (!$this->is_composer_installed()) {
            return false;
        }

        $pathcomponents = [
            'composer.phar',
            'self-update',
        ];
        $command = implode(' ', array_map('escapeshellarg', $pathcomponents));

        $exitcode = $this->passthru_via_mtrace($command, '');

        if ($exitcode === 0) {
            return true;
        }

        return false;
    }

    /**
     * Install the Composer dependencies.
     *
     * This will run 'composer install' in the Moodle root directory
     * to install all required dependencies.
     *
     * Note: The composer install is called using a call to the phpbinary.
     * If $CFG->phpbinary is not set, then this will fail.
     *
     * @return bool Whether the dependencies were installed
     * @throws moodle_exception If Composer is not installed
     */
    public function install_dependencies(): bool {
        global $CFG;

        $this->require_runnable();

        if (!$this->is_composer_installed()) {
            throw new moodle_exception('composernotinstalled', 'core');
        }

        $pathcomponents = [
            $CFG->root,
            'composer.phar',
        ];
        $pathargs = [
            'install',
            '--no-dev',
            '--classmap-authoritative',
        ];

        $scriptpath = escapeshellarg(implode(DIRECTORY_SEPARATOR, $pathcomponents));
        $scriptargs = implode(' ', array_map('escapeshellarg', $pathargs));

        // Install the dependencies.
        $exitcode = $this->passthru_via_mtrace($scriptpath, $scriptargs);

        if ($exitcode === 0) {
            return true;
        }

        return false;
    }

    /**
     * Check if the composer commands can be run.
     *
     * @return bool
     */
    public function is_runnable(): bool {
        return self::find_php_cli_path() !== null;
    }

    /**
     * Check if composer is installed.
     *
     * @return bool Whether composer is installed.
     */
    public function is_composer_installed(): bool {
        return file_exists($this->composerpath);
    }

    /**
     * Check whether development dependencies are installed.
     *
     * @return bool
     */
    public function are_dev_dependencies_installed(): bool {
        if (!$this->are_dependencies_installed()) {
            return false;
        }

        $installeddata = $this->get_installed_data();
        if (is_array($installeddata) && array_key_exists('root', $installeddata)) {
            return $installeddata['root']['dev'];
        }

        return false;
    }

    /**
     * Get the Composer Autoloader instance.
     *
     * @return \Composer\Autoload\ClassLoader
     */
    private function get_autoloader(): \Composer\Autoload\ClassLoader {
        if ($this->autoloader === null) {
            $this->autoloader = require($this->get_autoloader_path());
        }

        return $this->autoloader;
    }

    /**
     * Reset the Composer Autoloader.
     */
    private function reset_autoloader(): void {
        unset($this->autoloader);
    }

    /**
     * Require that the composer commands can be run.
     *
     * @throws moodle_exception
     * @return void
     */
    private function require_runnable(): void {
        if ($this->is_runnable() === false) {
            throw new moodle_exception('phpbinarynotfound', 'core');
        }
    }

    /**
     * Find the path to the PHP CLI binary.
     *
     * @return null|string Path to PHP binary, or false if not found.
     */
    private function find_php_cli_path(): ?string {
        global $CFG;

        if (!empty($CFG->pathtophp) && is_executable(trim($CFG->pathtophp))) {
            return trim($CFG->pathtophp);
        }

        return null;
    }

    /**
     * Run a command using passthru() and output via mtrace().
     *
     * @param string $scriptpath Path to the script to run.
     * @param string $scriptargs Arguments to pass to the script.
     * @return int Exit code of the command run.
     */
    private function passthru_via_mtrace(
        string $scriptpath,
        string $scriptargs = '',
    ): int {
        global $CFG;

        $descriptorspec = [
            0 => ['pipe', 'r'], // STDIN.
            1 => ['pipe', 'w'], // STDOUT.
            2 => ['pipe', 'w'], // STDERR.
        ];
        flush();

        $command = self::find_php_cli_path() . " {$scriptpath} {$scriptargs}";

        // Use the Moodle root as the COMPOSER_HOME.
        putenv('COMPOSER_HOME=' . $CFG->root);

        $process = proc_open($command, $descriptorspec, $pipes, $CFG->root);
        if (is_resource($process)) {
            mtrace("<pre>");
            $this->print_output($pipes[1]);
            $this->print_output($pipes[2]);
            mtrace("</pre>");
        }

        fclose($pipes[0]);
        fclose($pipes[1]);
        fclose($pipes[2]);
        return proc_close($process);
    }

    /**
     * Print the output from a pipe.
     *
     * @param mixed $pipe
     */
    private function print_output($pipe): void {
        while ($s = fgets($pipe)) {
            mtrace($s, '');
            flush();
        }
    }

    /**
     * Check whether the Composer installed packages match the composer.lock file.
     *
     * @return bool
     */
    public function is_up_to_date(): bool {
        $lockfilepath = $this->get_lockfile_path();;
        $installedfilepath = $this->get_installedfile_path();

        if (!file_exists($lockfilepath) || !file_exists($installedfilepath)) {
            // Either the lock file is absent, or the installed file is absent.
            // Definitely not up-to-date.
            return false;
        }

        $lockdata = json_decode(file_get_contents($lockfilepath), true);

        if (!isset($lockdata['packages'])) {
            // Handle malformed files.
            return false;
        }

        $lockpackages = [];
        foreach ($lockdata['packages'] as $package) {
            $lockpackages[$package['name']] = $package['version'];
        }

        // Check if all packages in lock file are present and match installed versions.
        foreach ($lockpackages as $name => $version) {
            if (!\Composer\InstalledVersions::isInstalled($name)) {
                // Not installed at all.
                return false;
            }

            if (\Composer\InstalledVersions::getVersion($name) !== $version) {
                // Wrong version.
                return false;
            }
        }

        // All packages match.
        return true;
    }

    /**
     * Get the path to the Composer lockfile.
     *
     * @return string
     */
    private function get_lockfile_path(): string {
        global $CFG;

        return "{$CFG->root}/composer.lock";
    }

    private function get_vendor_path(): string {
        global $CFG;

        return "{$CFG->root}/vendor";
    }

    private function get_composer_path(): string {
        return $this->get_vendor_path() . "/composer";
    }

    /**
     * Get the path to the Composer installed data in JSON format.
     *
     * @return string
     */
    private function get_installedfile_path(): string {
        return $this->get_composer_path() . "/installed.json";
    }

    private function get_autoloader_path(): string {
        return $this->get_vendor_path() . "/autoload.php";
    }

    private function get_installed_data(): array {
        return require($this->get_vendor_path() . "/composer/installed.php");
    }
}
