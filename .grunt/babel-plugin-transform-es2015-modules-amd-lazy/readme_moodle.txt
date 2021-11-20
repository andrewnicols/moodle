Description of Babel plugin import into Moodle

This is a modified version of the upstream plugin which we need to use as changing to another variant will change the
build files. We need to convert anything that is not already an AMD module into an AMD Module, whether or not it
contains any ESModule, or not.

In some cases there are upstream modules which run immediately (e.g. TinyMCE) and create a new Global.
Whilst these are not ideal, they are a fact of life and we should handle them as best we can.

Note: This project is abandoned so it is unlikely that we will need to upgrade.

To upgrade this library:
1. Install the library and copy the index file into place.
    npm install babel-plugin-transform-es2015-modules-amd-lazy
    cp node_modules/babel-plugin-transform-es2015-modules-amd-lazy/lib/index.js .grunt/babel-plugin-transform-es2015-modules-amd-lazy/index.js
2. Open the file in your editor
3. Find the `Program -> exit` function
4. Find the line that return if there is a define, or this is not an  ES module
    if (this.hasDefine || !this.hasESModule) {
5. Remove the hasESModule section:
    if (this.hasDefine) {
