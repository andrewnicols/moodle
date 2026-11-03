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

namespace core\model;

use core\exception\coding_exception;
use core\model;
use core\model\attribute\table;
use moodle_database;

/**
 * Database operations for declared-property models.
 *
 * Share a manager between models rather than storing a manager on each instance.
 * This module handles mapping, validation and audit fields, not application access
 * control, relationships, identity maps or persistent's legacy lifecycle hooks.
 *
 * @package    core
 * @copyright  2026 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class manager {
    /** @var array Cached table names per model class. */
    private static array $tables = [];

    /**
     * Create a manager with an explicit database dependency.
     *
     * @param moodle_database $db Database connection.
     */
    public function __construct(
        /** @var moodle_database Database connection. */
        protected readonly moodle_database $db,
    ) {
    }

    /**
     * Check the mapped class and table name.
     *
     * @param class-string<model> $class Model class.
     * @return string Database table.
     */
    private function table(string $class): string {
        if (isset(self::$tables[$class])) {
            return self::$tables[$class];
        }
        if (!is_subclass_of($class, model::class)) {
            throw new coding_exception('A model manager requires a model subclass.');
        }
        $attributes = (new \ReflectionClass($class))->getAttributes(table::class);
        if (!$attributes) {
            throw new coding_exception('A model manager requires a table attribute on the concrete model class.');
        }
        return self::$tables[$class] = $attributes[0]->newInstance()->name;
    }

    /**
     * Load a model. Constructors must accept no required arguments.
     *
     * @param class-string<model> $class Model class.
     * @param int $id Record ID.
     * @return model Hydrated model.
     */
    public function get(string $class, int $id): model {
        $record = $this->db->get_record($this->table($class), ['id' => $id], '*', MUST_EXIST);
        return (new $class())->from_record($record);
    }

    /**
     * Prepare domain-specific values before checking current model data.
     *
     * @param model $model Model to validate.
     * @return true|array Validation result.
     */
    public function validate(model $model): true|array {
        $this->prepare_validation($model);
        return $model->validate();
    }

    /**
     * Extend the manager for lifecycle rules requiring database access.
     *
     * @param model $model Model being validated.
     */
    protected function prepare_validation(model $model): void {
    }

    /**
     * Insert or update a valid model, maintaining explicitly mapped audit fields.
     *
     * Validation is never cached, including after public property writes. The caller
     * supplies the acting user explicitly; the model has no hidden session dependency.
     *
     * @param model $model Model to save.
     * @param int $userid Acting user ID.
     */
    public function save(model $model, int $userid): void {
        $table = $this->table($model::class);
        $valid = $this->validate($model);
        if ($valid !== true) {
            throw new \invalid_parameter_exception('Invalid model fields: ' . implode(', ', array_keys($valid)));
        }
        $mapped = $model->to_record();
        $id = $mapped->id;
        if ($id < 0 || $userid < 0) {
            throw new \invalid_parameter_exception('Model and acting user IDs must not be negative.');
        }
        $now = time();
        foreach (['timemodified' => $now, 'usermodified' => $userid] as $name => $value) {
            if (property_exists($mapped, $name)) {
                $model->set($name, $value);
            }
        }
        if (!$id) {
            if (property_exists($mapped, 'timecreated')) {
                $model->set('timecreated', $now);
            }
            $record = $model->to_record();
            unset($record->id);
            $model->set('id', $this->db->insert_record($table, $record));
        } else {
            $this->db->update_record($table, $model->to_record());
        }
    }

    /**
     * Delete an existing record and clear its in-memory ID on success.
     *
     * @param model $model Model to delete.
     * @return bool Whether deletion succeeded.
     */
    public function delete(model $model): bool {
        $table = $this->table($model::class);
        $id = $model->to_record()->id;
        if (!is_int($id) || $id <= 0) {
            throw new coding_exception('An existing model ID is required for deletion.');
        }
        $result = $this->db->delete_records($table, ['id' => $id]);
        if ($result) {
            $model->set('id', 0);
        }
        return $result;
    }
}
