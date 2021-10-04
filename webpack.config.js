const path = require('path')
const copyPlugin = require('copy-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = 
    {
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
                    test: /\.ts$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                    options: {configFile: 'tsconfig.json'},
                },
                {
                    test: /\.(htm)$/i,
                    loader: 'file-loader',
                    options: {name: '[name].htm'},
                },
                {
                    test: /manifest\.(json)$/i,
                    loader: 'file-loader',
                    options: {name: '[name].json'},
                    type: 'javascript/auto',
                },
                {
                    test: /Logo_256x256\.(png)$/i,
                    loader: 'file-loader',
                    options: {
                        name: '[name].png',
                    },
                },
                {
                    test: /\.(less)$/i,
                    use: ['style-loader', 'css-loader', 'less-loader'],
                },
            ],
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
    }
