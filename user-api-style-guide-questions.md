# User creation: REST API style-guide questions

The AE-215 proof of concept exposes a gap between useful account-provisioning
options and the guide's requirement for declarative mutation payloads.

References below are to `docs/guides/rest/style.md` in the devdocs repository.

## Current contract

| Field | Purpose | Assessment |
| --- | --- | --- |
| `password` | Supply an explicit initial password. | Declarative, write-only credential input. |
| `generatePassword` | Generate an initial password and require a change at first login. | A processing instruction rather than final user state. |
| `sendPasswordEmail` | Send or suppress the generated-password email. | Controls a side effect rather than user state. |
| `credentialEmailStatus` | Report `sent`, `failed`, or `notRequested`. | Provisioning-result metadata, not a persistent user attribute. |

The field names follow the camelCase convention in section 9.1. The concern is
their semantics, not their spelling.

## Declarative payload rules

- **Section 11.6** requires POST, PUT and PATCH payloads to contain exclusively
  final resource-state attributes, not execution routines or transition commands.
- **Section 11.7** reinforces declarative mutations and rejects procedural action
  flags.

Under the current wording, `generatePassword` and `sendPasswordEmail` do not fit
the user-resource mutation body. Renaming them or nesting them under `options`
would not change that.

## Would headers or query parameters solve this?

**Not automatically, but headers are not subject to exactly the same explicit
prohibition.** Section 11.6 specifically addresses mutation payload objects.
Request headers can legitimately describe processing preferences; they need not
be persistent resource attributes.

Moving these options to headers would therefore avoid the literal payload rule,
but would not, by itself, establish an approved design:

- The guide does not define a general convention for these provisioning options
  in headers or query parameters.
- Their side effects, defaults, validation and failure behaviour still need a
  consistent contract.
- Section 11.4 permits query modifiers or request metadata for source assets in
  cloning/import operations. That is a specific pattern, not a general permission
  for arbitrary execution flags.
- The standard HTTP `Prefer` header is a possible mechanism for processing
  preferences, but it does not define password generation or credential-email
  preferences. Using it here would require a deliberately specified extension,
  including whether the server may ignore the preference.

The semantic design question remains wherever the options are placed. Headers
are a possible solution to define in the guide, not inherently forbidden and not
an automatic compliance workaround.

### Why not put the creation modifiers in query parameters?

`generatePassword` and `sendPasswordEmail` could technically be query
parameters on `POST /user/users`; HTTP does not prohibit query parameters on a
POST. This would keep them out of the JSON resource representation, but would
not make them declarative or settle the style-guide question: they still control
how creation is processed, and their defaults, compatibility, errors and
side-effects need to be specified.

Keep them with the creation request body for now because they form one logical,
validated account-provisioning request with the account and initial fields.
Splitting one operation across URL and body makes the contract less cohesive
and can complicate client construction and auditing. URLs are also commonly
captured in proxy and access logs, so the body is the less surprising place for
processing choices; the password itself must never be placed in the URL.
`Prefer` could express processing preferences, but using it for credential
generation or email delivery would require defining custom preference tokens
and whether the server may ignore them.

This is a design preference, not an HTTP prohibition. If the REST style guide
establishes query parameters or a `Prefer` extension as its standard for
creation-time controls, the location can be revisited without changing their
semantics. Whichever location is chosen, reject incompatible combinations
(for example, explicit and generated passwords together) instead of silently
ignoring them.

## Creation response

**Section 11.3** requires a `201 Created` response containing:

- A `Location` header.
- The created resource representation.

The draft provides `Location`, but returns a minimal `{id, username}` receipt,
plus optional email status, rather than the normal user representation.

We need to decide whether creation returns the representation appropriate to the
caller's permissions, or whether the guide should explicitly allow a creation
receipt. Creation should not silently acquire an additional read-scope
requirement just to construct its response.

## Behaviour to preserve

- Support explicit or generated passwords where the authentication mechanism
  uses Moodle-managed credentials.
- Allow credential-email suppression for bulk provisioning.
- Never return passwords.
- Validate and save account, profile and custom fields atomically.
- Send email only after account creation; email cannot be made atomic with the
  database transaction.
- Report email failure explicitly without pretending the account was rolled back
  or encouraging a repeated POST to resend credentials.
