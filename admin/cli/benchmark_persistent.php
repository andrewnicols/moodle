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
 * Compare persistent object overhead with simple in-memory models.
 *
 * @package    core
 * @copyright  2026 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define('CLI_SCRIPT', true);

require(__DIR__ . '/../../config.php');
require_once($CFG->libdir . '/clilib.php');

use core\model;
use core\model\attribute\field;
use core\param;

// Minimal array-backed model, without persistent's checks or database features.
$arraymodel = new class { // phpcs:ignore moodle.Commenting.MissingDocblock.Class
    /** @var array Model data. */
    private array $data = [];

    /**
     * Set a property.
     *
     * @param string $property Property name.
     * @param mixed $value Property value.
     * @return $this
     */
    public function set(string $property, mixed $value): self {
        $this->data[$property] = $value;
        return $this;
    }

    /**
     * Get a property.
     *
     * @param string $property Property name.
     * @return mixed
     */
    public function get(string $property): mixed {
        return $this->data[$property];
    }
};

/**
 * Unchecked access to declared model properties.
 */
trait PersistentBenchmarkAccessors {
    /**
     * Set a property.
     *
     * @param string $property Property name.
     * @param mixed $value Property value.
     * @return $this
     */
    public function set(string $property, mixed $value): self {
        $this->{$property} = $value;
        return $this;
    }

    /**
     * Get a property.
     *
     * @param string $property Property name.
     * @return mixed
     */
    public function get(string $property): mixed {
        return $this->{$property};
    }
}

// The same model data stored in declared properties rather than a hash table.
// phpcs:ignore moodle.Commenting.MissingDocblock.Class
$propertymodels['template'] = new class {
    use PersistentBenchmarkAccessors;

    /** @var string Template name. */
    private string $shortname;
    /** @var string Template description. */
    private string $description;
    /** @var int Description format. */
    private int $descriptionformat;
    /** @var int Due date. */
    private int $duedate;
    /** @var bool Visibility. */
    private bool $visible;
    /** @var int Context ID. */
    private int $contextid;
    /** @var int Record ID. */
    private int $id;
    /** @var int Creation time. */
    private int $timecreated;
    /** @var int Modification time. */
    private int $timemodified;
    /** @var int Modifying user ID. */
    private int $usermodified;
};

// phpcs:ignore moodle.Commenting.MissingDocblock.Class
$propertymodels['endpoint'] = new class {
    use PersistentBenchmarkAccessors;

    /** @var int Issuer ID. */
    private int $issuerid;
    /** @var string Endpoint name. */
    private string $name;
    /** @var string Endpoint URL. */
    private string $url;
    /** @var int Record ID. */
    private int $id;
    /** @var int Creation time. */
    private int $timecreated;
    /** @var int Modification time. */
    private int $timemodified;
    /** @var int Modifying user ID. */
    private int $usermodified;
};

// phpcs:ignore moodle.Commenting.MissingDocblock.Class
$propertymodels['issuer'] = new class {
    use PersistentBenchmarkAccessors;

    /** @var string Issuer name. */
    private string $name;
    /** @var string|null Image URL. */
    private ?string $image;
    /** @var string Client ID. */
    private string $clientid;
    /** @var string Client secret. */
    private string $clientsecret;
    /** @var string Base URL. */
    private string $baseurl;
    /** @var bool Enabled. */
    private bool $enabled;
    /** @var int Login page visibility. */
    private int $showonloginpage;
    /** @var bool Basic authentication. */
    private bool $basicauth;
    /** @var string|null Supported scopes. */
    private ?string $scopessupported;
    /** @var string Login scopes. */
    private string $loginscopes;
    /** @var string Offline login scopes. */
    private string $loginscopesoffline;
    /** @var string Login parameters. */
    private string $loginparams;
    /** @var string Offline login parameters. */
    private string $loginparamsoffline;
    /** @var string Allowed domains. */
    private string $alloweddomains;
    /** @var int Sort order. */
    private int $sortorder;
    /** @var bool Require confirmation. */
    private bool $requireconfirmation;
    /** @var string|null Service type. */
    private ?string $servicetype;
    /** @var string|null Login page name. */
    private ?string $loginpagename;
    /** @var string|null System email. */
    private ?string $systememail;
    /** @var int Record ID. */
    private int $id;
    /** @var int Creation time. */
    private int $timecreated;
    /** @var int Modification time. */
    private int $timemodified;
    /** @var int Modifying user ID. */
    private int $usermodified;
};

