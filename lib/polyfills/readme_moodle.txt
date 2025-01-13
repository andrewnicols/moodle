The steps are essentially:
1) Install required packages

    npm install --no-save regenerator-runtime core-js-bundle

2) Join them all together:

    rm lib/polyfills/polyfill.js

    cat node_modules/regenerator-runtime/runtime.js >> lib/polyfills/polyfill.js

    cat node_modules/core-js-bundle/minified.js >> lib/polyfills/polyfill.js
    sed -i '/\/\/\# sourceMappingURL=minified.js.map/d' lib/polyfills/polyfill.js

3) Uninstall the packages again

    npm uninstall --no-save regenerator-runtime core-js-bundle
