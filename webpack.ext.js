const path = require("path")

module.exports = {
  entry: {
    main: "./src/main.ts"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    publicPath: '',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {configFile: "tsconfig.json"},
      },
      {
        test: /\.(htm)$/,
        loader: "file-loader",
        options: {name: '[name].htm'},
      },
      {
        test: /\.(png)$/,
        loader: "file-loader", 
        options: {
          name: '[name].png',
          outputPath: 'logos'
        },
      },
      {
        test: /manifest\.(json)$/,
        loader: "file-loader",
        options: {name: '[name].json'},
        type: 'javascript/auto'
      },
      {
        test: /\.(less)$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
}