$coremodels['template'] = new class extends model { // phpcs:ignore moodle.Commenting.MissingDocblock.Class
    /** @var int Creation time. */
    #[field(param::INT)]
    protected int $timecreated = 0;
    /** @var int Modification time. */
    #[field(param::INT)]
    protected int $timemodified = 0;
    /** @var int Modifying user ID. */
    #[field(param::INT)]
    protected int $usermodified = 0;
    /** @var string Template name. */
    #[field(param::TEXT)]
    protected string $shortname;
    /** @var string Template description. */
    #[field(param::CLEANHTML)]
    protected string $description = '';
    /** @var int Description format (HTML). */
    #[field(param::INT, choices: [FORMAT_HTML, FORMAT_MOODLE, FORMAT_PLAIN, FORMAT_MARKDOWN])]
    protected int $descriptionformat = 1;
    /** @var int Due date. */
    #[field(param::INT)]
    protected int $duedate = 0;
    /** @var bool Visibility. */
    #[field(param::BOOL)]
    protected bool $visible = true;
    /** @var int Context ID. */
    #[field(param::INT)]
    protected int $contextid;
};

$coremodels['endpoint'] = new \core\oauth2\endpoint_model();
$coremodels['issuer'] = new \core\oauth2\issuer_model();

/**
 * Measure one retained batch, checking its data and the absence of database I/O.
 *
 * @param string $class Model class.
 * @param array $records Prebuilt input records, shared by all implementations.
 * @param bool $populate Whether to populate all fields through setters.
 * @param int $reads Number of full getter scans.
 * @param int $expectedchecksum Expected checksum of one getter scan.
 * @param bool $validate Measure first validation for OAuth2 models, separately from construction and reads.
 * @return array Measurements.
 */
function persistent_benchmark_sample(
    string $class,
    array $records,
    bool $populate,
    int $reads,
    int $expectedchecksum,
    bool $validate = false,
): array {
    global $DB;

    gc_collect_cycles();
    $manager = new \core\oauth2\issuer_model_manager($DB);
    $properties = array_keys($records[0]);
    $objects = array_fill(0, count($records), null);
    $queries = $DB->perf_get_queries();
    $before = memory_get_usage(false);
    memory_reset_peak_usage();
    $start = hrtime(true);
    foreach ($records as $index => $record) {
        $objects[$index] = new $class();
        if ($populate) {
            foreach ($record as $property => $value) {
                $objects[$index]->set($property, $value);
            }
        }
    }
    $buildms = (hrtime(true) - $start) / 1e6;
    $bytes = memory_get_usage(false) - $before;
    $peakbytes = memory_get_peak_usage(false) - $before;

    $readms = 0;
    $validationms = 0;
    if ($populate) {
        $checksum = 0;
        $start = hrtime(true);
        for ($round = 0; $round < $reads; $round++) {
            foreach ($objects as $object) {
                foreach ($properties as $property) {
                    $value = $object->get($property);
                    $checksum += is_string($value) ? strlen($value) : (int) $value;
                }
            }
        }
        $readms = (hrtime(true) - $start) / 1e6;
        if ($checksum !== $expectedchecksum * $reads) {
            throw new coding_exception("Getter checksum mismatch for {$class}.");
        }

        // Check every field outside the timed section, not just the checksum.
        foreach ($objects as $index => $object) {
            foreach ($records[$index] as $property => $value) {
                if ($object->get($property) !== $value) {
                    throw new coding_exception("Data mismatch for {$class}::{$property}.");
                }
            }
        }
        if ($validate && ($objects[0] instanceof \core\persistent || $objects[0] instanceof model)) {
            $start = hrtime(true);
            foreach ($objects as $object) {
                $valid = $object instanceof \core\oauth2\issuer_model ? $manager->validate($object) : $object->validate();
                if ($valid !== true) {
                    throw new coding_exception("Invalid benchmark fixture for {$class}: " . implode(', ', array_keys($valid)));
                }
            }
            $validationms = (hrtime(true) - $start) / 1e6;
        }
    }
    if ($DB->perf_get_queries() !== $queries) {
        throw new coding_exception("Unexpected database I/O for {$class}.");
    }

    return [
        'buildms' => $buildms,
        'readms' => $readms,
        'validationms' => $validationms,
        'bytes' => $bytes,
        'peakbytes' => $peakbytes,
    ];
}

