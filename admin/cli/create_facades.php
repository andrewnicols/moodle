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
 * Helper to create or update static facade classes.
 *
 * @package    core
 * @copyright  2024 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

use phpDocumentor\Reflection\DocBlock;
use phpDocumentor\Reflection\DocBlock\Description;
use phpDocumentor\Reflection\DocBlock\Serializer;
use phpDocumentor\Reflection\DocBlock\Tags\Author;
use phpDocumentor\Reflection\DocBlock\Tags\Generic;
use phpDocumentor\Reflection\DocBlock\Tags\Method;
use phpDocumentor\Reflection\DocBlockFactory;
use phpDocumentor\Reflection\DocBlock\Tags\Reference\Fqsen;
use phpDocumentor\Reflection\DocBlock\Tags\See;
use phpDocumentor\Reflection\Fqsen as ReflectionFqsen;
use phpDocumentor\Reflection\Types\ContextFactory;

define('CLI_SCRIPT', true);

require_once(dirname(__DIR__, 2) . '/config.php');
require_once($CFG->dirroot . '/vendor/autoload.php');
require_once($CFG->libdir . '/clilib.php');

class facade_docs_generator {
    private DocBlockFactory $factory;
    private ContextFactory $contextfactory;
    private \ReflectionClass $facadedclass;
    private string $facadedclassname;
    private string $component;

    /**
     * Create a new instance of the docs generator.
     *
     * @param string $component
     * @param string $facadeclassname The fully qualified classname of the facade class
     * @param string $facadedclassname The fully qualified classname of the facaded class
     */
    public function __construct(
        protected string $facadeclassname,
        string $facadedclassname,
    ) {
        $this->facadedclassname = '\\' . ltrim($facadedclassname, '\\');
        $this->facadedclass = new \ReflectionClass($this->facadedclassname);
        $this->component = core_component::get_component_from_classname($facadedclassname);

        $this->factory = DocBlockFactory::createInstance();
        $this->contextfactory = new ContextFactory();
        $classdocs = $this->factory->create($this->facadedclass);
    }

    /**
     * Generate the facade class for the specified class.
     *
     * @param string $component
     * @param string $facadeclassname The fully qualified classname of the facade class
     * @param string $facadedclassname The fully qualified classname of the facaded class
     */
    public static function generate_facade_class(
        string $facadeclassname,
        string $facadedclassname,
    ): void {
        $generator = new self(
            facadedclassname: $facadedclassname,
            facadeclassname: $facadeclassname,
        );

        $filepath = $generator->get_facade_filepath();
        mkdir(
            directory: dirname($filepath),
            recursive: true,
        );

        file_put_contents(
            filename: $filepath,
            data: $generator->generate_facade(),
        );
    }

    /**
     * Get the filepath of the facade class.
     *
     * @return string
     */
    public function get_facade_filepath(): string {
        $filepath = \core_component::get_component_directory($this->component) . '/classes/';
        $filepath .= str_replace('\\', '/', substr($this->facadeclassname, strlen($this->component) + 1)) . '.php';

        return $filepath;
    }

    /**
     * Generate the facade class content.
     *
     * @return string
     */
    public function generate_facade(): string {
        $allmethods = [];
        $classlist = [$this->facadedclass];
        $parent = $this->facadedclass;

        while ($parent = $parent->getParentClass()) {
            array_unshift($classlist, $parent);
        }
        foreach ($classlist as $facadeclass) {
            array_unshift($allmethods, ...$facadeclass->getMethods(\ReflectionMethod::IS_PUBLIC));
        }

        $methods = array_filter(
            array: $allmethods,
            callback: fn ($rm) => !$rm->isStatic(),
        );

        $docargs = [
            'summary' => sprintf(
                'A facade for the %s class',
                $this->facadeclassname,
            ),
            'tags' => [
                new Generic(
                    name: 'package',
                    description: new Description($this->component)
                ),
                new Generic(
                    name: 'copyright',
                    description: new Description('http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later'),
                ),
                new Author(
                    'Moodle Pty Ltd',
                    'moodlebot@moodle.com',
                ),
                new See(
                    refers: new Fqsen(new ReflectionFqsen(
                        $this->facadedclassname,
                    )),
                ),
            ],
        ];

        foreach ($methods as $method) {
            $docargs['tags'][] = $this->get_method_docs($method);
        }

        $docblock = new DocBlock(...$docargs);

        // Create the serializer that will reconstitute the DocBlock back to its original form.
        $serializer = new Serializer(
            indent: 0,
            indentString: '',
            lineLength: 134,
            lineEnding: PHP_EOL,
            // tagFormatter: new PsrFormatter(),
        );
        $classdocblock = $serializer->getDocComment($docblock);

        // Calculate the namespace and classname of the Facade class.

        $namespace = $this->get_namespace_from_namespaced_classname($this->facadeclassname);
        $classname = $this->get_classname_from_namespaced_classname($this->facadeclassname);
        $facadedclassname = $this->facadedclassname;

        $classcontent = <<<EOF
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

        namespace $namespace;

        $classdocblock
        class $classname extends \\core\\facade {
            public static function get_facade_accessor(): string {
                return $facadedclassname::class;
            }
        }

        EOF;

        return $classcontent;
    }

    /**
     * Get the docs for for the specified method.
     *
     * @param \ReflectionMethod $method
     * @return Method
     */
    protected function get_method_docs(\ReflectionMethod $method): Method {
        if ($method->getDocComment()) {
            return $this->get_method_docs_from_docblock($method);
        }

        return $this->generate_method_docs_with_reflection($method);
    }

