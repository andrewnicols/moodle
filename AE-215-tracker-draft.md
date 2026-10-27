# AE-215 Tracker draft — fresh-slate user REST API

> **Working draft only.** Nothing in this proposal has been implemented. The previous AE-215 branch was discovery/prototyping; treat every endpoint below as new work. The attached `openapi.json` is a proposed contract for review, not evidence of implementation.

## Proposed title

Implement REST endpoints for user management

## Description

Design and implement REST endpoints for managing Moodle users through the new routing system. This work starts from a fresh slate: none of the endpoints in the attached OpenAPI schema have been created.

The endpoints should follow the Moodle REST style guide and Moodle's existing user lifecycle, visibility, authentication-plugin, capability and privacy rules. Deliver the API contracts, implementation, automated tests and developer documentation together. Do not expose account data or recovery outcomes to callers who are not entitled to see them.

### Proposed endpoints and features

| Method and path | Purpose and endpoint-specific features |
| --- | --- |
| `GET /user/users` | List visible users. Use the standard collection envelope (`items` and `pagination`) with 1-based page, configurable page size (default 25, maximum 100), search and sorting by supported name fields. Apply visibility and self-only restrictions before pagination. Return `hasMore` based on one extra visible row; `totalItems` may be `null` when an exact count is not calculated. No ETag is proposed for the collection. |
| `GET /user/users/{userId}` | Retrieve one visible user's core and profile representation. Accept `current`, a bare numeric ID, `idnumber:…` or `username:…`. Return `ETag`; support `If-None-Match` and `304 Not Modified`. Profile visibility rules apply; hidden or unavailable fields are represented as `null`, without revealing why. |
| `PATCH /user/users/{userId}` | Update supplied core or profile fields; omitted fields remain unchanged. Field-level capabilities, visibility rules, validation and authentication-plugin locks apply. Return the updated representation and ETag. Optional `If-Match` protects against stale writes and returns `412` on mismatch. |
| `GET /user/users/{userId}/custom-fields` | Retrieve visible custom profile fields keyed by configured shortname. Return `ETag`; support `If-None-Match` and `304`. |
| `PUT /user/users/{userId}/custom-fields` | Replace editable custom-field values: omitted editable fields are cleared, subject to required-field validation; non-editable fields remain unchanged. Return the representation and ETag. Optional `If-Match` returns `412` on mismatch. |
| `PATCH /user/users/{userId}/custom-fields` | Update only supplied custom-field values; omitted fields remain unchanged. Return the representation and ETag. Optional `If-Match` returns `412` on mismatch. |
| `POST /user/users` | Create a Moodle user, optionally with initial profile/custom-field values. Support explicit or generated passwords for password-managed authentication, with optional generated-credential email delivery. Save the account and supplied initial fields consistently. Return `201`, a `Location` for the user resource, and a non-secret creation receipt; never return a password. |
| `DELETE /user/users/{userId}` | Delete a user through Moodle's normal deletion lifecycle, with protections for guest, self and site-administrator accounts. Require unrestricted delete permission. Optional `If-Match` returns `412` on mismatch; success returns `204`. This is account deletion, not a GDPR erasure operation. |
| `PATCH /user/users/{userId}/password` | Set an explicit password for an eligible account using the supported authentication plugin and normal password policy. Administrative capability required; password is write-only and never returned. No ETag or conditional write. |
| `POST /user/users/{userId}/password-reset` | Administrative temporary-password generation. Replaces the password immediately, requires a change at next login, and optionally emails the credential. Return an immediate non-secret outcome; email failure does not undo the password change. No reset-history resource, result lookup or ETag. |
| `POST /user/password-reset` | Public password-recovery request using username or email. Return the same generic `202` response for account-dependent outcomes; do not disclose account existence, eligibility, identifiers, tokens or delivery results. Reuse Moodle's reset-token redemption flow and apply abuse protection. No authentication scope is required; explicitly mark the route unscoped while retaining its other protections. |

### Shared API behaviour

- Use RFC 9457 problem details. `400` is for malformed/uninterpretable requests; `422` is for well-formed input failing validation; `403` is for permissions and locked fields; `409` is for uniqueness conflicts; `412` is for stale `If-Match` conditions.
- Validation errors use `details: [{field, code, message}]`. Use stable application-specific `code` values where clients need to distinguish errors; preserve the meaning of the deprecated numeric `errorcode`.
- Reject unknown, read-only, null or otherwise invalid request properties rather than silently ignoring them. Keep request nullability independent from response nullability.
- Scope checks and Moodle capabilities are both applied. Self-scoped tokens are limited to the caller; visibility restrictions apply before returning representations, `hasMore` or any calculated total.
- Use `path_user` for user identifiers. Do not expose sensitive credentials, recovery tokens or account-specific public recovery outcomes.
- Apply the REST style guide's agreed idempotency policy to eligible requests, in coordination with AE-213; do not make unsupported retry-safety promises.
- Add route-level and supporting unit tests for success, permissions, visibility, validation, lifecycle side effects, conditional requests and privacy-sensitive outcomes.

