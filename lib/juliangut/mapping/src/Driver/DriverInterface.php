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

use Jgut\Mapping\Metadata\MetadataInterface;

interface DriverInterface
{
    /**
     * Get mapped metadata.
     *
     * @return array<MetadataInterface>
     */
    public function getMetadata(): array;
}
