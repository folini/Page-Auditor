const path = require("path")

module.exports = {
  entry: {
    main: "./src/ext.ts"
  },
  output: {
    path: path.resolve(__dirname, "dist-ext"),
    filename: "ext.js",
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
        options: {name: '[name].png'},
      },
      {
        test: /\.(json)$/,
        loader: "file-loader",
        options: {name: '[name].json'},
        type: 'javascript/auto'
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
}