    /**
     * Get the docs for for the specified method from the docblock.
     *
     * @param \ReflectionMethod $method
     * @return Method
     */
    protected function get_method_docs_from_docblock(\ReflectionMethod $method): Method {
        $docblock = $this->factory->create(
            docblock: $method,
            context: $this->contextfactory->createFromReflector($method->getDeclaringClass()),
        );
        $parameters = [];
        foreach ($method->getParameters() as $parameter) {
            $parameters[$parameter->getName()] = $parameter;
        }

        $methodargs = [
            'methodName' => $method->getName(),
            'static' => true,
            'arguments' => [],
            'description' => new Description($docblock->getSummary()),
        ];

        foreach ($docblock->getTagsByName('param') as $param) {
            /** @var \phpDocumentor\Reflection\DocBlock\Tags\Param $param */

            $name = $param->getVariableName();
            $methodarg = [
                'type' => $param->getType(),
                'name' => $name,
            ];

            $parameter = $parameters[$name];
            if ($parameter->isDefaultValueAvailable()) {
                if ($parameter->isDefaultValueConstant()) {
                    $default = "\\" . $parameter->getDefaultValueConstantName();
                } else {
                    $default = strtolower(var_export($parameter->getDefaultValue(), true));
                }

                $methodarg['name'] = sprintf(
                    "%s = %s",
                    $param->getVariableName(),
                    $default,
                );
            }

            $methodargs['arguments'][] = $methodarg;
        }

        if ($method->getReturnType()) {
            $typeresolver = new \phpDocumentor\Reflection\TypeResolver();
            $methodargs['returnType'] = $typeresolver->resolve($method->getReturnType());
        }

        return new Method(...$methodargs);
    }

    /**
     * Generate the docs for for the specified method using reflection.
     *
     * @param \ReflectionMethod $method
     * @return Method
     */
    protected function generate_method_docs_with_reflection(\ReflectionMethod $method): Method {
        $methodargs = [
            'methodName' => $method->getName(),
            'static' => true,
            'arguments' => [],
            'description' => null,
        ];

        $typeresolver = new \phpDocumentor\Reflection\TypeResolver();

        foreach ($method->getParameters() as $param) {
            if ($param->hasType()) {
                $type = $typeresolver->resolve($param->getType());
            } else {
                $type = $typeresolver->resolve('mixed');
            }

            $methodargs['arguments'][] = [
                'name' => $param->getName(),
                'type' => $type,
            ];
        }

        if ($method->hasReturnType()) {
            $methodargs['returnType'] = $typeresolver->resolve($method->getReturnType());
        }

        return new Method(...$methodargs);
    }

    /**
     * Get the namespace from a fqdn classname.
     *
     * @param string $classname
     * @return string
     */
    protected function get_namespace_from_namespaced_classname(string $classname): string {
        $parts = explode('\\', $classname);
        array_pop($parts);

        return implode('\\', $parts);
    }

    /**
     * Get the classname from a fqdn classname.
     *
     * @param string $fqdn
     * @return string
     */
    protected function get_classname_from_namespaced_classname(string $fqdn): string {
        $parts = explode('\\', $fqdn);

        return array_pop($parts);
    }
}

// Now get cli option.
[$options, $unrecognized] = cli_get_params([
    'create' => false,
    'help' => false,
], [
    'c' => 'create',
    'h' => 'help',
]);

if ($unrecognized) {
    $unrecognized = implode("\n  ", $unrecognized);
    cli_error(get_string('cliunknowoption', 'admin', $unrecognized));
}

if ($options['help']) {
    $help = <<<EOF
    Create or update static facade classes.

    Options:
    -c, --create             Create a new facade for the specified class

    Examples:
    # Create the facade for the core\formatting class
    php admin/cli/create_facades.php --create="core\formatting"
    php admin/cli/create_facades.php -c="core\formatting"

    # Update all existing facades
    php admin/cli/create_facades.php
    EOF;

    echo $help;
    die;
}

if ($options['create']) {
    // Generate a new facade for the specified class, or interface.
    $facadedclassname = $options['create'];

    if (!str_contains($facadedclassname, '\\')) {
        cli_error('The facaded classname must be a fully qualified class name.');
    }

    if (str_contains($facadedclassname, 'facade')) {
        cli_error('The specified classname must not be a facade.');
    }

    if (!class_exists($facadedclassname) && !interface_exists($facadedclassname)) {
        cli_error('The specified classname must be a valid class or interface.');
    }

    // Determine the fully qualified classname of the facade class.
    // This is comprised of \[component]\facade\[remaining\namespaced\classname].
    $component = core_component::get_component_from_classname($facadedclassname);

    $facadeclassname = implode('\\', [
        $component,
        'facade',
        substr($facadedclassname, strlen($component) + 1),
    ]);

    // Determine which component this class is in.
    facade_docs_generator::generate_facade_class(
        facadedclassname: $facadedclassname,
        facadeclassname: $facadeclassname,
    );
} else {
    // Run through all components and re-generate all existing facades.
    $componentlist = \core_component::get_component_list();
    $componentlist['core']['core'] = $CFG->libdir;

    foreach ($componentlist as $type => $components) {
        foreach (array_keys($components) as $component) {
            $classes = \core_component::get_component_classes_in_namespace($component, 'facade');
            foreach ($classes as $class => $path) {
                facade_docs_generator::generate_facade_class(
                    facadedclassname: $class::get_facade_accessor(),
                    facadeclassname: $class,
                );
            }
        }
    }
}
