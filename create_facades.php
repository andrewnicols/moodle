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

use core\facade;
use phpDocumentor\Reflection\DocBlock;
use phpDocumentor\Reflection\DocBlock\Description;
use phpDocumentor\Reflection\DocBlock\Serializer;
use phpDocumentor\Reflection\DocBlock\Tag;
use phpDocumentor\Reflection\DocBlock\Tags\Author;
use phpDocumentor\Reflection\DocBlock\Tags\Generic;
use phpDocumentor\Reflection\DocBlock\Tags\Method;
use phpDocumentor\Reflection\DocBlockFactory;
use phpDocumentor\Reflection\DocBlock\Tags\Formatter\PassthroughFormatter;
use phpDocumentor\Reflection\DocBlock\Tags\Reference\Fqsen;
use phpDocumentor\Reflection\DocBlock\Tags\See;
use phpDocumentor\Reflection\Fqsen as ReflectionFqsen;
use phpDocumentor\Reflection\Types\ContextFactory;

define('CLI_SCRIPT', true);

require_once('config.php');
require_once('vendor/autoload.php');
require_once('lib/clilib.php');

class PsrFormatter extends PassthroughFormatter {
    public function format(Tag $tag): string {
        if ($tag instanceof Method) {
            $returnval = '@method ';
            if ($tag->isStatic()) {
                $returnval .= 'static ';
            }

            $returnval .= sprintf(
                "%s %s(",
                $tag->getReturnType() ?? 'void',
                $tag->getMethodName(),
            );

            $argumentlist = $tag->getArguments();
            if ($argumentlist) {
                $returnval .= "\n";
                foreach ($tag->getArguments() as $argument) {
                    $returnval .= sprintf(
                        "    %s $%s,\n",
                        $argument['type'],
                        $argument['name'],
                    );
                }
            }

            $returnval .= ")";

            if ($description = $tag->getDescription()) {
                $returnval .= " ";
                $returnval .= $description->render();
            }

            return $returnval;
        }

        return parent::format($tag);
    }
}

class facade_docs_generator {
    private DocBlockFactory $factory;
    private ContextFactory $contextfactory;
    private DocBlock $facadedocs;
    private \ReflectionClass $facadedclass;
    private string $facadedclassname;

    public function __construct(
        protected string $component,
        protected string $facadeclassname,
        string $facadedclassname,
    ) {
        $this->facadedclassname = '\\' . ltrim($facadedclassname, '\\');
        $this->facadedclass = new \ReflectionClass($this->facadedclassname);

        $this->factory = DocBlockFactory::createInstance();
        $this->contextfactory = new ContextFactory();
        $classdocs = $this->factory->create($this->facadedclass);

        $this->facadedocs = new DocBlock(
            $classdocs->getSummary(),
        );
    }

    public function generate_facade_docs(): string {
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

        $namespace = $this->get_namespace_from_namespaced_clasname($this->facadeclassname);
        $classname = $this->get_classname_from_namespaced_clasname($this->facadeclassname);
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

    protected function get_method_docs(\ReflectionMethod $method): Method {
        if ($method->getDocComment()) {
            return $this->get_method_docs_from_docblock($method);
        }

        return $this->generate_method_docs_with_reflection($method);
    }

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

    protected function get_namespace_from_namespaced_clasname(string $classname): string {
        $parts = explode('\\', $classname);
        array_pop($parts);

        return implode('\\', $parts);
    }

    protected function get_classname_from_namespaced_clasname(string $fqdn): string {
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
    php admin/cli/create_facades.php -c core\formatting

    # Update all existing facades
    php admin/cli/create_facades.php
    EOF;

    echo $help;
    die;
}

if ($options['create']) {
    $facadedclassname = $options['create'];

    if (!str_contains($facadedclassname, '\\')) {
        cli_error('The facadedclassname must be a fully qualified class name.');
    }

    $class = new \ReflectionClass($facadedclassname);
    $namespace = $class->getNamespaceName();
    $component = core_component::get_component_from_classname($facadedclassname);

    $facadeclassnameparts = [
        $namespace,
        'facade',
        substr($class->getName(), strlen($namespace) + 1),
    ];
    $facadeclassname = implode('\\', $facadeclassnameparts);

    // Determine which component this class is in.
    $generator = new facade_docs_generator(
        component: $component,
        facadedclassname: $facadedclassname,
        facadeclassname: $facadeclassname,
    );
    $content = $generator->generate_facade_docs();

    $filepath = \core_component::get_component_directory($component) . '/classes/facade/';
    $filepath .= str_replace('\\', '/', substr($class->getName(), strlen($namespace) + 1)) . '.php';

    file_put_contents(
        $filepath,
        $content,
    );
} else {
    $componentlist = \core_component::get_component_list();
    $componentlist['core']['core'] = $CFG->libdir;
    foreach ($componentlist as $type => $components) {
        foreach (array_keys($components) as $component) {
            $classes = \core_component::get_component_classes_in_namespace($component, 'facade');
            foreach ($classes as $class => $path) {
                $generator = new facade_docs_generator(
                    component: $component,
                    facadedclassname: $class::get_facade_accessor(),
                    facadeclassname: $class,
                );
                $content = $generator->generate_facade_docs();

                $reflectedclass = new \ReflectionClass($class);
                file_put_contents(
                    $reflectedclass->getFileName(),
                    $content,
                );
            }
        }
    }
}
