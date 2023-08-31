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

use Doctrine\Common\Annotations\Reader;

abstract class AbstractAnnotationDriver extends AbstractClassDriver
{
    protected Reader $annotationReader;

    /**
     * @param array<string> $paths
     */
    public function __construct(array $paths, Reader $annotationReader)
    {
        if (\PHP_VERSION_ID >= 80_000) {
            @trigger_error('Annotations are deprecated. Use PHP Attributes instead.', \E_USER_DEPRECATED);
        }

        parent::__construct($paths);

        $this->annotationReader = $annotationReader;
    }
}
