<?php

/*
 * mapping (https://github.com/juliangut/mapping).
 * Mapping parsing base library.
 *
 * @license BSD-3-Clause
 * @link https://github.com/juliangut/mapping
 * @author Julián Gutiérrez <juliangut@gmail.com>
 */

declare(strict_types=1);

namespace Jgut\Mapping\Driver\Traits;

use Jgut\Mapping\Exception\DriverException;
use LibXMLError;
use SimpleXMLElement;

/**
 * XML file mapping trait.
 */
trait XmlMappingTrait
{
    /**
     * @var array<string>
     */
    private static array $truthlyValues = [
        'true',
        'on',
        'yes',
    ];

    /**
     * @var array<string>
     */
    private static array $falsyValues = [
        'false',
        'off',
        'no',
    ];

    /**
     * List of boolean values.
     *
     * @var array<string>|null
     */
    private static ?array $boolValues = null;

    protected function getExtensions(): array
    {
        return ['xml'];
    }

    protected function loadMappingFile(string $mappingFile): array
    {
        $fileContents = file_get_contents($mappingFile);
        if ($fileContents === false) {
            throw new DriverException(sprintf('XML mapping file "%s" read failed.', $mappingFile), 0);
        }

        $useInternalErrors = libxml_use_internal_errors(true);

        $mappings = simplexml_load_string($fileContents);

        libxml_use_internal_errors($useInternalErrors);

        if ($mappings === false) {
            // @codeCoverageIgnoreStart
            $errors = array_map(
                static fn(LibXMLError $error) => '"' . $error->message . '"',
                libxml_get_errors(),
            );
            // @codeCoverageIgnoreEnd

            libxml_clear_errors();

            throw new DriverException(
                sprintf('XML mapping file "%s" parsing error: %s.', $mappingFile, rtrim(implode(',', $errors), '.')),
            );
        }

        $mappings = $this->parseSimpleXml($mappings);

        if (!\is_array($mappings)) {
            throw new DriverException(sprintf('Malformed XML mapping file "%s".', $mappingFile), 0);
        }

        return $mappings;
    }

    /**
     * Parse XML.
     *
     * @return mixed|array<string, mixed>
     */
    final protected function parseSimpleXml(SimpleXMLElement $element)
    {
        $elements = [];

        $attributes = $element->attributes() ?? [];
        foreach ($attributes as $attribute => $value) {
            $elements[$attribute] = $value instanceof SimpleXMLElement ? $this->parseSimpleXml($value) : $value;
        }

        foreach ($element->children() as $node => $child) {
            $elements[$node] = $child instanceof SimpleXMLElement ? $this->parseSimpleXml($child) : $child;
        }

        if ($element->count() === 0 && trim((string) $element) !== '') {
            $value = $this->getTypedValue((string) $element);

            if (\count($elements) === 0) {
                return $value;
            }

            $elements['_value_'] = $value;
        }

        return $elements;
    }

    /**
     * @return string|float|int|bool
     */
    private function getTypedValue(string $value)
    {
        if (self::$boolValues === null) {
            self::$boolValues = array_merge(self::$truthlyValues, self::$falsyValues);
        }

        if (\in_array($value, self::$boolValues, true)) {
            return \in_array($value, self::$truthlyValues, true);
        }

        if (is_numeric($value)) {
            return $this->getNumericValue($value);
        }

        return $value;
    }

    /**
     * @return float|int
     */
    private function getNumericValue(string $value)
    {
        if (mb_strpos($value, '.') !== false) {
            return (float) $value;
        }

        return (int) $value;
    }
}
