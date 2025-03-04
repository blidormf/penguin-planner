// webpack.dev.js

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: "eval-source-map",
    devServer: {
        port: 9090,
        watchFiles: ["./src/template.html"],
        static: './dist',
    },
});