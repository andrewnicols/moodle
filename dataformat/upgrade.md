# API Changes for the `dataformat` plugintype

## 3.11.1

- Optional $callback for the following \core\dataformat methods now receive a second argument to define
  whether the current format writer supports HTML:
  - download_data()
  - write_data()
  - write_data_to_filearea()

## 3.9

- The following methods have been added to the base dataformat class to allow instances to export to a local
  file. They can be overridden in extending classes to define how files should be created:
  - start_output_to_file()
  - close_output_to_file()
- Calls to the following dataformat plugin methods have been removed:
  - write_header()
  - write_footer()
- The following methods have been added to the base class to allow instances to define support for exporting
  HTML content, with additional support for defining how images should be embedded:
  - supports_html()
  - export_html_image_source()
- Dataformat writers should also call the following method to ensure data is properly formatted before being
  written, which takes into account prior methods defining support for HTML:
  - format_record()
