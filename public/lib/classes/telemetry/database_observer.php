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

namespace core\telemetry;

use OpenTelemetry\API\Trace\SpanInterface;
use OpenTelemetry\API\Trace\SpanKind;
use OpenTelemetry\SemConv\TraceAttributes;
use Throwable;
use function OpenTelemetry\Instrumentation\hook;

/**
 * Database observer.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class database_observer extends abstract_observer {
    #[\Override]
    public function observe(): void {
        $this->hook_get_tables();

        $this->hook_generic_sql_with_tablename('get_record', [
            'db.operation.name' => 'EXECUTE',
        ]);
        $this->hook_method('get_session_lock');
        $this->hook_method('release_session_lock');
        $this->hook_method('begin_transaction');
        $this->hook_method('commit_transaction');
        $this->hook_method('rollback_transaction');
        $this->hook_generic_sql_with_tablename('fetch_columns');
        $this->hook_generic_sql_with_tablename('query_start', preclosure: function (SpanInterface $span, array $params): void {
            $this->add_backtrace($span, 2);
        });
        $this->hook_method('query_end');
        $this->hook_generic_insert_method('insert_chunk', batch: true);
        $this->hook_generic_insert_method('insert_record');
        $this->hook_generic_insert_method('insert_records');
        $this->hook_generic_insert_method('update_record_raw');
        $this->hook_generic_update_method('update_record');
        $this->hook_generic_update_method('update_record_raw');
        $this->hook_generic_update_method('set_field_select');
        $this->hook_generic_sql_with_params('execute');
        $this->hook_generic_sql_with_params('get_fieldset_sql');
        $this->hook_generic_sql_with_params('get_record_sql');
        $this->hook_generic_sql_with_params('get_records_sql');
        $this->hook_generic_sql_with_params('get_recordset_sql');
        $this->hook_delete_records_select();
    }

    private function generic_post(
        \moodle_database $database,
        array $params,
        mixed $result,
        ?Throwable $exception,
    ): mixed {
        [$span, $scope] = $this->pop_span_and_scope();

        $scope->detach();
        $span->end();
        return $result;
    }

    private function generic_pre(
        callable $callable,
        array $staticattributes = [],
    ): \Closure {
        return function (
            \moodle_database $database,
            array $params,
            string $class,
            string $function,
            ?string $filename,
            ?int $lineno,
        ) use (
            $callable,
            $staticattributes,
        ): void {
            $builder = $this->get_instrumentation()->tracer()
                ->spanBuilder(sprintf('db.%s', $function))
                ->setSpanKind(SpanKind::KIND_CLIENT)
                ->setAttribute(TraceAttributes::CODE_FUNCTION_NAME, sprintf('%s::%s', $class, $function))
                ->setAttribute(TraceAttributes::CODE_FILE_PATH, $filename)
                ->setAttribute(TraceAttributes::CODE_LINE_NUMBER, $lineno)
                ->setAttribute('db.action', $function)
                ->setAttributes($staticattributes);

            $span = $builder->startSpan();
            $this->push_span_and_scope($span);

            $callable($params, $span);
        };
    }

    private function hook_method(
        string $functionname,
        array $staticattributes = [],
    ): void {
        hook(
            \moodle_database::class,
            $functionname,
            pre: $this->generic_pre(
                function (array $params, SpanInterface $span) use ($staticattributes): void {
                    $span
                        ->setAttributes($staticattributes);

                },
            ),
            post: fn (...$args) => $this->generic_post(...$args),
        );
    }
    private function hook_generic_sql_with_params(
        string $functionname,
        array $staticattributes = [],
    ): void {
        hook(
            \moodle_database::class,
            $functionname,
            pre: $this->generic_pre(
                function (array $params, SpanInterface $span) use ($staticattributes): void {
                    if (count($params) === 1) {
                        [$sql] = $params;
                        $conditions = [];
                    } else {
                        [$sql, $conditions] = $params;
                    }

                    $span
                        ->setAttribute('db.query.text', $this->add_sql_debugging($sql))
                        ->setAttribute('db.conditions', json_encode($conditions))
                        ->setAttributes($staticattributes);

                },
            ),
            post: fn (...$args) => $this->generic_post(...$args),
        );
    }

    private function hook_generic_sql_with_tablename(
        string $functionname,
        array $staticattributes = [],
        ?\Closure $preclosure = null,
        ?\Closure $postclosure = null,
    ): void {
        hook(
            \moodle_database::class,
            $functionname,
            pre: $this->generic_pre(
                function (array $params, SpanInterface $span) use ($staticattributes, $preclosure): void {
                    if (count($params) === 1) {
                        [$table] = $params;
                        $conditions = [];
                    } else {
                        [$table, $conditions] = $params;
                    }

                    $span
                        ->setAttribute(TraceAttributes::DB_COLLECTION_NAME, $table)
                        ->setAttribute('db.conditions', json_encode($conditions))
                        ->setAttributes($staticattributes);

                    if ($preclosure) {
                        $preclosure($span, $params);
                    }
                },
            ),
            post: fn (...$args) => $this->generic_post(...$args),
        );
    }

    private function hook_generic_insert_method(
        string $functionname,
        array $staticattributes = [],
        bool $batch = false,
    ): void {
        hook(
            \moodle_database::class,
            $functionname,
            pre: $this->generic_pre(
                function (array $params, SpanInterface $span) use ($staticattributes, $batch): void {
                    [$table, $insertdata] = $params;

                    $span
                        ->setAttribute('db.operation.name', 'INSERT')
                        ->setAttribute(TraceAttributes::DB_COLLECTION_NAME, $table)
                        ->setAttributes($staticattributes);

                    if ($batch) {
                        $span->setAttribute('db.operation.batch.size', count($insertdata));
                    }
                },
            ),
            post: fn (...$args) => $this->generic_post(...$args),
        );
    }

    private function hook_generic_update_method(
        string $functionname,
        array $staticattributes = [],
    ): void {
        hook(
            \moodle_database::class,
            $functionname,
            pre: $this->generic_pre(
                function (array $params, SpanInterface $span) use ($staticattributes): void {
                    [$table, $insertdata] = $params;

                    $span
                        ->setAttribute('db.operation.name', 'UPDATE')
                        ->setAttribute(TraceAttributes::DB_COLLECTION_NAME, $table)
                        ->setAttributes($staticattributes);
                },
            ),
            post: fn (...$args) => $this->generic_post(...$args),
        );
    }

    private function hook_delete_records_select(): void {
        hook(
            \moodle_database::class,
            'delete_records_select',
            pre: $this->generic_pre(
                function (array $params, SpanInterface $span): void {
                    if (count($params) === 2) {
                        [$table, $select, $conditions] = $params;
                    } else {
                        [$table, $select] = $params;
                        $conditions = [];
                    }

                    $span
                        ->setAttribute(TraceAttributes::DB_COLLECTION_NAME, $table)
                        ->setAttribute('db.query.text', $select)
                        ->setAttribute('db.conditions', json_encode($conditions));

                },
            ),
            post: fn (...$args) => $this->generic_post(...$args),
        );
    }

    private function hook_get_tables(): void {
        hook(
            \moodle_database::class,
            'get_tables',
            pre: $this->generic_pre(
                function (array $params, SpanInterface $span): void {
                    $usecache = true;
                    if ($params) {
                        [$usecache] = $params;
                    }

                    $span
                        ->setAttribute('db.conditions', json_encode([
                            'usecache' => $usecache,
                        ]));
                },
            ),
            post: fn (...$args) => $this->generic_post(...$args),
        );
    }

    private function hook_cursors(): void {
        hook(
            \moodle_database::class,
            'fetch_from_cursor',
            pre: $this->generic_pre(
                function (array $params, SpanInterface $span): void {
                    [$cursorname] = $params;
                    $span
                        ->setAttribute('db.conditions', json_encode([
                            'cursorname' => $cursorname,
                        ]));

                },
            ),
            post: fn (...$args) => $this->generic_post(...$args),
        );
        hook(
            \moodle_database::class,
            'close_cursor',
            pre: $this->generic_pre(
                function (array $params, SpanInterface $span): void {
                    [$cursorname] = $params;
                    $span
                        ->setAttribute('db.conditions', json_encode([
                            'cursorname' => $cursorname,
                        ]));

                },
            ),
            post: fn (...$args) => $this->generic_post(...$args),
        );
    }

    private function add_sql_debugging(string $sql): string {
        global $CFG, $DB;

        if (property_exists($CFG, 'debugsqltrace') && $CFG->debugsqltrace > 0) {
            return $sql;
        }

        $rc = new \ReflectionMethod($DB, 'add_sql_debugging');
        return $rc->invoke($DB, $sql);
    }
}
