# MDL-90030 child issue draft: List and retrieve users

## Parent

[MDL-90030 — Implement a REST endpoint for a user](https://tracker.moodle.org/browse/MDL-90030)

## What to build

Create the user collection and single-user read endpoints:

- `GET /user/users`: return visible users in the standard `items`/`pagination` envelope, with page, page size, search and sorting.
- `GET /user/users/{userId}`: return one visible user's core and profile representation. Profile fields remain subject to Moodle visibility rules.

This is new work. The [AE-215 branch](https://github.com/andrewnicols/moodle/tree/AE-215) is a proof of concept for pagination, visibility filtering, scopes, path mapping and ETags—not an implementation to merge.

### Decisions and constraints

- Apply visibility and self-only restrictions before pagination. `totalItems` is nullable and may be `null` when an exact count is not calculated; `hasMore` is always returned and is determined by fetching one extra visible result. Default page size is 25; maximum is 100. Sort by `firstname`/`lastname`, with `lastname, firstname, id` as the default order and `id` only as a tie-breaker.
- Use the existing `\core\router\parameters\path_user` class for `{userId}`; do not add a new resolver. It accepts `current`, a bare numeric ID, `idnumber:…` or `username:…`. Return `404` for users the caller cannot see.
- The single-user GET returns an `ETag`; `If-None-Match` may return `304`. The collection has no ETag. Add a reusable `header_if_none_match` request parameter following `\core\router\parameters\header_language` (extends `\core\router\schema\parameters\header_object` and implements `referenced_object`) and a reusable `header_etag` response-header schema (extends the response `header_object` and implements `referenced_object`). Keep the design reusable for subsequent conditional-write endpoints (`If-Match`).
- Return hidden or unavailable representation fields as explicit `null`; do not distinguish the reasons. Readable empty strings remain empty strings.
- Use the same `User` representation for collection items and the single-user response, including visible profile fields. Apply Moodle visibility rules to each returned user.
- Use the standard RFC 9457 errors: `400` for malformed requests, `422` for well-formed invalid parameters, and `401`/`403`/`404` as applicable.
- These are safe, read-only GETs and do not need idempotency replay storage. Ensure responses from these routes are not persisted by the idempotency middleware; use its endpoint-exclusion mechanism if required.

### Shared router infrastructure in scope

This is the first child issue in the chain. It must establish the shared router primitives needed by this and later user endpoints; their availability is part of this issue, not a prerequisite or an assumed dependency.

- Create `\core\router\pagination_request` to provide validated page, page-size, and sort values to collection handlers.
- Create `\core\router\schema\response\collection_response` to produce the standard `items`/`pagination` envelope, including nullable `totalItems` and required `hasMore`.
- Create `\core\router\conditional_request` to generate and check ETags, handle `If-None-Match`/`If-Match`, return `304` for matching conditional GETs, and return `412` for stale conditional writes. This slice exercises conditional GET; later write endpoints reuse the shared support.
- Create the reusable `#[collection]` and `#[etag]` route attributes, including request validation/route metadata and generated OpenAPI documentation. These attributes do not yet exist; creating them is part of this first issue, not reuse of existing infrastructure.
- Add automated tests for these shared behaviors as part of the core router test suite.

The implementation should make these primitives reusable outside the user routes. Do not defer their creation to another child issue or record them as blockers.

### Style-guide alignment

Follow the proposed REST style-guide updates in [moodle/devdocs#1732](https://github.com/moodle/devdocs/pull/1732), especially response nullability and the `400`/`422` boundary.

CamelCase PHP variables such as `$userId` are intentional for path parameters: router injection matches the argument name to `{userId}`. This is not a problem to work around; it follows the new REST style guide and aligns with proposed Moodle coding-style changes being worked on in [MDLSITE-7035](https://tracker.moodle.org/browse/MDLSITE-7035).

### Blockers

- [MDL-90104](https://tracker.moodle.org/browse/MDL-90104)
- [MDL-89850](https://tracker.moodle.org/browse/MDL-89850)
- [moodle/devdocs#1732](https://github.com/moodle/devdocs/pull/1732)
- [MDLSITE-7035](https://tracker.moodle.org/browse/MDLSITE-7035)

### Related (non-blocking)

- [AE-213](https://tracker.moodle.org/browse/AE-213)

### Relevant OpenAPI contract

Excerpt from the proposed AE-215 `openapi.json` (abbreviated to the fields and response behavior relevant to this slice):

```yaml
GET /user/users:
  security:
    - oauth2: [core_user:user:read:self]
    - oauth2: [core_user:user:read]
    - api_key: []
    - cookie: []
  parameters:
    - {name: page, in: query, schema: {type: integer, minimum: 1, default: 1}}
    - {name: pagesize, in: query, schema: {type: integer, minimum: 1, maximum: 100, default: 25}}
    - {name: search, in: query, schema: {type: string}}
    - name: sort
      in: query
      schema:
        type: string
        pattern: '^-?(firstname|lastname)(,-?(firstname|lastname))*$'
  responses:
    '200':
      content:
        application/json:
          schema: {$ref: '#/components/schemas/UserCollection'}

GET /user/users/{userId}:
  security:
    - oauth2: [core_user:user:read:self]
    - oauth2: [core_user:user:read]
    - api_key: []
    - cookie: []
  parameters:
    - name: userId
      in: path
      required: true
      description: Resolved by `\core\router\parameters\path_user`.
      schema: {type: string}
    - {$ref: '#/components/parameters/IfNoneMatch'}
  responses:
    '200':
      headers:
        ETag: {$ref: '#/components/headers/ETag'}
      content:
        application/json:
          schema: {$ref: '#/components/schemas/User'}
    '304': {$ref: '#/components/responses/core--router--response--not_modified_response'}
    '400': {$ref: '#/components/responses/core--router--response--invalid_parameter_response'}
    '401': {$ref: '#/components/responses/Unauthenticated'}
    '403': {$ref: '#/components/responses/Forbidden'}
    '404': {$ref: '#/components/responses/core--router--response--not_found_response'}
    '422': {$ref: '#/components/responses/ValidationFailure'}
```

    New schemas introduced by these endpoints:

    ```yaml
    components:
      schemas:
        UserCollection:
          type: object
          required: [items, pagination]
          properties:
            items:
              type: array
              items: {$ref: '#/components/schemas/User'}
            pagination: {$ref: '#/components/schemas/Pagination'}
        Pagination:
          type: object
          required: [page, pageSize, totalItems, hasMore]
          properties:
            page: {type: integer}
            pageSize: {type: integer}
            totalItems:
              type: [integer, 'null']
              description: Exact collection size when calculated; otherwise null.
            hasMore:
              type: boolean
              description: Whether another visible result exists after this page.
        User:
          type: object
          required:
            - id
            - username
            - fullName
            - firstName
            - lastName
            - email
            - profileImageUrl
            - profileImageUrlSmall
            - timeZone
            - suspended
            - firstAccess
            - lastAccess
            - city
            - country
            - institution
            - department
            - phone
            - mobilePhone
            - address
            - description
            - descriptionFormat
          properties:
            id: {type: integer}
            username: {type: [string, 'null'], description: Null when hidden or unavailable.}
            fullName: {type: string}
            firstName: {type: [string, 'null'], description: Null when hidden or unavailable.}
            lastName: {type: [string, 'null'], description: Null when hidden or unavailable.}
            email: {type: [string, 'null'], description: Null when hidden or unavailable.}
            profileImageUrl: {type: [string, 'null'], description: Null when hidden or unavailable.}
            profileImageUrlSmall: {type: [string, 'null'], description: Null when hidden or unavailable.}
            timeZone: {type: [string, 'null'], description: Null when hidden or unavailable.}
            suspended: {type: [boolean, 'null'], description: Null when hidden or unavailable.}
            firstAccess:
              type: [string, 'null']
              format: date-time
              description: Null when hidden or unavailable.
            lastAccess:
              type: [string, 'null']
              format: date-time
              description: Null when hidden or unavailable.
            city: {type: [string, 'null'], description: Null when hidden or unavailable.}
            country: {type: [string, 'null'], description: Null when hidden or unavailable.}
            institution: {type: [string, 'null'], description: Null when hidden or unavailable.}
            department: {type: [string, 'null'], description: Null when hidden or unavailable.}
            phone: {type: [string, 'null'], description: Null when hidden or unavailable.}
            mobilePhone: {type: [string, 'null'], description: Null when hidden or unavailable.}
            address: {type: [string, 'null'], description: Null when hidden or unavailable.}
            description: {type: [string, 'null'], description: Null when hidden or unavailable.}
            descriptionFormat: {type: [integer, 'null'], description: Null when hidden or unavailable.}
      parameters:
        IfNoneMatch:
          name: If-None-Match
          in: header
          required: false
          description: >
            An optional ETag previously returned for this user. If it matches the
            current representation, the server returns an empty 304 response.
          schema:
            type: string
      headers:
        ETag:
          description: >
            Strong entity tag for the returned user representation. Send this value
            in If-None-Match to make a subsequent GET conditional.
          required: true
          schema:
            type: string
    ```

    These are the new named schemas and header components relevant to this issue; standard error responses and other existing router schemas are referenced but not redefined here. `UserCollection.items` and the single-user response both use the same `User` schema, including visible profile fields. The excerpt is illustrative; operation request/response bodies should reference named schemas under `components.schemas`, not inline object shapes. The `IfNoneMatch` parameter and `ETag` response header are proposed reusable OpenAPI components backed by router schema classes, following `header_language`.

### Proposed files and classes

The component directory is `public/user` (`core_user`). Route classes are auto-discovered; no route registration file is needed.

| File | Class | Responsibility |
| --- | --- | --- |
| `public/lib/classes/router/pagination_request.php` | `core\router\pagination_request` | **Create as shared core infrastructure in this issue.** Expose validated page, page size, sort order, and offset/limit helpers for collection handlers. |
| `public/lib/classes/router/schema/response/collection_response.php` | `core\router\schema\response\collection_response` | **Create as shared core infrastructure in this issue.** Return the standard collection envelope with nullable `totalItems` and required `hasMore`. |
| `public/lib/classes/router/conditional_request.php` | `core\router\conditional_request` | **Create as shared core infrastructure in this issue.** Generate/check ETags and support conditional GET and future conditional writes. |
| `public/lib/classes/router/schema/collection.php` | `core\router\schema\collection` | **Create as a new route attribute in this issue.** Declare collection pagination/sort parameters, validation and OpenAPI metadata. |
| `public/lib/classes/router/schema/etag.php` | `core\router\schema\etag` | **Create as a new route attribute in this issue.** Declare conditional request headers and ETag/304/412 response documentation for routes. |
| `public/user/classes/route/api/users.php` | `core_user\route\api\users` | Route prefix `/users`; `list_users()` handles `GET /user/users`, and `get_user()` handles `GET /user/users/{userId}`. |
| `public/user/classes/local/visible_users.php` | `core_user\local\visible_users` | Apply caller visibility and search in the query; return the requested page and `hasMore` using one extra row. |
| `public/user/classes/local/user_representation.php` | `core_user\local\user_representation` | Build the core user JSON representation, including explicit nulls for hidden/unavailable fields. |
| `public/user/classes/local/user_scope_check_trait.php` | `core_user\local\user_scope_check_trait` | Enforce `read` versus `read:self` for collection and single-user reads. |
| `public/user/classes/route/scope/user/read.php` | `core_user\route\scope\user\read` | Declare the site-wide user-read token scope. |
| `public/user/classes/route/scope/user/read_self.php` | `core_user\route\scope\user\read_self` | Declare the self-only user-read token scope. |
| `public/user/classes/route/responses/user_collection_response.php` | `core_user\route\responses\user_collection_response` | Describe the collection envelope, referencing the same user representation used by the single-user response. |
| `public/user/classes/route/responses/user_response.php` | `core_user\route\responses\user_response` | Describe the shared user schema, including core and visible profile fields, used by collection items and the single-user response. |
| `public/lib/classes/router/parameters/header_if_none_match.php` | `core\router\parameters\header_if_none_match` | Reusable optional request-header parameter, following `header_language`; implements `referenced_object`. |
| `public/lib/classes/router/schema/header_etag.php` | `core\router\schema\header_etag` | Reusable response `ETag` header object; implements `referenced_object` so it is emitted under OpenAPI `components.headers`. |
| `public/user/tests/route/api/users_test.php` | `core_user\route\api\users_test` | Route integration tests for collection, scope, visibility, identifiers and conditional GET. |
| `public/lib/tests/router/collection_test.php` | — | Test the new collection attribute, pagination parsing and response envelope, nullable totals, and `hasMore`. |
| `public/lib/tests/router/schema/collection_test.php` | — | Test the new `#[collection]` attribute's route metadata, validation and generated OpenAPI. |
| `public/lib/tests/router/schema/etag_test.php` | — | Test the new `#[etag]` attribute's route metadata and generated OpenAPI headers/responses. |
| `public/lib/tests/router/conditional_request_test.php` | — | Test ETag generation, `If-None-Match` matching/non-matching behavior and conditional responses; cover `If-Match` for later reuse. |
| `public/lib/tests/router/parameters/header_if_none_match_test.php` | — | Validate the optional header parameter and its reusable OpenAPI reference. |
| `public/lib/tests/router/schema/header_etag_test.php` | — | Verify the response-header schema and generated component reference. |

Reuse existing core classes rather than adding duplicates: `\core\router\parameters\path_user` for `{userId}` and the core `query_parameter` for `search`. This issue creates the `#[collection]` and `#[etag]` route attributes as well as the `pagination_request`, `collection_response` and `conditional_request` shared runtime classes listed above. No new user path-parameter class is needed. The header class names above are proposals; align them with existing naming conventions during implementation.

## Deliverables

- Both read routes, their named request/response schemas and generated OpenAPI documentation.
- The proposed router header classes and their reusable OpenAPI components.
- The shared `#[collection]` and `#[etag]` attributes, `pagination_request`, `collection_response` and `conditional_request` router infrastructure, with core tests, for reuse by later user endpoint issues.
- Visibility- and scope-aware collection query with pagination, search and sorting.
- ETag/conditional GET for the single-user resource.
- Confirmation that neither read route persists responses in idempotency replay storage; add explicit endpoint exclusions if the middleware would otherwise capture them.
- Route tests covering collection boundaries, self-only scope, visibility/404 behavior, identifier forms, null fields and `If-None-Match`.

## Acceptance criteria

- [ ] Both endpoints return the documented schemas and error responses.
- [ ] Collection visibility and filters are applied before pagination; an extra visible result determines `hasMore`; page size is constrained to 1–100.
- [ ] Collection items and the single-user endpoint use the same named `User` schema, including profile fields subject to visibility rules.
- [ ] `totalItems` is an exact integer when calculated and `null` otherwise; self-only callers cannot infer other users from results or pagination metadata.
- [ ] Single-user GET returns an ETag and matching `If-None-Match` returns bodyless `304`; collection responses have no ETag.
- [ ] ETag and If-None-Match header classes are reusable and appear as documented OpenAPI components.
- [ ] This issue creates and tests the `#[collection]` and `#[etag]` attributes plus shared `pagination_request`, `collection_response` and `conditional_request` support; subsequent user endpoint issues can reuse them without separate prerequisite work.
- [ ] Responses from these GET routes are not stored for idempotent replay.
- [ ] OpenAPI generation documents the user path parameter and response nullability correctly.
- [ ] Request and response body schemas are named reusable components, not inline object schemas.
- [ ] CamelCase path-parameter variable naming is used intentionally and follows the REST style guide.
