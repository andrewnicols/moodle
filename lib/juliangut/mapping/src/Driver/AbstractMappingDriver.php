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

use Jgut\Mapping\Exception\DriverException;

abstract class AbstractMappingDriver extends AbstractDriver
{
    /**
     * @throws DriverException
     *
     * @return array<mixed>
     */
    protected function getMappingData(): array
    {
        $mappings = [];

        foreach ($this->locator->getMappingFiles() as $mappingFile) {
            $mappings[] = $this->loadMappingFile($mappingFile);
        }

        $mappingData = [];
        foreach ($mappings as $mapping) {
            $mappingData = $this->mergeMappings($mappingData, $mapping);
        }

        return $mappingData;
    }

    /**
     * @throws DriverException
     *
     * @return array<mixed>
     */
    abstract protected function loadMappingFile(string $mappingFile): array;

    /**
     * @param array<mixed> $mappingsA
     * @param array<mixed> $mappingsB
     *
     * @return array<mixed>
     */
    final protected function mergeMappings(array $mappingsA, array $mappingsB): array
    {
        foreach ($mappingsB as $key => $value) {
            if (\array_key_exists($key, $mappingsA) || \array_key_exists($key, $mappingsA)) {
                if (\is_int($key)) {
                    $mappingsA[] = $value;
                } elseif (\is_array($value) && \is_array($mappingsA[$key])) {
                    $mappingsA[$key] = $this->mergeMappings($mappingsA[$key], $value);
                } else {
                    $mappingsA[$key] = $value;
                }
            } else {
                $mappingsA[$key] = $value;
            }
        }

        return $mappingsA;
    }
}