### Proposed architecture

Implement the routes in the `core_user` API routing component using Moodle's route attributes and shared router facilities. Use the existing user path-parameter mapping for identifiers. Keep route methods thin: delegate visibility/representation, capability checks, validation, custom-field writes, account lifecycle and password operations to cohesive user-domain services.

Use the router's collection response/schema support for `GET /user/users`. Fetch one extra result after applying visibility and filters to calculate `hasMore`; `totalItems` is nullable when an exact count is not calculated. `GET /user/users/{userId}` returns the full visible user representation, including profile fields subject to Moodle visibility rules; collection items use the same `User` schema. Profile fields are updated through `PATCH /user/users/{userId}` alongside core fields, with field-level permission and validation rules. Use shared conditional-request handling for ETags on the individual user and custom-field representations, and optional `If-Match` on supported writes/deletion. Do not add ETags to collection or write-only password resources.

Define request and response schemas as named OpenAPI components, referenced by operations, so the full contracts are easy to inspect in Swagger UI. Keep examples at the operation level. Keep the attached OpenAPI document as the review baseline, then regenerate/update it from the implementation rather than treating the current hand-authored proposal as generated truth. Exercise the routes with router integration tests and test domain edge cases with focused unit tests.

## Blockers

- **REST style guide update:** [moodle/devdocs#1732 — Update REST Style Guide](https://github.com/moodle/devdocs/pull/1732) is open. The proposed endpoint contracts depend on the agreed guidance for mutation controls, nullability, validation/error shapes, singleton resources and public unscoped routes. Resolve this before finalising the contracts.

## Related work

- [AE-213 — Investigate Idempotency middleware](https://moodle.atlassian.net/browse/AE-213): coordinate retry/idempotency behaviour and document which operations support it. Related; not a blocker for all user endpoints.
- [AE-218 — Scope up rate limiting for endpoints which require it](https://moodle.atlassian.net/browse/AE-218): coordinate rate-limiting policy and response semantics, particularly for public password recovery; this work is not a blocker for the user endpoints.

## Proposed child issues for MDL-90030

Each child issue should be independently reviewable and deliver its route(s), contract/schema, tests and required documentation as one vertical slice. All paths are new; the attached OpenAPI file is discovery output only.

1. **List and retrieve users** — Implement `GET /user/users` and `GET /user/users/{userId}`. Deliver scoped/visibility-aware results, collection pagination/search/sort, nullable `totalItems`, `hasMore` and single-resource ETags/conditional GET.
2. **Update user accounts** — Implement `PATCH /user/users/{userId}` for core and profile fields, with field-level capabilities/auth-plugin locks, validation, optional `If-Match`, and the updated ETagged representation.
3. **Read and update custom profile fields** — Implement custom-field GET/PUT/PATCH, including editable-field filtering, replacement versus partial-update semantics, required/unique-field validation and conditional requests.
4. **Create user accounts** — Implement POST creation with initial profile/custom fields, supported authentication modes, explicit/generated password options, credential-email outcome handling, `201` receipt and `Location`.
5. **Delete user accounts** — Implement DELETE with scoped/capability checks, protected-account rules, normal Moodle deletion lifecycle, optional `If-Match` and `204`.
6. **Manage user passwords administratively** — Implement explicit password update and generated temporary-password operations, including password policy, authentication-plugin support, forced-change behaviour, session lifecycle and non-secret results.
7. **Request public password recovery** — Implement the generic public `POST /user/password-reset` flow, privacy-preserving responses and existing token redemption lifecycle. Coordinate rate-limit and abuse controls with AE-218; that work does not block this slice.

All slices depend on the REST style-guide decisions in PR #1732. AE-213 should be coordinated for request retry/idempotency policy; it does not block unrelated routes. Add no issues for work already done in the exploratory branch: treat all implementation and tests as new.

## OpenAPI attachment

Attach the proposed `openapi.json` as the review contract. Remove the existing `openapi.json` attachment uploaded by Andrew Lyons on 22 October 2026 before attaching this refreshed copy; leave attachments uploaded by other people untouched.