- Distinguish mail-transport acceptance from guaranteed inbox delivery.

## Options for the guide

1. **Define creation-time processing options.** Establish an explicit convention
   for non-resource controls, including their location, defaults, whether they
   are mandatory instructions or ignorable preferences, and side-effect results.
2. **Model provisioning as a resource.** Represent credential generation/delivery
   through a provisioning request or job with its own state and result. This is
   more explicit but adds lifecycle and endpoint complexity.
3. **Keep user creation strictly declarative.** Handle credential provisioning
   separately. This keeps the user endpoint simple but requires another workflow
   to meet the generated-password and bulk-creation requirements.

## Proposed resolution

The devdocs proposal now distinguishes three cases:

- **Resource state:** use ordinary mutations for persistent attributes. An
  explicit password remains a dedicated write-only subresource because its
  authorization and lifecycle differ from ordinary user-field updates.
- **Processing controls:** allow documented notification controls on mutations
  and one-time initialisation controls on creation. Define applicability,
  defaults, validation, side effects, failures and retry behaviour. Do not
  silently ignore incompatible options.
- **Distinct workflows:** use a meaningful resource for repeat-sensitive
  operations such as generating a replacement password for an existing account.

The creation representation may be permission-limited, including identifiers
and caller-supplied values, without requiring an additional read scope.
Processing-result metadata must be distinguished from stored user attributes.

## User resource boundaries

Use `GET /user/users/{userId}` for the canonical user representation, including
profile fields visible to the caller. Hidden or unavailable fields are `null`;
the collection and single-user response use the same `User` schema.

Keep setting an explicit password on
`PATCH /user/users/{userId}/password`, not in the ordinary user PATCH body.
Although a password is supplied as desired state, the operation has a distinct
security and lifecycle contract:

- It requires administrative authorization; self-update scope alone is
  insufficient.
- It is write-only. The secret must not appear in the user representation,
  response, or ordinary user-update result.
- It invokes password-policy and authentication-plugin handling and may
  invalidate sessions. It has no user-resource ETag or `If-Match` semantics.
- Keeping it separate prevents ordinary user-update permissions, validation,
  auditing, or future representation changes from implicitly authorizing or
  handling credential changes.

Keep generated temporary-password reset separate from explicit password
setting. It generates a new credential, requires a change at next login, may
send an email, and repeating the request performs another password change.
Public password recovery is a third workflow: it does not change credentials
until the user redeems Moodle's existing reset link and must not reveal
account-specific outcomes.

### Other endpoint boundaries to consider

- **Profile fields:** update them through `PATCH /user/users/{userId}`,
  matching the canonical user representation, with field-level authorization,
  validation and authentication-plugin locks and a single ETag and `If-Match`
  boundary. Profile fields remain subject to Moodle's read visibility rules.
- **Custom profile fields:** keep their GET/PUT/PATCH resource for now. Their
  configured, shortname-keyed values have dynamic schemas and distinct
  visibility/editability rules; embedding them in the fixed user representation
  would make it less predictable. PUT and PATCH can share the same path because
  they intentionally mean replacement and partial update, respectively.
- **Password operations:** do not merge explicit password setting, generated
  temporary-password reset, and public recovery. Their authorization,
  repeatability, side effects, and information-disclosure contracts differ.

### Selectable response fields

Returning the same `User` representation from collection and single-user GETs
keeps client expectations and OpenAPI schemas consistent. A `fields` query
parameter could let callers request a projection (for example, only `id` and
`fullName`) to reduce response size, especially for collection requests.
Selection is distinct from visibility: unrequested fields would be omitted,
while requested but hidden or unavailable fields would remain `null`, so the
existing nullability/privacy contract is preserved.

The trade-off is more than a small query parameter:

- A projected response no longer guarantees the full `User` shape. OpenAPI
  properties would need to become optional, and generated clients could not
  assume fields are present even when no projection was requested unless the
  contract clearly specifies the default.
- The API must define an allowlist, field-name syntax, duplicate handling,
  unknown-field errors, and whether selection applies to collection GET,
  single-user GET, or both. It must not allow selection to bypass visibility or
  capabilities.
- ETags and caches must represent the selected response, and include the query
  selection in cache keys. Different callers may also receive different values
  due to visibility.
