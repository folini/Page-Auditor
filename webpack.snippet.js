const path = require('path')

module.exports = {
    entry: './src/snippet.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'snippet.js',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {configFile: 'tsconfig.json'},
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
}
