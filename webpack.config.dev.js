const path=require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin"); // MINI CSS

const HtmlWebPackPlugin = require ("html-webpack-plugin");

const es3ifyPlugin = require('es3ify-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const webpack = require('webpack');

console.log(__dirname);





module.exports = {
    // devtool: 'cheap-module-source-map',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.bundle.js'
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx'],
        alias: {
            // react: 'anujs/dist/ReactIE.js',
            // 'react-dom': 'anujs/dist/ReactIE.js',
            // 'prop-types': 'anujs/lib/ReactPropTypes',
            // devtools: 'anujs/lib/devtools',
            // 'create-react-class': 'anujs/lib/createClass',
          "zepto" : 'zepto/dist/zepto.min.js'
        },
    },
    module: {
        rules: [
            {
                test: /\.js|jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: { minimize: true }
                    }
                ]
            },
            // {
            //     test: /\.css$/,
            //     // use: 'style!css'
            //     use: {
            //         loader: "style-loader",
            //         loader : "css-loader"
            //     }
            // },
            // {
            //     test: /\.scss$/,
            //     use: {
            //         loader: "style-loader",
            //         loader : "css-loader",
            //         loader : "sass-loader"
            //     }
            // },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    //devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            }

        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        }),
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            // filename: devMode ? '[name].css' : '[name].[hash].css',
            // chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
            filename: 'index.css',
            chunkFilename: '[id].css'
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        port:30000,
        compress : true,
        inline:true,
        hot:true,
        overlay: true,
    },
    mode: 'development'
};