- Omitting fields may reduce bytes, but is unlikely to reduce database work
  unless the implementation can avoid loading or computing those fields. The
  fixed user representation is modest; dynamic custom fields already have a
  separate resource.

**Recommendation:** do not add selection by default without a demonstrated
client or payload-cost need. If needed, begin with an explicit allowlisted
`fields` parameter on `GET /user/users` (the collection has the clearest
payload-size case), defaulting to all fields in `User`. Keep detail GET complete
unless clients show a need there too. Document that unrequested fields are
omitted, requested-but-hidden fields are `null`, unknown fields are rejected,
and selection does not change authorization. Model the response schema as
`User` with optional properties, while documenting the default complete
response; do not create separate summary/full resource schemas solely to
describe the projection.

### Password contracts in the review schema

| Endpoint | Purpose |
| --- | --- |
| `PATCH /user/users/{userId}/password` | Administrative explicit-password update; optional persistent `requirePasswordChange` state. |
| `POST /user/users/{userId}/password-reset` | Generate a temporary password, optionally email it, and return an immediate non-secret outcome with `200`. |
| `POST /user/password-reset` | Public request for a reset-link email, without changing the password; return generic `202`. |

Both reset endpoints are singleton processing resources, not collections of
individually addressable requests. There is no administrative result GET,
reset-record identifier, retention requirement or `Location` header.

Administrative password changes require the unrestricted update scope and
system-level `moodle/user:update`; self-only scopes do not authorise them.
Generated passwords are never returned. A failed email does not undo credential
replacement. Repeating a generation POST creates another reset and password.

The public recovery endpoint always gives a generic acceptance response for
account-dependent outcomes. It exposes neither identifiers nor delivery status,
uses account-independent throttling and deferred delivery, and reuses Moodle's
existing reset-token redemption page. The guide proposal permits public
endpoints such as template retrieval, language-string retrieval and recovery
requests under an explicit access policy. Handlers without required scopes must
declare `#[\core\router\scope\unscoped_resource]`; this does not by itself disable
authentication or capability checks. There is no public recovery result lookup.

The schema contains contracts only; the new password endpoints have no handlers.

## Agreed follow-up decisions

### Nullability

Preserve the stable response shape: return `null` for fields that are hidden
from the caller or unavailable, without distinguishing those reasons. Readable
empty strings remain empty strings.

OpenAPI 3.1 response schemas must explicitly permit null for these fields,
for example `"type": ["string", "null"]`. This does not make the corresponding
request fields nullable; mutation validation remains independently defined.

**Status:** agreed; response-schema changes remain to be implemented.

### Validation status codes

- `400`: malformed requests that cannot be parsed or structurally interpreted,
  such as invalid JSON.
- `422`: well-formed input that fails field validation, including invalid
  email/time zone, missing required fields, unknown/read-only fields, password
  policy failures and incompatible options.
- `403`: permission failures and locked-field restrictions.
- `409`: uniqueness conflicts.
- `412`: stale ETag preconditions.

Router and handler validation must follow the same boundary. Existing user
field-validation responses will change from `400` to `422`.

**Status:** agreed; guide clarification and shared validation/endpoint changes
remain to be implemented.

### Field-validation error shape

Keep RFC 9457's top-level problem members and add a `details` array:

```json
{
  "type": "about:blank",
  "title": "Unprocessable Content",
  "status": 422,
  "detail": "Some fields are invalid.",
  "details": [
    {
      "field": "email",
      "code": "invalidemail",
      "message": "Enter a valid email address."
    }
  ]
}
```

Use camelCase request-field paths such as `profile.country` or
`customFields.fields.studentcode`. Codes are stable lowercase identifiers;
messages may be translated. Collect independent field errors where practical
without promising exhaustive validation. Never echo passwords or recovery
tokens. Do not introduce a separate nested `error` envelope.

**Status:** agreed; guide, shared error handling and schemas remain to be updated.
The non-validation identifier convention is agreed below.

### Singleton resource names

Use plural nouns for collections and allow singular nouns for genuine singleton
subresources. Keep `/users/{userId}/password` singular; retain plural collection names such as `custom-fields`. Use singular
`password-reset` for the administrative and public processing resources, without
inventing a historical result collection. The noun-only rule still applies.

**Status:** agreed; add a singleton exception to the guide. No route renaming
is needed.

