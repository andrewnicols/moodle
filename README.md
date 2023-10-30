# Routed Moodle

This is a WIP branch to add proper first-class routing support to Moodle using Slim Framework.

This branch also adds support for php-di to provide Dependency Injection to Moodle.

Please note that this is a work-in-progress proof of concept branch to help ideate changes. There is little-to-no documentation at this time.

## Features and TODOs

### Features and Key points

- Fixes to PSR-4 autoloading
- Dependency Injection via [PHP-DI](https://php-di.org/)
- Routing via the [Slim Framework](https://www.slimframework.com/)
- [OpenAPI](https://spec.openapis.org/oas/v3.1.0) specification generation
- [Swagger UI](https://swagger.io/tools/swagger-ui/) bundled at ./swagger.html
- Response codes other than 200 possible
- Support for standard methods (GET, HEAD, POST, DELETE, etc.)
- Routes defines using PHP Annotations
- Query and Path parameter validation based on Route annotations in route
- Docs generated from Route annotations
- Support for examples
- Support for import directly into tooling such as Postman

### TODOs

- Validation of body parameters
- Further testing
- Tidy up namespaces
- Unit tests
- OAuth2 support, including scope policies
- Reduce duplication of OpenAPI parameter definitions
- Documentation
- Test and provide instructions for additional HTTP servers

### Known issues

- User Preference service named incorrectly (preference => preferences)
- Body parameters not validated yet
- Current services not yet complete

### Interesting things to look at

- Example of WIP web service for setting and fetching user preferences: [user/classes/api/preferences.php](./user/classes/api/preferences.php)
- Example of replacement page for /course/view.php: [course/classes/route/view_controller.php](./course/classes/route/view_controller.php)
- Example of a shim to redirect /course/view.php to the new controller: [course/classes/route/shim/course_routes.php](./course/classes/route/shim/course_routes.php)

## Configuration notes

In the future configuration will be optional but highly recommended. A router is provided at `/r.php` and this can be used without any URL rewriting but will lead to uglier URLs.

To get the pretty URLs we all dream of, some server-side configuration will be required.

### Apache2

See the included `.htaccess` file.
Tweaks may be required in future.

### nginx configuration

I currently have the following configuration working with nginx. Please note that it can definitely be improved and this is just a working prototype.

```conf
root /Users/nicols/Sites/public_html;
index index.html index.htm index.php;
autoindex on;

location / {
  try_files $uri $uri/ @routed;
}

location @routed {
  fastcgi_pass   127.0.0.1:9000;
  include        fastcgi_params;
  fastcgi_param  SCRIPT_FILENAME $realpath_root/ws2/r.php;
  fastcgi_param  DOCUMENT_ROOT $realpath_root;
}

location ~ \.php(/|$) {
  # Split the path info based on URI.
  fastcgi_split_path_info ^(.+\.php)(/.*)$;

  # Note: Store the original path_info. It will be wiped out in a moment by try_files.
  set $path_info $fastcgi_path_info;

  # Look for the php file. If not round then jump to @routed.
  try_files $fastcgi_script_name $fastcgi_script_name/ @routed;

  # File was found - pass to fastcgi.
  fastcgi_pass   127.0.0.1:9000;
  include        fastcgi_params;

  # Re-apply the path_info after including fastcgi_params.
  fastcgi_param  PATH_INFO $path_info;
  fastcgi_param  SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
  fastcgi_param  DOCUMENT_ROOT $realpath_root;
}
```

## Future work

This is the start of a body of work which I envisage, and which will take a number of years to complete.

### Moodle 4.4

- Land initial support for new API
- Start migration to new API

### Moodle 4.5 (LTS)

- Start to discourage writing any new 'legacy' web services in favour of new API
- Continue migration of web services
- Add support for routed endpoints to replace all current 'standard' pages in Moodle

### Moodle 5.0

- Stop accepting any new legacy web service
- Continue migration of web services
- Warn of plan to cease support for the legacy web services in 6.0
- Continue migration of standard pages
- Stop accepting any new 'standard' pages
- Warn of plan to cease support for standard pages in 6.0

### Moodle 5.1 - 5.3 (LTS):

- Continue migration of web services
- Continue migration of non-routed standard pages to routed endpoints

### Moodle 6.0

- Cease support for legacy web services entirely
- Cease support for non-routed standard pages entirely

### Future (to allow time for issues and deviations)

At this point all content will be served through the /r.php router. Nothing in core should be manually including `config.php` or similar files and all content should really be autoloaded (except for some possible core exceptions).

Once we're in this situation we should be able to more easily adjust the Moodle directory structure to move everything out of core.

Ideally at some point along this journey we should be able to change individual plugins to be type-less - that is they should just be a _plugin_ and the implementation of that plugin should be able to support multiple plugin types.

For example a forum plugin may have the following data structure and include both a block, and an activity:

```
forum
├── amd
│   ├── build
│   └── src
├── classes
│   └── plugintypes
│       ├── block
│       │   └── recentposts.php
│       └── mod
│           └── forum.php
├── lang
│   └── en
│       └── forum.php
├── templates
├── tests
└── version.php
```

A glossary plugin may have the following data structure and include both a block, a filter, and an activity:

```
glossary
├── amd
│   ├── build
│   └── src
├── classes
│   └── plugintypes
│       ├── block
│       │   └── random_glossary.php
│       ├── filter
│       │   └── glossary.php
│       └── mod
│           └── glossary.php
├── lang
│   └── en
│       └── glossary.php
├── templates
├── tests
└── version.php
```

This would also allow support for multiple instances of each plugin type.

We could also then start to move all plugins to Packagist and use Composer to provide completely custom Moodle installations.
