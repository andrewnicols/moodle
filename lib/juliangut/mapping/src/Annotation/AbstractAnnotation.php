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

namespace Jgut\Mapping\Annotation;

use Jgut\Mapping\Exception\AnnotationException;
use ReflectionClass;
use ReflectionProperty;
use Traversable;

abstract class AbstractAnnotation
{
    protected const DEFAULT_ANNOTATION_PROPERTY = 'value';

    /**
     * @param array<string, mixed>|Traversable<string, mixed>|mixed $parameters
     *
     * @throws AnnotationException
     */
    public function __construct($parameters)
    {
        if (!\is_array($parameters) && !$parameters instanceof Traversable) {
            throw new AnnotationException('Annotation parameters must be an iterable.');
        }
        if ($parameters instanceof Traversable) {
            $parameters = iterator_to_array($parameters);
        }

        $defaultProperty = $this->getDefaultProperty();
        /** @var array<string, mixed> $parameters */
        $properties = $this->getAnnotationProperties($parameters, $defaultProperty);

        foreach ($properties as $property) {
            if (\array_key_exists($property, $parameters)) {
                $method = $property === self::DEFAULT_ANNOTATION_PROPERTY && $defaultProperty !== null
                    ? 'set' . ucfirst($defaultProperty)
                    : 'set' . ucfirst($property);

                if (!method_exists($this, $method)) {
                    throw new AnnotationException(sprintf('Annotation property setter "%s" does not exist.', $method));
                }

                /** @var callable $callback */
                $callback = [$this, $method];

                $callback($parameters[$property]);
            }
        }
    }

    /**
     * Get annotation properties.
     *
     * @param array<string, mixed> $parameters
     *
     * @throws AnnotationException
     *
     * @return array<string>
     */
    private function getAnnotationProperties(array $parameters, ?string $defaultProperty): array
    {
        $properties = array_map(
            static fn(ReflectionProperty $property): string => $property->getName(),
            (new ReflectionClass($this))->getProperties(),
        );

        if ($defaultProperty !== null) {
            if (!\in_array($defaultProperty, $properties, true)) {
                throw new AnnotationException(
                    sprintf('Default annotation property "%s" does not exist.', $defaultProperty),
                );
            }

            $properties[] = self::DEFAULT_ANNOTATION_PROPERTY;
        }

        $unknownProperties = array_diff(array_keys($parameters), $properties);
        if (\count($unknownProperties) > 0) {
            throw new AnnotationException(
                sprintf(
                    'The following annotation properties are not recognized: %s.',
                    implode(', ', $unknownProperties),
                ),
            );
        }

        return $properties;
    }

    /**
     * Get default annotation property.
     */
    protected function getDefaultProperty(): ?string
    {
        return null;
    }
}
