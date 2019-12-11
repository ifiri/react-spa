const path = require('path');
const webpack = require('webpack');

module.exports = {
    context: path.resolve(__dirname, './assets/scripts'),
    entry: {
        main: ['whatwg-fetch', './polyfills.js', './main.js']
    },
    output: {
        path: path.resolve(__dirname, './dist/scripts'),
        filename: '[name].js'
    },
    resolve: {
        modules: ['node_modules'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|vendor)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                "targets": {
                                    "browsers": [
                                        "Chrome >= 35",
                                        "FireFox >= 44",
                                        "Safari >= 7",
                                        "Explorer 11",
                                        "last 4 Edge versions"
                                    ]
                                },
                                "shippedProposals": true,
                                "useBuiltIns": 'usage'
                            }],
                            '@babel/react'
                        ],
                    }
                }
            }
        ],
        // strictThisContextOnImports: true,
    },
    
    stats: {
        colors: true,
        reasons: true,
    },

    plugins: [
        // new webpack.DefinePlugin({
        //   'process.env.NODE_ENV': JSON.stringify('production')
        // }),
        // new webpack.optimize.UglifyJsPlugin(),
    ]
};