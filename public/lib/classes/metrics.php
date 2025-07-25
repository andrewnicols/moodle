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

/**
 * Class metrics
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class metrics {
    /** @var bool Whether theme designer mode is enabled */
    private bool $themedesignermode;
    private string $realtime;

    private ?string $method;

    private \stdClass $memory = (object) [
        'total' => null,
        'growth' => null,
        'peak' => null,
    ];

    private int $filesincluded = 0;

    private array $filterperformance = [];
    private array $stringperformance = [];
    private \stdClass $db = (object) [
        'queries' => 0,
        'reads' => 0,
        'writes' => 0,
        'replicareads' => 0,
        'querytime' => 0,
    ];

    private array $posix = [];

    private ?string $serverload = null;
    private ?float $sessionsize = null;
    private ?string $sessionwait = null;

    private \stdClass $cachesused = (object) [
        'hits' => 0,
        'misses' => 0,
        'sets' => 0,
    ];

    public function __construct() {
        global $CFG, $PERF, $DB, $PAGE;

        $this->themedesignermode = !empty($CFG->themedesignermode);

        $this->realtime = microtime_diff($PERF->starttime, microtime());

        // GET/POST (or NULL if $_SERVER['REQUEST_METHOD'] is undefined) is useful for txt logged information.
        $this->method = $_SERVER['REQUEST_METHOD'] ?? null;

        if (function_exists('memory_get_usage')) {
            $this->memory->total = memory_get_usage();
            $this->memory->growth = $this->memory->total - $PERF->startmemory;
        }

        if (function_exists('memory_get_peak_usage')) {
            $this->memory->peak = memory_get_peak_usage();
        }

        $this->filesincluded = count(get_included_files());

        if (!empty($CFG->early_install_lang) || empty($PAGE)) {
            // We can not track more performance before installation or before PAGE init, sorry.
            return;
        }

        $filtermanager = filter_manager::instance();
        if (method_exists($filtermanager, 'get_performance_summary')) {
            $this->filterperformance = $filtermanager->get_performance_summary();
        }

        $stringmanager = get_string_manager();
        if (method_exists($stringmanager, 'get_performance_summary')) {
            $this->stringperformance = $stringmanager->get_performance_summary();
        }

        $this->db->reads = $DB->perf_get_reads();
        $this->db->writes = $DB->perf_get_writes();
        $this->db->queries = $this->db->reads + $this->db->writes;

        if ($DB->want_read_replica()) {
            $this->db->replicareads = $DB->perf_get_reads_replica();
        }

        $this->db->querytime = round($DB->perf_get_queries_time(), 5);

        if (function_exists('posix_times')) {
            $ptimes = posix_times();
            if (is_array($ptimes)) {
                foreach ($ptimes as $key => $val) {
                    $this->posix[$key] = $ptimes[$key] - $PERF->startposixtimes[$key];
                }
            }
        }

        // Grab the load average for the last minute.
        // /proc will only work under some linux configurations
        // while uptime is there under MacOSX/Darwin and other unices.
        if (is_readable('/proc/loadavg') && $loadavg = @file('/proc/loadavg')) {
            [$serverload] = explode(' ', $loadavg[0]);
            unset($loadavg);
        } else if (function_exists('is_executable') && is_executable('/usr/bin/uptime') && $loadavg = `/usr/bin/uptime`) {
            if (preg_match('/load averages?: (\d+[\.,:]\d+)/', $loadavg, $matches)) {
                $serverload = $matches[1];
            } else {
                error_log('Could not parse uptime output!');
            }
        }

        if (!empty($serverload)) {
            $this->serverload = $serverload;
        }

        // Display size of session if session started.
        if ($si = \core\session\manager::get_performance_info()) {
            $this->sessionsize = $si['size'];
        }

        // Display time waiting for session if applicable.
        if (!empty($PERF->sessionlock['wait'])) {
            $this->sessionwait = number_format($PERF->sessionlock['wait'], 3) . ' secs';
        }

        if ($stats = cache_helper::get_stats()) {
            $hits = 0;
            $misses = 0;
            $sets = 0;

            ksort($stats);

            foreach ($stats as $details) {
                foreach ($details['stores'] as $data) {
                    $hits   += $data['hits'];
                    $misses += $data['misses'];
                    $sets   += $data['sets'];
                }
            }

            $this->cachesused->hits = $hits;
            $this->cachesused->misses = $misses;
            $this->cachesused->sets = $sets;
        }
    }

    public function format_for_html(self $info): string {
        if ($this->themedesignermode) {
            $metrics = <<<EOF
                <p><strong>Warning: Theme designer mode is enabled.</strong></p>
            EOF;
        }

        $metrics .= <<<EOF
            <ul class="list-unstyled row mx-md-0">
                <li class="timeused col-sm-4">{$this->realtime} secs</li>
        EOF;

        // GET/POST (or NULL if $_SERVER['REQUEST_METHOD'] is undefined) is useful for txt logged information.
        if ($this->memory->total !== null) {
            $metrics .= '<li class="memoryused col-sm-4">RAM: ' . display_size($this->memory->total) . '</li>';
        }

        if ($this->memory->peak !== null) {
            $metrics .= '<li class="memoryused col-sm-4">RAM peak: ' . display_size($this->memory->peak) . '</li>';
        }

        $metrics .= '</ul><ul class="list-unstyled row mx-md-0">';
        $metrics .= '<li class="included col-sm-4">Included ' . $this->filesincluded . ' files</li> ';

        if (!empty($CFG->early_install_lang) || empty($PAGE)) {
            // We can not track more performance before installation or before PAGE init, sorry.
            return $metrics;
        }

        $info['html'] .= "<li class='$key col-sm-4'>$nicenames[$key]: $value </li> ";

        $filtermanager = filter_manager::instance();
        if (method_exists($filtermanager, 'get_performance_summary')) {
            list($filterinfo, $nicenames) = $filtermanager->get_performance_summary();
            $info = array_merge($filterinfo, $info);
            foreach ($filterinfo as $key => $value) {
                $info['html'] .= "<li class='$key col-sm-4'>$nicenames[$key]: $value </li> ";
                $info['txt'] .= "$key: $value ";
            }
        }

        $stringmanager = get_string_manager();
        if (method_exists($stringmanager, 'get_performance_summary')) {
            list($filterinfo, $nicenames) = $stringmanager->get_performance_summary();
            $info = array_merge($filterinfo, $info);
            foreach ($filterinfo as $key => $value) {
                $info['html'] .= "<li class='$key col-sm-4'>$nicenames[$key]: $value </li> ";
                $info['txt'] .= "$key: $value ";
            }
        }

        $info['dbqueries'] = $DB->perf_get_reads().'/'.$DB->perf_get_writes();
        $info['html'] .= '<li class="dbqueries col-sm-4">DB reads/writes: '.$info['dbqueries'].'</li> ';
        $info['txt'] .= 'db reads/writes: '.$info['dbqueries'].' ';

        if ($DB->want_read_replica()) {
            $info['dbreads_replica'] = $DB->perf_get_reads_replica();
            $info['html'] .= '<li class="dbqueries col-sm-4">DB reads from replica: '.$info['dbreads_replica'].'</li> ';
            $info['txt'] .= 'db reads from replica: '.$info['dbreads_replica'].' ';
        }

        $info['dbtime'] = round($DB->perf_get_queries_time(), 5);
        $info['html'] .= '<li class="dbtime col-sm-4">DB queries time: '.$info['dbtime'].' secs</li> ';
        $info['txt'] .= 'db queries time: ' . $info['dbtime'] . 's ';

        if (function_exists('posix_times')) {
            $ptimes = posix_times();
            if (is_array($ptimes)) {
                foreach ($ptimes as $key => $val) {
                    $info[$key] = $ptimes[$key] -  $PERF->startposixtimes[$key];
                }
                $info['html'] .= "<li class=\"posixtimes col-sm-4\">ticks: $info[ticks] user: $info[utime]";
                $info['html'] .= "sys: $info[stime] cuser: $info[cutime] csys: $info[cstime]</li> ";
                $info['txt'] .= "ticks: $info[ticks] user: $info[utime] sys: $info[stime] cuser: $info[cutime] csys: $info[cstime] ";
            }
        }

        // Grab the load average for the last minute.
        // /proc will only work under some linux configurations
        // while uptime is there under MacOSX/Darwin and other unices.
        if (is_readable('/proc/loadavg') && $loadavg = @file('/proc/loadavg')) {
            list($serverload) = explode(' ', $loadavg[0]);
            unset($loadavg);
        } else if ( function_exists('is_executable') && is_executable('/usr/bin/uptime') && $loadavg = `/usr/bin/uptime` ) {
            if (preg_match('/load averages?: (\d+[\.,:]\d+)/', $loadavg, $matches)) {
                $serverload = $matches[1];
            } else {
                trigger_error('Could not parse uptime output!');
            }
        }
        if (!empty($serverload)) {
            $info['serverload'] = $serverload;
            $info['html'] .= '<li class="serverload col-sm-4">Load average: '.$info['serverload'].'</li> ';
            $info['txt'] .= "serverload: {$info['serverload']} ";
        }

        // Display size of session if session started.
        if ($si = \core\session\manager::get_performance_info()) {
            $info['sessionsize'] = $si['size'];
            $info['html'] .= "<li class=\"serverload col-sm-4\">" . $si['html'] . "</li>";
            $info['txt'] .= $si['txt'];
        }

        // Display time waiting for session if applicable.
        if (!empty($PERF->sessionlock['wait'])) {
            $sessionwait = number_format($PERF->sessionlock['wait'], 3) . ' secs';
            $info['html'] .= html_writer::tag('li', 'Session wait: ' . $sessionwait, [
                'class' => 'sessionwait col-sm-4'
            ]);
            $info['txt'] .= 'sessionwait: ' . $sessionwait . ' ';
        }

        $info['html'] .= '</ul>';
        $html = '';
        if ($stats = cache_helper::get_stats()) {
            $table = new html_table();
            $table->attributes['class'] = 'cachesused table table-dark table-sm w-auto table-bordered';
            $table->head = ['Mode', 'Cache item', 'Static', 'H', 'M', get_string('mappingprimary', 'cache'), 'H', 'M', 'S', 'I/O'];
            $table->data = [];
            $table->align = ['left', 'left', 'left', 'right', 'right', 'left', 'right', 'right', 'right', 'right'];

            $text = 'Caches used (hits/misses/sets): ';
            $hits = 0;
            $misses = 0;
            $sets = 0;
            $maxstores = 0;

            // We want to align static caches into their own column.
            $hasstatic = false;
            foreach ($stats as $definition => $details) {
                $numstores = count($details['stores']);
                $first = key($details['stores']);
                if ($first !== cache_store::STATIC_ACCEL) {
                    $numstores++; // Add a blank space for the missing static store.
                }
                $maxstores = max($maxstores, $numstores);
            }

            $storec = 0;

            while ($storec++ < ($maxstores - 2)) {
                if ($storec == ($maxstores - 2)) {
                    $table->head[] = get_string('mappingfinal', 'cache');
                } else {
                    $table->head[] = "Store $storec";
                }
                $table->align[] = 'left';
                $table->align[] = 'right';
                $table->align[] = 'right';
                $table->align[] = 'right';
                $table->align[] = 'right';
                $table->head[] = 'H';
                $table->head[] = 'M';
                $table->head[] = 'S';
                $table->head[] = 'I/O';
            }

            ksort($stats);

            foreach ($stats as $definition => $details) {
                switch ($details['mode']) {
                    case cache_store::MODE_APPLICATION:
                        $modeclass = 'application';
                        $mode = ' <span title="application cache">App</span>';
                        break;
                    case cache_store::MODE_SESSION:
                        $modeclass = 'session';
                        $mode = ' <span title="session cache">Ses</span>';
                        break;
                    case cache_store::MODE_REQUEST:
                        $modeclass = 'request';
                        $mode = ' <span title="request cache">Req</span>';
                        break;
                }
                $row = [$mode, $definition];

                $text .= "$definition {";

                $storec = 0;
                foreach ($details['stores'] as $store => $data) {

                    if ($storec == 0 && $store !== cache_store::STATIC_ACCEL) {
                        $row[] = '';
                        $row[] = '';
                        $row[] = '';
                        $storec++;
                    }

                    $hits   += $data['hits'];
                    $misses += $data['misses'];
                    $sets   += $data['sets'];
                    if ($data['hits'] == 0 and $data['misses'] > 0) {
                        $cachestoreclass = 'nohits bg-danger';
                    } else if ($data['hits'] < $data['misses']) {
                        $cachestoreclass = 'lowhits bg-warning text-dark';
                    } else {
                        $cachestoreclass = 'hihits';
                    }
                    $text .= "$store($data[hits]/$data[misses]/$data[sets]) ";
                    $cell = new html_table_cell($store);
                    $cell->attributes = ['class' => $cachestoreclass];
                    $row[] = $cell;
                    $cell = new html_table_cell($data['hits']);
                    $cell->attributes = ['class' => $cachestoreclass];
                    $row[] = $cell;
                    $cell = new html_table_cell($data['misses']);
                    $cell->attributes = ['class' => $cachestoreclass];
                    $row[] = $cell;

                    if ($store !== cache_store::STATIC_ACCEL) {
                        // The static cache is never set.
                        $cell = new html_table_cell($data['sets']);
                        $cell->attributes = ['class' => $cachestoreclass];
                        $row[] = $cell;

                        if ($data['hits'] || $data['sets']) {
                            if ($data['iobytes'] === cache_store::IO_BYTES_NOT_SUPPORTED) {
                                $size = '-';
                            } else {
                                $size = display_size($data['iobytes'], 1, 'KB');
                                if ($data['iobytes'] >= 10 * 1024) {
                                    $cachestoreclass = ' bg-warning text-dark';
                                }
                            }
                        } else {
                            $size = '';
                        }
                        $cell = new html_table_cell($size);
                        $cell->attributes = ['class' => $cachestoreclass];
                        $row[] = $cell;
                    }
                    $storec++;
                }
                while ($storec++ < $maxstores) {
                    $row[] = '';
                    $row[] = '';
                    $row[] = '';
                    $row[] = '';
                    $row[] = '';
                }
                $text .= '} ';

                $table->data[] = $row;
            }

            $html .= html_writer::table($table);

            // Now lets also show sub totals for each cache store.
            $storetotals = [];
            $storetotal = ['hits' => 0, 'misses' => 0, 'sets' => 0, 'iobytes' => 0];
            foreach ($stats as $definition => $details) {
                foreach ($details['stores'] as $store => $data) {
                    if (!array_key_exists($store, $storetotals)) {
                        $storetotals[$store] = ['hits' => 0, 'misses' => 0, 'sets' => 0, 'iobytes' => 0];
                    }
                    $storetotals[$store]['class']   = $data['class'];
                    $storetotals[$store]['hits']   += $data['hits'];
                    $storetotals[$store]['misses'] += $data['misses'];
                    $storetotals[$store]['sets']   += $data['sets'];
                    $storetotal['hits']   += $data['hits'];
                    $storetotal['misses'] += $data['misses'];
                    $storetotal['sets']   += $data['sets'];
                    if ($data['iobytes'] !== cache_store::IO_BYTES_NOT_SUPPORTED) {
                        $storetotals[$store]['iobytes'] += $data['iobytes'];
                        $storetotal['iobytes'] += $data['iobytes'];
                    }
                }
            }

            $table = new html_table();
            $table->attributes['class'] = 'cachesused table table-dark table-sm w-auto table-bordered';
            $table->head = [get_string('storename', 'cache'), get_string('type_cachestore', 'plugin'), 'H', 'M', 'S', 'I/O'];
            $table->data = [];
            $table->align = ['left', 'left', 'right', 'right', 'right', 'right'];

            ksort($storetotals);

            foreach ($storetotals as $store => $data) {
                $row = [];
                if ($data['hits'] == 0 and $data['misses'] > 0) {
                    $cachestoreclass = 'nohits bg-danger';
                } else if ($data['hits'] < $data['misses']) {
                    $cachestoreclass = 'lowhits bg-warning text-dark';
                } else {
                    $cachestoreclass = 'hihits';
                }
                $cell = new html_table_cell($store);
                $cell->attributes = ['class' => $cachestoreclass];
                $row[] = $cell;
                $cell = new html_table_cell($data['class']);
                $cell->attributes = ['class' => $cachestoreclass];
                $row[] = $cell;
                $cell = new html_table_cell($data['hits']);
                $cell->attributes = ['class' => $cachestoreclass];
                $row[] = $cell;
                $cell = new html_table_cell($data['misses']);
                $cell->attributes = ['class' => $cachestoreclass];
                $row[] = $cell;
                $cell = new html_table_cell($data['sets']);
                $cell->attributes = ['class' => $cachestoreclass];
                $row[] = $cell;
                if ($data['hits'] || $data['sets']) {
                    if ($data['iobytes']) {
                        $size = display_size($data['iobytes'], 1, 'KB');
                    } else {
                        $size = '-';
                    }
                } else {
                    $size = '';
                }
                $cell = new html_table_cell($size);
                $cell->attributes = ['class' => $cachestoreclass];
                $row[] = $cell;
                $table->data[] = $row;
            }
            if (!empty($storetotal['iobytes'])) {
                $size = display_size($storetotal['iobytes'], 1, 'KB');
            } else if (!empty($storetotal['hits']) || !empty($storetotal['sets'])) {
                $size = '-';
            } else {
                $size = '';
            }
            $row = [
                get_string('total'),
                '',
                $storetotal['hits'],
                $storetotal['misses'],
                $storetotal['sets'],
                $size,
            ];
            $table->data[] = $row;

            $html .= html_writer::table($table);

            $info['cachesused'] = "$hits / $misses / $sets";
            $info['html'] .= $html;
            $info['txt'] .= $text.'. ';
        } else {
            $info['cachesused'] = '0 / 0 / 0';
            $info['html'] .= '<div class="cachesused">Caches used (hits/misses/sets): 0/0/0</div>';
            $info['txt'] .= 'Caches used (hits/misses/sets): 0/0/0 ';
        }

        // Display lock information if any.
        if (!empty($PERF->locks)) {
            $table = new html_table();
            $table->attributes['class'] = 'locktimings table table-dark table-sm w-auto table-bordered';
            $table->head = ['Lock', 'Waited (s)', 'Obtained', 'Held for (s)'];
            $table->align = ['left', 'right', 'center', 'right'];
            $table->data = [];
            $text = 'Locks (waited/obtained/held):';
            foreach ($PERF->locks as $locktiming) {
                $row = [];
                $row[] = s($locktiming->type . '/' . $locktiming->resource);
                $text .= ' ' . $locktiming->type . '/' . $locktiming->resource . ' (';

                // The time we had to wait to get the lock.
                $roundedtime = number_format($locktiming->wait, 1);
                $cell = new html_table_cell($roundedtime);
                if ($locktiming->wait > 0.5) {
                    $cell->attributes = ['class' => 'bg-warning text-dark'];
                }
                $row[] = $cell;
                $text .= $roundedtime . '/';

                // Show a tick or cross for success.
                $row[] = $locktiming->success ? '&#x2713;' : '&#x274c;';
                $text .= ($locktiming->success ? 'y' : 'n') . '/';

                // If applicable, show how long we held the lock before releasing it.
                if (property_exists($locktiming, 'held')) {
                    $roundedtime = number_format($locktiming->held, 1);
                    $cell = new html_table_cell($roundedtime);
                    if ($locktiming->held > 0.5) {
                        $cell->attributes = ['class' => 'bg-warning text-dark'];
                    }
                    $row[] = $cell;
                    $text .= $roundedtime;
                } else {
                    $row[] = '-';
                    $text .= '-';
                }
                $text .= ')';

                $table->data[] = $row;
            }
            $info['html'] .= html_writer::table($table);
            $info['txt'] .= $text . '. ';
        }

        $info['html'] = '<div class="performanceinfo siteinfo container-fluid px-md-0 overflow-auto pt-3">'.$info['html'].'</div>';

    }
}
