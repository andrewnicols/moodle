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

namespace Jgut\Mapping\Driver;

interface DriverFactoryInterface
{
    public const DRIVER_PHP = 'php';
    public const DRIVER_XML = 'xml';
    public const DRIVER_JSON = 'json';
    public const DRIVER_YAML = 'yaml';
    public const DRIVER_ATTRIBUTE = 'attribute';
    public const DRIVER_ANNOTATION = 'annotation';

    /**
     * Get mapping driver.
     *
     * @param array{driver?: string|object, type?: string, path?: string|array<string>} $mappingSource
     */
    public function getDriver(array $mappingSource): DriverInterface;
}
