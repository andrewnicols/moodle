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

trait PhpMappingTrait
{
    protected function getExtensions(): array
    {
        return ['php'];
    }

    protected function loadMappingFile(string $mappingFile): array
    {
        $mappings = require $mappingFile;

        if (!\is_array($mappings)) {
            throw new DriverException(sprintf('Malformed XML mapping file "%s".', $mappingFile), 0);
        }

        return $mappings;
    }
}
