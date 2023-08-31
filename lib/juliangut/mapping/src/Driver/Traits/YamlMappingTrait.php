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
use Symfony\Component\Yaml\Exception\ParseException;
use Symfony\Component\Yaml\Yaml as YamlReader;

/**
 * YAML file mapping trait.
 */
trait YamlMappingTrait
{
    protected function getExtensions(): array
    {
        return ['yml', 'yaml'];
    }

    protected function loadMappingFile(string $mappingFile): array
    {
        $fileContents = file_get_contents($mappingFile);
        if ($fileContents === false) {
            throw new DriverException(sprintf('XML mapping file "%s" read failed.', $mappingFile), 0);
        }

        try {
            $mappings = YamlReader::parse(
                $fileContents,
                YamlReader::PARSE_EXCEPTION_ON_INVALID_TYPE,
            );
            // @codeCoverageIgnoreStart
        } catch (ParseException $exception) {
            throw new DriverException(
                sprintf('YAML mapping file "%s" parsing error: %s.', $mappingFile, rtrim($exception->getMessage())),
                0,
                $exception,
            );
        }
        // @codeCoverageIgnoreEnd

        if (!\is_array($mappings)) {
            throw new DriverException(sprintf('Malformed YAML mapping file "%s".', $mappingFile), 0);
        }

        return $mappings;
    }
}
