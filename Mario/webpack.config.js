const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/game.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    },
    devServer: {
        port: 3000
    },
    plugins: [
        new HTMLPlugin({
            template: 'src/index.html'
        })
    ]
}