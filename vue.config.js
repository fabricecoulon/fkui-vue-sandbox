const packageJson = require("./package.json");

module.exports = {
    publicPath: "",
    configureWebpack: {
        devtool: "source-map",
    },
    chainWebpack(config) {
        config.resolve.symlinks(false);

        config.plugin("html").tap((args) => {
            return require("@forsakringskassan/webpack-fkse-index-template")(
                packageJson,
                args,
            );
        });

        /* disable progress output on Jenkins as it grows the log to multiple
         * megabytes and basically impossible to read */
        config.plugins.delete("progress");

        config.module
            .rule("vue")
            .use("vue-loader")
            .loader("vue-loader")
            .tap((options) => {
                // Force preserve whitespace (preserveWhitespace is deprecated in vue-cli v3)
                // This can result in unpredicted behaviors for inline elements and is therefore changed.
                options.compilerOptions.whitespace = "preserve";
                return options;
            });
    },

    devServer: {
        /* on demo server a hostname is used but webpack-dev-server rejects the
         * hostname unless this option is disabled */
        disableHostCheck: true,

        port: Number(process.env.HTTP_PORT) || 8080,
    },
};
