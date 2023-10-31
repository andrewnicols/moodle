<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

declare(strict_types=1);

namespace core\router;

use Invoker\Invoker;
use Invoker\ParameterResolver\AssociativeArrayResolver;
use Invoker\ParameterResolver\Container\TypeHintContainerResolver;
use Invoker\ParameterResolver\DefaultValueResolver;
use Invoker\ParameterResolver\ResolverChain;
use Psr\Container\ContainerInterface;
use DI\Bridge\Slim\ControllerInvoker;

/**
 * This factory creates a Slim application correctly configured with PHP-DI.
 *
 * To use this, replace `Slim\Factory\AppFactory::create()`
 * with `DI\Bridge\Slim\Bridge::create()`.
 */
class bridge extends \DI\Bridge\Slim\Bridge {
    protected static function createControllerInvoker(ContainerInterface $container): ControllerInvoker {
        $resolvers = [
            // Inject parameters by name first.
            new AssociativeArrayResolver(),

            // Then inject services by type-hints for those that weren't resolved.
            new TypeHintContainerResolver($container),

            // Then fall back on parameters default values for optional route parameters.
            new DefaultValueResolver(),
        ];

        $invoker = new Invoker(new ResolverChain($resolvers), $container);

        return new controller_invoker(
            $container,
            $invoker,
        );
    }
}