/**
 * Summarise a measurement across trials.
 *
 * @param array $values Measurements.
 * @return array Minimum, median and maximum.
 */
function persistent_benchmark_summary(array $values): array {
    sort($values, SORT_NUMERIC);
    $middle = intdiv(count($values), 2);
    $median = count($values) % 2 ? $values[$middle] : ($values[$middle - 1] + $values[$middle]) / 2;
    return ['min' => $values[0], 'median' => $median, 'max' => $values[count($values) - 1]];
}

[$options, $unrecognised] = cli_get_params([
    'help' => false,
    'count' => 1000,
    'trials' => 21,
    'reads' => 10,
    'debug' => 'none',
    'model' => 'template',
    'json' => false,
], ['h' => 'help']);

if ($unrecognised) {
    cli_error('Unknown options: ' . implode(', ', $unrecognised));
}
if ($options['help']) {
    echo <<<'HELP'
Compare an existing persistent, two simple models and core\model with the same fields.
No records are read from or written to the database by the benchmark.

Options:
  --count=N         Retained objects per batch (default: 1000).
  --trials=N        Measured trials per model and scenario (default: 21).
  --reads=N         Full scans of all populated fields per trial (default: 10).
  --debug=MODE      none or developer, applied after bootstrap (default: none).
  --model=MODEL     template (10 fields), endpoint (7), or issuer (23).
                    Defaults to template; endpoint/issuer are core\oauth2 classes.
  --json            Output environment and measurement summaries as JSON.
  -h, --help        Show this help.

Run each debug mode in a fresh process, with Xdebug disabled:
  XDEBUG_MODE=off php admin/cli/benchmark_persistent.php --debug=none
  XDEBUG_MODE=off php admin/cli/benchmark_persistent.php --debug=developer
  XDEBUG_MODE=off php admin/cli/benchmark_persistent.php --model=endpoint --count=10000
  XDEBUG_MODE=off php admin/cli/benchmark_persistent.php --model=issuer --count=10000

Classes, property definitions, getter dependencies and full batches are warmed up
before measurement. Model order rotates between trials. Times exclude bootstrap,
input creation, correctness checks and database I/O. Empty batches isolate object
allocation; populated batches measure construction plus a setter for every field.
Read times include the checksum loop and all fields, including get() sanitisation.

Memory uses memory_get_usage(false), not allocator pages or process RSS. It excludes
the preallocated object list and prebuilt inputs, whose string payloads PHP shares
with the models. It measures incremental object/storage overhead, not total dataset
memory. Peak memory covers construction/population only. Methods and cached schema
are shared per class, not charged per object. Simple models deliberately omit
validation, sanitisation, defaults, change tracking and database functionality:
they are a lower-bound storage comparison, not equivalent replacements.
The OAuth2 core_model rows use the actual endpoint_model and issuer_model classes,
including their domain validators. Their first validation is timed separately;
IDs are nonzero and sortorder is set, avoiding insert-time queries. This is not a
save/CRUD benchmark. The template core_model remains a field-only control: it does
not implement competency lifecycle rules and its validation is not benchmarked.
All rows measure construction and cleaned getters as before; DML is not timed.
The properties row also uses native PHP types, but has no cleaning or validation.

HELP;
    exit(0);
}
foreach (['count', 'trials', 'reads'] as $option) {
    $value = filter_var($options[$option], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if ($value === false || is_bool($options[$option])) {
        cli_error("--{$option} must be a positive integer.");
    }
    $options[$option] = $value;
}
if (!in_array($options['debug'], ['none', 'developer'], true)) {
    cli_error('--debug must be none or developer.');
}
if (!is_string($options['model']) || !array_key_exists($options['model'], $propertymodels)) {
    cli_error('--model must be template, endpoint or issuer.');
}

$CFG->debug = $options['debug'] === 'developer' ? DEBUG_DEVELOPER : DEBUG_NONE;
$CFG->debugdeveloper = $options['debug'] === 'developer';
$CFG->debugdisplay = false;
error_reporting($CFG->debug);

$persistents = [
    'template' => \core_competency\template::class,
    'endpoint' => \core\oauth2\endpoint::class,
    'issuer' => \core\oauth2\issuer::class,
];
$classes = [
    'persistent' => $persistents[$options['model']],
    'array' => $arraymodel::class,
    'properties' => $propertymodels[$options['model']]::class,
    'core_model' => $coremodels[$options['model']]::class,
];
$records = [];
$expectedchecksum = 0;
for ($index = 0; $index < $options['count']; $index++) {
    $record = match ($options['model']) {
        'template' => [
            'shortname' => sprintf('Learning plan %06d', $index),
            'description' => sprintf('<p>Example learning plan template %06d.</p>', $index),
            'descriptionformat' => (int) FORMAT_HTML,
            'duedate' => 0,
            'visible' => true,
            'contextid' => 1,
        ],
        'endpoint' => [
            'issuerid' => 1,
            'name' => sprintf('endpoint_%06d', $index),
            'url' => sprintf('https://example.invalid/oauth2/%06d', $index),
        ],
        'issuer' => [
            'name' => sprintf('Example issuer %06d', $index),
            'image' => null,
            'clientid' => sprintf('example-client-%06d', $index),
            'clientsecret' => '',
            'baseurl' => sprintf('https://example.invalid/issuer/%06d', $index),
            'enabled' => true,
            'showonloginpage' => \core\oauth2\issuer::EVERYWHERE,
            'basicauth' => false,
            'scopessupported' => null,
            'loginscopes' => 'openid profile email',
            'loginscopesoffline' => 'openid profile email offline_access',
            'loginparams' => '',
            'loginparamsoffline' => '',
            'alloweddomains' => 'example.invalid',
            'sortorder' => $index,
            'requireconfirmation' => true,
            'servicetype' => null,
            'loginpagename' => null,
            'systememail' => null,
        ],
    };
    $record += [
        'id' => $index + 1,
        'timecreated' => 1700000000,
        'timemodified' => 1700000000,
        'usermodified' => 2,
    ];
    $records[] = $record;
    foreach ($record as $value) {
        $expectedchecksum += is_string($value) ? strlen($value) : (int) $value;
    }
}
$properties = array_keys($records[0]);
$defined = array_keys($classes['persistent']::properties_definition());
sort($properties);
sort($defined);
if ($properties !== $defined) {
    cli_error('The fixture must cover exactly the current persistent properties.');
}
$declared = array_map(
    static fn(ReflectionProperty $property): string => $property->getName(),
    (new ReflectionClass($classes['properties']))->getProperties(),
);
sort($declared);
if ($properties !== $declared) {
    cli_error('The simple model must declare exactly the fixture properties.');
}
$mapped = array_keys((array) $coremodels[$options['model']]->to_record());
sort($mapped);
if ($properties !== $mapped) {
    cli_error('The core model must map exactly the fixture properties.');
}

foreach ($classes as $class) {
    persistent_benchmark_sample($class, $records, false, 1, $expectedchecksum);
    persistent_benchmark_sample($class, $records, true, 1, $expectedchecksum, $options['model'] !== 'template');
}

$results = [];
foreach (['empty' => false, 'populated' => true] as $scenario => $populate) {
    $samples = [];
    $names = array_keys($classes);
    for ($trial = 0; $trial < $options['trials']; $trial++) {
        for ($offset = 0; $offset < count($names); $offset++) {
            $name = $names[($trial + $offset) % count($names)];
            $samples[$name][] = persistent_benchmark_sample(
                $classes[$name],
                $records,
                $populate,
                $options['reads'],
                $expectedchecksum,
                $options['model'] !== 'template',
            );
        }
    }
    foreach ($classes as $name => $class) {
        foreach (['buildms', 'readms', 'validationms', 'bytes', 'peakbytes'] as $metric) {
            $results[$scenario][$name][$metric] = persistent_benchmark_summary(array_column($samples[$name], $metric));
        }
    }
}

$environment = [
    'php' => PHP_VERSION,
    'intbytes' => PHP_INT_SIZE,
    'debug' => $CFG->debug,
    'debugdeveloper' => $CFG->debugdeveloper,
    'xdebug' => function_exists('xdebug_info') ? xdebug_info('mode') : [],
    'opcache_cli' => ini_get('opcache.enable_cli'),
    'jit' => ini_get('opcache.jit'),
    'classes' => $classes,
];
if ($options['json']) {
    echo json_encode(['environment' => $environment, 'options' => $options, 'results' => $results], JSON_PRETTY_PRINT);
    echo PHP_EOL;
    exit(0);
}

cli_writeln(sprintf(
    'PHP %s (%d-bit); debug=%s; Xdebug=%s; OPcache CLI=%s; JIT=%s',
    PHP_VERSION,
    PHP_INT_SIZE * 8,
    $options['debug'],
    implode(',', $environment['xdebug']) ?: 'off',
    $environment['opcache_cli'],
    $environment['jit'],
));
cli_writeln("Objects: {$options['count']}; trials: {$options['trials']}; getter scans/trial: {$options['reads']}");
cli_writeln("Persistent: {$classes['persistent']}; fields: " . count($properties));
cli_writeln('Warm-cache medians; build/read brackets show min..max milliseconds.');
cli_writeln('Retained/peak KiB exclude inputs, shared strings and the preallocated object list. See --help.');
printf(
    "%-10s %-12s %27s %27s %27s %13s %11s %11s\n",
    'Scenario',
    'Model',
    'Build ms [min..max]',
    'Read ms [min..max]',
    'Validate ms [min..max]',
    'Retained KiB',
    'B/object',
    'Peak KiB',
);
foreach ($results as $scenario => $models) {
    foreach ($models as $name => $metrics) {
        $times = [];
        foreach (['buildms', 'readms', 'validationms'] as $metric) {
            $summary = $metrics[$metric];
            $times[] = sprintf('%.3f [%.3f..%.3f]', $summary['median'], $summary['min'], $summary['max']);
        }
        printf(
            "%-10s %-12s %27s %27s %27s %13.2f %11.1f %11.2f\n",
            $scenario,
            $name,
            $times[0],
            $scenario === 'populated' ? $times[1] : '-',
            $scenario === 'populated' && $options['model'] !== 'template'
                && in_array($name, ['persistent', 'core_model']) ? $times[2] : '-',
            $metrics['bytes']['median'] / 1024,
            $metrics['bytes']['median'] / $options['count'],
            $metrics['peakbytes']['median'] / 1024,
        );
    }
}
cli_writeln('PASS: every populated field matched exactly; getter checksums matched; no benchmark database queries.');
