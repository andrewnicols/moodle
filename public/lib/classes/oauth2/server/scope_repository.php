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

namespace core\oauth2\server;

use core\router\scope\abstract_scope;
use League\OAuth2\Server\Entities\ScopeEntityInterface;

/**
 * The OAuth2 scope repository.
 *
 * This repository is responsible for retrieving scope entities and finalizing scopes for access tokens.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class scope_repository implements \League\OAuth2\Server\Repositories\ScopeRepositoryInterface {
    /** @var null|array<string, string> */
    private static ?array $scopemap = null;

    #[\Override]
    public function getScopeEntityByIdentifier(string $identifier): ?ScopeEntityInterface {
        $scopemap = self::get_scope_map();
        if (array_key_exists($identifier, $scopemap)) {
            $classname = $scopemap[$identifier];
            return new $classname();
        }

        return null;
    }

    #[\Override]
    public function finalizeScopes(
        array $scopes,
        string $granttype,
        \League\OAuth2\Server\Entities\ClientEntityInterface $cliententity,
        string|null $useridentifier = null,
        ?string $authcodeid = null
    ): array {
        global $DB;

        if ($useridentifier === null) {
            // No user identifier means no user-specific scopes to filter.
            return $scopes;
        }

        $approvedscopes = $DB->get_field('oauth2_server_client_granted_scopes', 'scope', [
            'clientidentifier' => $cliententity->getIdentifier(),
            'userid' => $useridentifier,
        ]);

        foreach ($scopes as $key => $scope) {
            if (
                $approvedscopes === false
                || !in_array($scope->getIdentifier(), explode(' ', $approvedscopes), true)
            ) {
                unset($scopes[$key]);
            }
        }

        return $scopes;

        return array_map(
            fn (string $scopeidentifier): ?ScopeEntityInterface => $this->getScopeEntityByIdentifier($scopeidentifier),
            explode(' ', $scopes),
        );
    }

    /**
     * Create a scope entity from an identifier.
     *
     * @param string $identifier The scope identifier.
     * @return abstract_scope|null The scope entity, or null if not found.
     */
    final public static function from_identifier(string $identifier): ?abstract_scope {
        $scopemap = self::get_scope_map();

        if (!array_key_exists($identifier, $scopemap)) {
            return null;
        }

        $classname = $scopemap[$identifier];
        return new $classname();
    }

    /**
     * Get the map of scope identifiers to scope classes.
     *
     * @return array<string, class-string<abstract_scope>>
     */
    final public static function get_scope_map(): array {
        // TODO: Add caching layer here?
        if (self::$scopemap === null) {
            foreach (\core\component::get_component_names(true) as $componentname) {
                $scopes = \core\component::get_component_classes_in_namespace(
                    $componentname,
                    \route\scope::class,
                );
                foreach (array_keys($scopes) as $classname) {
                    if (
                        is_subclass_of($classname, abstract_scope::class)
                        && !self::is_abstract_class($classname)
                    ) {
                        self::$scopemap[$classname::get_qualified_name()] = $classname;
                    }
                }
            }
        }

        return self::$scopemap;
    }

    /**
     * Determine if a class is abstract.
     *
     * @param string $classname The class name
     * @return bool
     */
    private static function is_abstract_class(string $classname): bool {
        $reflection = new \ReflectionClass($classname);
        return $reflection->isAbstract();
    }
}
