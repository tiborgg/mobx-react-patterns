'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = {

    devtool: 'source-map',
    entry: [
        './src/index'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'app.js',
        publicPath: '/js/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: path.resolve('./src/'),

                use: ['babel-loader']
            },

            {
                test: /\.less$/,
                include: path.resolve('./src/'),

                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader', options: { sourceMap: true } },
                    { loader: 'less-loader', options: { sourceMap: true } }]
            },

            {
                test: /\.css$/,
                include: path.resolve('./src/'),

                use: [
                    { loader: 'style-loader' },
                    { loader: "css-loader", options: { sourceMap: true } }]
            }]
    }
};
