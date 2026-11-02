# MDL-90234: List and retrieve users

## Parent and implementation baseline

[MDL-90030 — Implement a REST endpoint for a user](https://tracker.moodle.org/browse/MDL-90030).

The local `MDL-90234-main` branch is the implementation baseline for this slice.
The supplied built OpenAPI document was used to update the two GET operations in
`openapi.json`. Other operations in that file remain proposals for separate issues.
This is not a request to merge the broader AE-215 prototype.

## Endpoints

- `GET /user/users`: visible users in an `items`/`pagination` envelope. Apply visibility,
  search and self-only scope restrictions before pagination. Default page size is 25;
  maximum is 100. Sort by `firstname`/`lastname`, optionally prefixed with `-`.
  Default order is lastname, firstname, id; id is a tie-breaker only.
- `GET /user/users/{userId}`: one visible user's core representation. Use the existing
  `path_user` mapping for `current`, numeric IDs, `idnumber:…` and `username:…`.
  Return 404 for users the caller cannot see.

Both routes accept `core_user:user:read:self` or `core_user:user:read`, alongside
Moodle capability and visibility checks. Cookie and API-token authentication are
supported by the runtime; the supplied generated operations only list OAuth security.

## Shared user representation

Collection items and single-user responses share `core_user\route\schema\user_object`.
The planning OpenAPI retains the readable component names `User` and `UserCollection`.

| Fields | Schema parameter type |
| --- | --- |
| `id` | INT |
| `username` | USERNAME |
| `idnumber` | RAW |
| `fullName`, `firstName`, `lastName`, `firstNamePhonetic`, `lastNamePhonetic`, `middleName`, `alternateName` | NOTAGS |
| `email` | EMAIL |
| `city`, `institution`, `department`, `address` | TEXT |
| `country` | ALPHA (ISO 3166-1 alpha-2) |
| `phone`, `mobilePhone` | NOTAGS (`phone1` and `phone2` respectively) |
| `description` | RAW (formatted content from the user-details API) |
| `descriptionFormat` | INT (format of the returned description) |
| `lang` | LANG |
| `auth` | AUTH |
| `confirmed`, `suspended`, `deleted` | BOOL |
| `profileImageUrl`, `profileImageUrlSmall` | URL |
| `profileImageAlt` | TEXT |
| `timeZone`, `timeZonePreference` | TIMEZONE |

Hidden or unavailable values are explicit nulls. Visibility is delegated to
`core\user::get_user_details()`. Names follow the configured full-name format and
`moodle/site:viewfullnames`; language, confirmation and authentication are available
to self or viewers with `moodle/user:viewalldetails`. Idnumber also follows the
configured identity-field rules. Email follows Moodle's email-display and visibility rules.

Standard profile fields are top-level properties in both single-user responses and
collection items. Preserve the user-details helper's hidden-field, identity-field and
course-context visibility rules. In particular, self access alone does not grant phone
identity-field visibility. Preserve formatted description content and its corresponding
format. The helper omits some empty values, which are returned as null; it preserves
other readable empty values, such as an empty department.

`lang` is the stored Moodle language preference, not the effective page language.
`auth` identifies the account's authentication plugin, not the request's authentication
method. `confirmed` is account confirmation, not a universal email-verification claim.
Deleted users remain excluded, so returned users currently have `deleted: false`.

`timeZone` is the effective IANA tz database name (BCP 175 / RFC 6557), including any
forced site timezone. `timeZonePreference` is the normalised stored preference, null
for the server default (`99`). Legacy offsets are normalised, e.g. `8.0` becomes
`Etc/GMT-8`. Both fields are null when hidden.

`firstAccess` and `lastAccess` are excluded. Custom profile fields, creation and
mutation belong to separate issues, not this read slice.

## Conditional requests and pagination

Single-user GET emits ETag and supports If-None-Match with an empty 304 response.
The collection does not emit ETag or support conditional GET.

Reusable referenced header schemas live in `core\router\schema\parameters`:
`etag`, `if_none_match`, and `if_match`. Preserve literal double quotes in supplied
tags. Shared parsing supports weak tags, lists, quoted commas and `*` alone.
Malformed headers throw `invalid_parameter_exception`; If-None-Match uses weak
comparison, whereas If-Match uses strong comparison and rejects non-matches with 412.
The precomputed ETag is reused rather than hashing the representation twice.

Pagination always returns page, pageSize, totalItems and hasMore. This implementation
returns null totalItems and determines hasMore by fetching an extra row.

## Architecture and relevant files

- `public/user/classes/route/api/users.php`: thin read handlers; set PAGE's system
  context before picture URL generation.
- `public/user/classes/local/visible_user_finder.php`: instance service injecting
  `core\dml\database_proxy` and `core\current_user`, rather than an arbitrary viewer.
- `public/user/classes/local/user_representation.php`: instance representation builder.
- `public/user/classes/local/user_scope_check_trait.php`: read/self scope enforcement
  using the injected current user.
- `public/user/classes/route/schema/user_object.php`: shared referenced user schema.
- `public/user/classes/route/responses/user_response.php` and
  `user_collection_response.php`: single-user and collection response contracts.
- `public/lib/classes/router/pagination_request.php`, schema collection attribute,
  collection response/object, conditional_request and etag attribute: shared primitives.
- `public/lib/classes/router/schema/parameters/{etag,if_match,if_none_match}.php`:
  referenced header components.
- `public/lib/classes/current_user.php` and `public/lib/classes/dml/database_proxy.php`:
  injectable live accessors for current-user/database state.

Core helpers still consult global current-user state internally. Injecting these
services does not yet make the whole visibility path work for arbitrary viewers.

## Acceptance criteria

These remain review/verification criteria, not claims that every item has passed.

- [ ] Both GET endpoints match the updated local OpenAPI contract.
- [ ] Collection and single-user GET share the same user fields and visibility rules.
- [ ] Visibility, search and read:self restrictions cannot leak other users through
  results, pagination metadata or conditional responses.
- [ ] Pagination validates page >= 1, pagesize 1–100 and supported sort fields;
  totalItems is null when not calculated and hasMore reflects another visible result.
- [ ] Identifier forms resolve consistently; invisible users return 404.
- [ ] Response tests cover idnumber, language, confirmation/auth visibility, additional
  names and image alt; access timestamps and custom profile fields are absent.
- [ ] Both read responses include city, country, institution, department, phone,
  mobilePhone, address, description and descriptionFormat, preserving self, authorised,
  restricted-viewer and course-context visibility rules, formatted content and empty/null values.
- [ ] Timezone tests cover explicit zones, server default, legacy offsets, hidden values
  and a forced site timezone while preserving the stored preference.
- [ ] ETag is documented on single-user 200 responses and preserved on 304 responses;
  the collection has no ETag. Changes to visible standard profile values change the
  single-user representation's ETag.
- [ ] Conditional-header tests cover quoted tags, weak/strong comparison, lists,
  wildcard and malformed syntax with invalid_parameter_exception.
- [ ] Header component references resolve and quoting guidance is visible in Swagger UI.
- [ ] Profile-picture URLs work without pre-existing PAGE context in web requests.
- [ ] OpenAPI accurately documents nullable fields and required properties.
  **Known gap:** the supplied generated User schema uses plain scalar types even
  though runtime fields may be null, and omits required-property declarations.
- [ ] Collection response is a named reusable schema.
  **Known gap:** generated output inlines the collection; local openapi.json extracts
  the exact shape as UserCollection for review.
- [ ] Authentication documentation reflects supported OAuth, API-token and cookie
  flows; generated operation security currently lists only OAuth alternatives.
- [ ] GET responses are not persisted in idempotency replay storage.
- [ ] Runtime tests and developer documentation accompany the read slice.

## Dependencies and related work

Retain review of MDL-90104, MDL-89850, moodle/devdocs#1732 and MDLSITE-7035.
AE-213 is related non-blocking idempotency work. CamelCase path parameter names
are intentional because route injection matches `{userId}` by name.
