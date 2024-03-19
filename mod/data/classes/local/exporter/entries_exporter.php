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

namespace mod_data\local\exporter;

use core_files\archive_writer;
use core_files\local\archive_writer\zip_writer;

/**
 * Exporter class for exporting data and - if needed - files as well in a zip archive.
 *
 * @package    mod_data
 * @copyright  2023 ISB Bayern
 * @author     Philipp Memmel
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
abstract class entries_exporter {
    /** @var int Tracks the currently edited row of the export data file. */
    private int $currentrow = 0;

    /**
     * @var array The data structure containing the data for exporting. It's a 2-dimensional array of
     *  rows and columns.
     */
    protected array $exportdata = [];

    /** @var string Name of the export file name without extension. */
    protected string $exportfilename;

    /** @var array Array to store all filenames in the zip archive for export. */
    private array $filenamesinzip = [];

    /** @var archive_writer The zip writer used to send files */
    private readonly archive_writer $zipwriter;

    /**
     * Creates an entries_exporter object.
     *
     * This object can be used to export data to different formats including files. If files are added,
     * everything will be bundled up in a zip archive.
     */
    public function __construct(
        /** @ var bool Whether to stream this file to the user */
        public readonly bool $streamtouser = true,
    ) {
        if ($streamtouser) {
            $this->zipwriter = archive_writer::get_stream_writer('export.zip', archive_writer::ZIP_WRITER);
        } else {
            $this->zipwriter = archive_writer::get_file_writer('export.zip', archive_writer::ZIP_WRITER);
        }
    }

    /**
     * Sets the export file name without extension.
     *
     * @param string $exportfilename the name of the data file within the export
     */
    public function set_export_filename(string $exportfilename): void {
        $this->exportfilename = $exportfilename;
    }

    /**
     * Returns the export file name including the file extension.
     *
     * @return string
     */
    public function get_export_filename(): string {
        return $this->exportfilename . '.' . $this->get_export_data_file_extension();
    }

    /**
     * Adds a row (array of strings) to the export data.
     *
     * @param array $row the row to add, $row has to be a plain array of strings
     * @return void
     */
    public function add_row(array $row): void {
        $this->exportdata[] = $row;
        $this->currentrow++;
    }

    /**
     * Adds a data string (so the content for a "cell") to the current row.
     *
     * @param string $cellcontent the content to add to the current row
     * @return void
     */
    public function add_to_current_row(string $cellcontent): void {
        $this->exportdata[$this->currentrow][] = $cellcontent;
    }

    /**
     * Signal the entries_exporter to finish the current row and jump to the next row.
     *
     * @return void
     */
    public function next_row(): void {
        $this->currentrow++;
    }

    /**
     * The entries_exporter will prepare a data file from the rows and columns being added.
     * Overwrite this method to generate the data file as string.
     *
     * @return string the data file as a string
     */
    abstract protected function get_data_file_content(): string;

    /**
     * Overwrite the method to return the file extension your data file will have, for example
     * <code>return 'csv';</code> for a csv file entries_exporter.
     *
     * @return string the file extension of the data file your entries_exporter is using
     */
    abstract protected function get_export_data_file_extension(): string;

    /**
     * Returns the count of currently stored records (rows excluding header row).
     *
     * @return int the count of records/rows
     */
    public function get_records_count(): int {
        // The attribute $this->exportdata also contains a header. If only one row is present, this
        // usually is the header, so record count should be 0.
        if (count($this->exportdata) <= 1) {
            return 0;
        }
        return count($this->exportdata) - 1;
    }

    /**
     * Standardise the filename, removing any duplicate slashes.
     *
     * @param string $directory The directory path within the zip file
     * @param string $filename The file name
     * @return string The standardised filename
     */
    protected function standardise_filename(
        string $directory,
        string $filename,
    ): string {
        return implode('/', array_filter([
            ...explode('/', $directory),
            $filename,
        ]));
    }

    /**
     * Use this method to add a file which should be exported to the entries_exporter.
     *
     * @param string $filename the name of the file which should be added
     * @param string $filecontent the content of the file as a string
     * @param string $zipsubdir the subdirectory in the zip archive. Defaults to 'files/'.
     */
    public function add_file_from_string(string $filename, string $filecontent, string $zipsubdir = 'files/'): void {
        $zipfilename = $this->standardise_filename($zipsubdir, $filename);
        $this->filenamesinzip[] = $zipfilename;

        $this->zipwriter->add_file_from_string($zipfilename, $filecontent);
    }

    /**
     * Sends the generated export file.
     */
    public function finalise_file(): void {
        $this->add_file_from_string(
            filename: $this->get_export_filename(),
            filecontent: $this->get_data_file_content(),
            zipsubdir: '/',
        );
        $this->zipwriter->finish();
    }

    /**
     * Returns the path to the zip file.
     *
     * @return string The path on disk
     */
    public function get_path_to_zip(): string {
        if ($this->streamtouser) {
            throw new \coding_exception('This method can only be called if the file is not being streamed');
        }

        return $this->zipwriter->get_path_to_zip();
    }

    /**
     * Checks if a file with the given name has already been added to the file export bundle.
     *
     * Care: Filenames are compared to all files in the specified zip subdirectory which
     *  defaults to 'files/'.
     *
     * @param string $filename the filename containing the zip path of the file to check
     * @param string $zipsubdir The subdirectory in which the filename should be looked for,
     *  defaults to 'files/'
     * @return bool true if file with the given name already exists, false otherwise
     */
    public function file_exists(string $filename, string $zipsubdir = 'files/'): bool {
        if (empty($filename)) {
            return false;
        }

        $filepath = $this->standardise_filename($zipsubdir, $filename);
        return in_array(
            needle: $filepath,
            haystack: $this->filenamesinzip,
            strict: true,
        );
    }

    /**
     * Creates a unique filename based on the given filename.
     *
     * This method adds "_1", "_2", ... to the given file name until the newly generated filename
     * is not equal to any of the already saved ones in the export file bundle.
     *
     * @param string $newfilename the filename based on which a unique filename should be generated
     * @return string the unique filename
     */
    public function create_unique_filename(string $filename): string {
        if (!$this->file_exists($filename)) {
            return $filename;
        }

        $path = pathinfo($filename, PATHINFO_DIRNAME);
        if ($path === '.') {
            $path = '';
        }
        $originalbasename = pathinfo($filename, PATHINFO_FILENAME);
        $extension = pathinfo($filename, PATHINFO_EXTENSION);
        if (!empty($extension)) {
            $extension = ".{$extension}";
        }

        $i = 1;
        do {
            $newfilename = "{$path}{$originalbasename}_{$i}{$extension}";
            $i++;
        } while ($this->file_exists($newfilename));

        return $newfilename;
    }
}
