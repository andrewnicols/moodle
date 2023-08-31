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

namespace Jgut\Mapping\Driver\Locator;

use Jgut\Mapping\Exception\DriverException;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use RecursiveRegexIterator;
use RegexIterator;

class FileLocator
{
    /**
     * @var array<string>
     */
    protected array $paths = [];

    /**
     * @var array<string>
     */
    protected array $extensions;

    /**
     * @param array<string> $paths
     * @param array<string> $extensions
     */
    public function __construct(array $paths, array $extensions)
    {
        $this->paths = $paths;
        $this->extensions = $extensions;
    }

    /**
     * @return array<string>
     */
    public function getPaths(): array
    {
        return $this->paths;
    }

    /**
     * Get supported file extensions.
     *
     * @return array<string>
     */
    public function getExtensions(): array
    {
        return $this->extensions;
    }

    /**
     * @throws DriverException
     *
     * @return array<string>
     */
    public function getMappingFiles(): array
    {
        $mappingPaths = [];

        foreach ($this->paths as $mappingPath) {
            if (is_dir($mappingPath)) {
                $mappingPaths[] = $this->getFilesFromDirectory($mappingPath);
            } elseif (is_file($mappingPath)) {
                $mappingPaths[] = [$mappingPath];
            } else {
                throw new DriverException(sprintf('Path "%s" does not exist.', $mappingPath));
            }
        }

        return \count($mappingPaths) > 0 ? array_merge(...$mappingPaths) : [];
    }

    /**
     * @return array<string>
     */
    protected function getFilesFromDirectory(string $mappingDirectory): array
    {
        $mappingPaths = [];

        $filePattern = sprintf('/^.+\.(%s)$/i', implode('|', $this->extensions));
        $recursiveIterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($mappingDirectory));
        $regexIterator = new RegexIterator($recursiveIterator, $filePattern, RecursiveRegexIterator::GET_MATCH);

        /** @var array<string> $mappingFile */
        foreach ($regexIterator as $mappingFile) {
            $mappingPaths[] = $mappingFile[0];
        }

        sort($mappingPaths);

        return $mappingPaths;
    }
}
