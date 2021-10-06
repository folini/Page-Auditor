const path = require('path')

module.exports = {
    entry: {
        main: './src/main.ts',
        worker: './src/worker.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '',
        clean: true,
    },
    performance: {
        maxAssetSize: 500000,
    },
    module: {
        rules: [
            {
                test: /\.(ts)$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {configFile: 'tsconfig.json'},
            },
            {
                test: /\.(htm)$/,
                loader: 'file-loader',
                options: {name: '[name].htm'},
            },
            {
                test: /manifest\.(json)$/,
                loader: 'file-loader',
                options: {name: '[name].json'},
                type: 'javascript/auto',
            },
            {
                test: /Logo_256x256\.(png)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].png',
                    outputPath: 'logos',
                },
            },
            {
                test: /\.(less)$/,
                use: ['style-loader', 'css-loader', 'less-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
}
