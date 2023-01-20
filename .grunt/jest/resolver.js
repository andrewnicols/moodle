const defaultResolver = (path, options) => {
    return options.defaultResolver(path, {
        ...options,
        // Use packageFilter to process parsed `package.json` before the resolution (see https://www.npmjs.com/package/resolve#resolveid-opts-cb)
        packageFilter: pkg => {
            return {
                ...pkg,
                // Alter the value of `main` before resolving the package
                main: pkg.module || pkg.main,
            };
        },
    });
};

module.exports = (path, options) => {
    try {
        // Call the defaultResolver, so we leverage its cache, error handling, etc.
        return defaultResolver(path, options);
    } catch (err) {
        if (err.code !== 'MODULE_NOT_FOUND') {
            throw err;
        }
    }

    if (options.rootDir) {
        const loaderPath = `${options.rootDir}/.grunt/components.js`;
        const {getPathFromAMDModuleName} = require(loaderPath);

        const moodlePath = getPathFromAMDModuleName(path);
        if (moodlePath) {
            return defaultResolver(`${options.rootDir}/${moodlePath}`, options);
        }
    }

    return null;
};
