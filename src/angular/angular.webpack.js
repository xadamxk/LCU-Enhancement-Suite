module.exports = (config, options) => {
    config.target = 'electron-renderer';

    if (options.customWebpackConfig.target) {
        config.target = options.customWebpackConfig.target;
    } else if (options.fileReplacements) {
        for (let fileReplacement of options.fileReplacements) {
            if (fileReplacement.replace.indexOf('environments/environment.ts') < 0) {
                continue;
            }

            let fileReplacementParts = fileReplacement.with.split('.');
            let targetIndex = fileReplacementParts.length - 2;

            if (targetIndex > -1 && ['development', 'production', 'test', 'electron-renderer'].indexOf(fileReplacementParts[targetIndex]) < 0) {
                config.target = fileReplacementParts[targetIndex];
            }

            break;
        }
    }

    return config;
}
