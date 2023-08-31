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

namespace Jgut\Mapping\Metadata;

use Jgut\Mapping\Driver\DriverFactoryInterface;
use Psr\SimpleCache\CacheInterface;

/**
 * @phpstan-type Source string|array{driver?: string|object, type?: string, path?: string|array<string>}
 */
class MetadataResolver
{
    /**
     * Driver factory.
     */
    protected DriverFactoryInterface $driverFactory;

    /**
     * Metadata cache.
     */
    protected ?CacheInterface $cache;

    public function __construct(DriverFactoryInterface $driverFactory, ?CacheInterface $cache = null)
    {
        $this->driverFactory = $driverFactory;
        $this->cache = $cache;
    }

    /**
     * @param array<Source> $mappingSources
     *
     * @return array<MetadataInterface>
     */
    public function getMetadata(array $mappingSources): array
    {
        $mappingSources = $this->normalizeMappingSources($mappingSources);

        $cacheKey = $this->getCacheKey($mappingSources);

        if ($this->cache !== null && $this->cache->has($cacheKey)) {
            $cachedMetadata = $this->cache->get($cacheKey);

            if (\is_array($cachedMetadata)) {
                /** @var array<MetadataInterface> $cachedMetadata */
                return $cachedMetadata;
            }
        }

        $metadata = array_map(
            function (array $mappingSource): array {
                return $this->driverFactory->getDriver($mappingSource)
                    ->getMetadata();
            },
            $mappingSources,
        );
        $metadata = \count($metadata) > 0 ? array_merge(...$metadata) : [];

        if ($this->cache !== null) {
            $this->cache->set($cacheKey, $metadata);
        }

        return $metadata;
    }

    /**
     * Get cache key.
     *
     * @param array<Source> $mappingSources
     */
    protected function getCacheKey(array $mappingSources): string
    {
        $key = implode(
            '.',
            array_map(
                static function (array $mappingSource): string {
                    $path = \is_array($mappingSource['path'])
                        ? implode('', $mappingSource['path'])
                        : $mappingSource['path'];

                    return $mappingSource['type'] . '.' . $path;
                },
                $mappingSources,
            ),
        );

        return sha1($key);
    }

    /**
     * Normalize mapping sources format.
     *
     * @param array<Source> $mappingSources
     *
     * @return array<Source>
     */
    protected function normalizeMappingSources(array $mappingSources): array
    {
        $defaultDriver = \PHP_VERSION_ID >= 80_000
            ? DriverFactoryInterface::DRIVER_ATTRIBUTE
            : DriverFactoryInterface::DRIVER_ANNOTATION;

        return array_map(
            static function ($mappingSource) use ($defaultDriver): array {
                if (!\is_array($mappingSource)) {
                    $mappingSource = [
                        'type' => $defaultDriver,
                        'path' => $mappingSource,
                    ];
                }

                return $mappingSource;
            },
            $mappingSources,
        );
    }
}