### Non-validation error identifiers

Use a top-level `code` extension for documented application-specific problems
that clients need to distinguish. Codes are stable, non-localised lowercase
identifiers, not copies of the HTTP status.

```json
{
  "type": "about:blank",
  "title": "Conflict",
  "status": 409,
  "code": "usernameexists",
  "detail": "The username is already in use."
}
```

Generic HTTP/framework failures may rely on `status` and `type` without a code.
`type` retains its RFC 9457 meaning and may use a documented problem-type URI.
Keep the deprecated numeric `errorcode` compatibility member until its normal
removal; do not change its meaning in place. Codes must not disclose information
that the endpoint's public error contract deliberately hides.

**Status:** agreed; guide, schemas and application-error handling remain to be
updated.

### Resource expansion

Expansion is optional rather than mandatory for every single-resource GET.
Keep the current user endpoints without expansion; the user GET includes
visible profile fields, and custom fields remain independently addressable.

When an endpoint offers expansion, document its parameter syntax, allowed
relationships, response shape, permission filtering and cost/depth limits.
Expansion must not bypass scopes, capabilities or field visibility. No global
expansion syntax or response envelope is selected by this decision.

**Status:** agreed; replace the guide's blanket requirement with optional,
explicitly documented expansion. No user-endpoint expansion work is required.

## Other style-guide gaps

These findings concern the current user API proof of concept and its generated
schema. They are separate from the guide amendments above.

| Area | Guide | Finding |
| --- | --- | --- |
| Nullability | 9.2 | Decision agreed above: preserve null for hidden/unavailable fields and explicitly declare nullable response types. Schema changes remain outstanding. |
| Validation details | 12.2 | Decision agreed above: RFC 9457 plus `details: [{field, code, message}]`. Guide, shared error handling and schemas remain outstanding. |
| Validation status | 13 | Decision agreed above: `400` for malformed requests, `422` for field validation, and `409` for uniqueness conflicts. Guide and implementation changes remain outstanding. |
| Error identifiers | 12.3 | Decision agreed above: top-level `code` for documented application-specific problems; generic failures may use status/type alone. Preserve deprecated numeric `errorcode` compatibility until normal removal. Guide/schema/implementation changes remain outstanding. |
| Expansion | 11.2 | Decision agreed above: expansion is optional and must be fully documented and permission-filtered where supported. Guide amendment remains outstanding; no expansion is needed on the current user endpoints. |
| Singleton names | 5.1 | Decision agreed above: allow singular singleton subresources and retain plural collection names. Guide amendment remains outstanding; no route renaming is needed. |

### Advisories and scope qualifications

- **Retry protection (15.2):** the guide recommends `Idempotency-Key` for
  retryable POSTs. Password generation and account creation do not currently
  offer this. Repeated-generation behaviour is explicit, but an uncertain
  creation outcome is still difficult to recover from. This is a deferred
  recommendation, not a MUST violation.
- **Legacy migration (16.1):** if these routes are declared replacements for
  legacy user functions, their narrower representations do not satisfy the
  literal functional-superset rule. They are currently exploratory new routes;
  migration scope must be explicit. The guide already marks this section as
  under revision.
- **Naming is not itself a gap:** query sort keys `firstname`/`lastname` are not
  JSON field names. The guide's camelCase JSON rule alone does not prohibit
  them, although aligning public sort names with response fields may be clearer.
- **Cookie support is not automatically a violation:** section 14.1 discourages
  cookie-only APIs, not every endpoint that also accepts a cookie. The strict
  statelessness requirement still applies to behaviour that actually relies on
  conversational session state.

### Additional contract issues, not explicit style-guide rules

- The shared request-object validator strips unknown properties before the
  updater can reject them. This conflicts with the described rejection of
  unknown/read-only fields.
- The default `path_user` description mentions `id:42`, but its parser accepts
  bare numeric ids rather than that prefix. Examples and documentation should
  match the accepted identifier forms.
- `sendPasswordEmail` on creation now requires `generatePassword: true` when
  explicitly supplied, rather than being silently ignored for other modes.
  This is an intentional tightening in the review contract.

**Recommendation:** retain the processing-control and recovery proposals, then
resolve the remaining schema/implementation gaps separately. Do not broaden
this documentation commit into unrelated routing or user-handler changes.
