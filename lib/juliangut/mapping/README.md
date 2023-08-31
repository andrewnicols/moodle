[![PHP version](https://img.shields.io/badge/PHP-%3E%3D7.4-8892BF.svg?style=flat-square)](http://php.net)
[![Latest Version](https://img.shields.io/packagist/v/juliangut/mapping.svg?style=flat-square)](https://packagist.org/packages/juliangut/mapping)
[![License](https://img.shields.io/github/license/juliangut/mapping.svg?style=flat-square)](https://github.com/juliangut/mapping/blob/master/LICENSE)

[![Total Downloads](https://img.shields.io/packagist/dt/juliangut/mapping.svg?style=flat-square)](https://packagist.org/packages/juliangut/mapping/stats)
[![Monthly Downloads](https://img.shields.io/packagist/dm/juliangut/mapping.svg?style=flat-square)](https://packagist.org/packages/juliangut/mapping/stats)

# Mapping

Base mapping parsing library for any kind of project or library.

This library frees you from the most tedious part of mapping parsing by providing a set of functionalities to easily load mappings from PHP's Attributes or files of different formats (PHP, JSON, XML, YAML), so you can focus on the actual parsing of mappings into metadata you can use onwards.

## Examples

Examples of packages fully implementing this library can be found at

* [juliangut/slim-routing](https://github.com/juliangut/slim-routing)
* [juliangut/json-api](https://github.com/juliangut/json-api)

## Installation

### Composer

```
composer require juliangut/mapping
```

To use yaml files mappings

```
composer require symfony/yaml
```

## Usage

Require composer autoload file

```php
require './vendor/autoload.php';
```

### Drivers

Should retrieve parsed metadata stored in a specific format

#### File mapping

Any kind of format that can be returned on an array can be used

```php
use Jgut\Mapping\Driver\AbstractMappingDriver;
use Jgut\Mapping\Driver\Traits\PhpMappingTrait;
use Jgut\Mapping\Metadata\MetadataInterface;

class PhpDriver extends AbstractMappingDriver
{
    use PhpMappingTrait;

    /**
     * @return MetadataInterface[]
     */
    public function getMetadata(): array
    {
        $mappingData = $this->getMappingData();

        // Return your parsed metadata
    }
}

$driver = new PhpDriver(['path/to/classes']);

$driver->getMetadata();
```

There are mapping traits to easily support four types of mapping files:

* DriverInterface::DRIVER_PHP => Jgut\Mapping\Driver\Traits\PhpMappingTrait
* DriverInterface::DRIVER_JSON => Jgut\Mapping\Driver\Traits\JsonMappingTrait
* DriverInterface::DRIVER_XML => Jgut\Mapping\Driver\Traits\XmlMappingTrait
* DriverInterface::DRIVER_YAML => Jgut\Mapping\Driver\Traits\YamlMappingTrait

#### Attribute mapping

```php
use Jgut\Mapping\Driver\AbstractClassDriver;
use Jgut\Mapping\Metadata\MetadataInterface;

class AttributeDriver extends AbstractClassDriver
{
    /**
     * @return MetadataInterface[]
     */
    public function getMetadata(): array
    {
        $mappingClasses = $this->getMappingClasses();

        // Parse class attributes with PHP's reflection

        // Return your parsed metadata
    }
}

$driver = new AttributeDriver(['path/to/classes']);

$driver->getMetadata();
```

#### Annotation mapping

_Annotations are deprecated and will be removed when support for PHP 7.4 is dropped. Use Attribute mapping instead_

```
composer require doctrine/annotations
```

```php
use Doctrine\Common\Annotations\AnnotationReader;
use Jgut\Mapping\Driver\AbstractAnnotationDriver;
use Jgut\Mapping\Metadata\MetadataInterface;

class AnnotationDriver extends AbstractAnnotationDriver
{
    /**
     * @return MetadataInterface[]
     */
    public function getMetadata(): array
    {
        $mappingClasses = $this->getMappingClasses();

        // Parse class annotations. Annotation reader available on $this->annotationReader

        // Return your parsed metadata
    }
}

$driver = new AnnotationDriver(['path/to/classes'], new AnnotationReader());

$driver->getMetadata();
```

#### Factory

Create your driver factory extending from Jgut\Mapping\Driver\AbstractDriverFactory, it allows to automatically get a mapping driver from mapping sources

```php
use Doctrine\Common\Annotations\AnnotationReader;
use Jgut\Mapping\Driver\AbstractDriverFactory;
use Jgut\Mapping\Driver\DriverInterface;

class DriverFactory extends AbstractDriverFactory
{
    protected function getPhpDriver(array $paths): DriverInterface
    {
        return new PhpDriver($paths);
    }

    protected function getAttributeDriver(array $paths): DriverInterface
    {
        return new AttributeDriver($paths);
    }

    protected function getAnnotationDriver(array $paths): DriverInterface
    {
        return new AnnotationDriver($paths, new AnnotationReader());
    }
}
```

### Resolver

Given mapping source definitions, metadata resolver will resolve final metadata using a driver factory

```php
use Jgut\Mapping\Driver\DriverFactoryInterface;
use Jgut\Mapping\Metadata\MetadataResolver;

$mappingSources = [
    [
        'type' => DriverFactoryInterface::DRIVER_ATTRIBUTE,
        'path' => '/path/to/mapping/files',
    ]
];

$metadataResolver = new MetadataResolver(new DriverFactory(), new PSR16Cache());

$metadata = $metadataResolver->getMetadata($mappingSources);
```

> It's not mandatory, but highly recommended, to add a PSR-16 cache implementation to metadata resolver, collecting mapping data from annotations and/or files and transforming them into metadata objects can be an intensive operation that benefits vastly of caching

#### Mapping source

Define where your mapping data is and how it will be parsed

* `type` one of \Jgut\Mapping\Driver\DriverFactoryInterface constants: `DRIVER_ATTRIBUTE`, `DRIVER_PHP`, `DRIVER_JSON`, `DRIVER_XML`, `DRIVER_YAML` or `DRIVER_ANNOTATION` **if no driver, defaults to DRIVER_ATTRIBUTE in PHP >=8.0 or DRIVER_ANNOTATION PHP < 8.0**
* `path` a string path or array of paths to where mapping files are located (files or directories) **REQUIRED if no driver**
* `driver` an already created \Jgut\Mapping\Driver\DriverInterface object **REQUIRED if no type AND path**

### Annotations

Base AbstractAnnotation class is provided to ease annotations creation.

```php
use Jgut\Mapping\Annotation\AbstractAnnotation;

/**
 * Custom annotation.
 *
 * @Annotation
 *
 * @Target("CLASS")
 */
class Event extends AbstractAnnotation
{
    protected string $event;

    protected bool $enabled;

    public function setEvent(string $event): void
    {
        $this->event = $event;
    }

    public function setEnabled(bool $enabled): void
    {
        $this->enabled = $enabled;
    }

    /**
     * @inheritDoc
     */
    protected function getDefaultProperty(): ?string
    {
        return 'event';
    }
}
```

```php
/**
 * @Event("post_deserialize", enabled=true)
 */
class Example
{
}
```

`getDefaultParameter` defines which annotation property is considered the default ("value" by default). In this previous example `event` property will be set to "post_deserialize"

## Contributing

Found a bug or have a feature request? [Please open a new issue](https://github.com/juliangut/mapping/issues). Have a look at existing issues before.

See file [CONTRIBUTING.md](https://github.com/juliangut/mapping/blob/master/CONTRIBUTING.md)

## License

See file [LICENSE](https://github.com/juliangut/mapping/blob/master/LICENSE) included with the source code for a copy of the license terms.
