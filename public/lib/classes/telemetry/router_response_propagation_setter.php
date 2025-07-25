<?php

declare(strict_types=1);

namespace core\telemetry;

use OpenTelemetry\Context\Propagation\PropagationSetterInterface;
use Psr\Http\Message\ResponseInterface;
use function assert;

/**
 * @internal
 * @todo when response propagation spec is accepted, this can move into core as a generic PSR-7 implementation
 */
final class router_response_propagation_setter implements PropagationSetterInterface {
    /** @psalm-suppress PossiblyUnusedMethod */
    public function keys($carrier): array {
        assert($carrier instanceof ResponseInterface);

        return array_keys($carrier->getHeaders());
    }

    #[\Override]
    public function set(&$carrier, string $key, string $value): void {
        assert($carrier instanceof ResponseInterface);

        $carrier = $carrier->withHeader($key, $value);
    }
}
