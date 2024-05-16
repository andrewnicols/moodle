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
 * DML transaction exception - triggered by problems related to DB transactions.
 *
 * @todo MDL-20625 Use the info from $transaction for debugging purposes.
 *
 * @package    core
 * @category   dml
 * @subpackage dml
 * @copyright  2008 Petr Skoda (http://skodak.org)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class dml_transaction_exception extends dml_exception {
    /** @var moodle_transaction An instance of a transaction.*/
    public $transaction;

    /**
     * Constructor.
     *
     * @param ?string $debuginfo Optional debugging information.
     * @param ?moodle_transaction $transaction The instance of the transaction.(Optional)
     */
    public function __construct($debuginfo = null, $transaction = null) {
        $this->transaction = $transaction; // TODO: MDL-20625 use the info from $transaction for debugging purposes.
        parent::__construct('dmltransactionexception', null, $debuginfo);
    }
}
