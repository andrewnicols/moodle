# API Changes for the `auth_shibboleth` plugin

## 3.11

- The 'Data modification API' (convert_data) setting can no longer be configured to use files located within the
  current site data directory ($CFG->dataroot), as it exposes the site to security risks.
