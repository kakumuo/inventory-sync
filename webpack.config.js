const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')


module.exports = {
    mode: 'development', 
    target: 'web', 
    devtool: 'source-map',
    entry: {
        popup: './src/popup.tsx', 
        settings: './src/settings.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'dist/src'), 
        filename: '[name].js'
    }, 
    module: {
        rules: [{test: /\.tsx?$/, use: 'ts-loader', exclude: '/node_modules/'}]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {from: "./pages", to: "../pages/"},
                {from: './manifest.json', to: '../.'}
            ]
        })
    ], 
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    }
};