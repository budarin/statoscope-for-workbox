const path = require('path');
const zlib = require('zlib');
const webpack = require('webpack');
const HappyPack = require('happypack');

const TerserPlugin = require('terser-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const StatoscopeWebpackPlugin = require('@statoscope/ui-webpack');

const ONE_KILOBYTE = 1024;
const ASSETS_PATH = '/';
const MAX_BUNDLE_SIZE = 50 * ONE_KILOBYTE;

const config = {
    name: 'client_prod',
    mode: 'production',
    watch: false,
    target: 'web',
    bail: true,
    devtool: false,
    experiments: {
        topLevelAwait: true,
    },
    entry: {
        client: [path.resolve('./src/client/index.js')],
    },
    output: {
        publicPath: ASSETS_PATH,
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js',
        path: path.resolve('./dist'),
    },
    performance: {
        maxAssetSize: MAX_BUNDLE_SIZE,
        hints: 'error',
        assetFilter: (assetFilename) => {
            const exceptions = [/.+?\.jpg$/, /^react.*.js$/];
            return !exceptions.find((mask) => !assetFilename.match(mask));
        },
    },
    optimization: {
        minimize: true,
        mergeDuplicateChunks: true,
        runtimeChunk: {
            name: 'runtime',
        },
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                default: false,
                defaultVendors: false,
                npms: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        if (packageName === 'core-js') {
                            return 'core-js';
                        }
                        return 'npms';
                    },
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    compress: true,
                    mangle: true,
                    keep_classnames: false,
                    keep_fnames: false,
                    output: {
                        comments: false,
                    },
                },
            }),
        ],
    },
    resolve: {
        extensions: ['.js', '.json'],
        modules: ['node_modules'],
        alias: {},
    },
    externals: {},
    module: {
        rules: [
            {
                test: /\.(js|json)$/,
                exclude: /node_modules/,
                use: 'happypack/loader?id=js',
            },
        ],
    },
    plugins: [
        new HappyPack({
            id: 'js',
            threads: 3,
            loaders: [
                {
                    loader: 'babel-loader',
                },
            ],
        }),
        new WebpackAssetsManifest({
            output: 'assets-manifest.json',
            entrypoints: true,
        }),
        new StatoscopeWebpackPlugin({
            name: 'Client',
            saveTo: path.resolve(`./dist/client-statoscope.html`),
            open: 'file',
        }),
        new InjectManifest({
            swSrc: './src/sw/sw.js',
            swDest: 'sw.js',
            webpackCompilationPlugins: [
                new StatoscopeWebpackPlugin({
                    name: 'ServiceWorker',
                    saveTo: path.resolve(`./dist/sw-statoscope.html`),
                    open: 'file',
                }),
            ],
        }),
    ],
};

module.exports = config;
