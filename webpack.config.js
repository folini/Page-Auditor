const path = require('path');
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const dotenv = require('dotenv').config({path: __dirname + '/.env'});
const TerserPlugin = require("terser-webpack-plugin");

let pjson = require('./package.json');

  console.log(
    {
      version: pjson.version,
      codeName: pjson.appCode,
      relaseCodeName: pjson.appCodeRelease,
      relaseType: pjson.appType,
      appName: pjson.appName,
      root: pjson.appFolder,
      folderAPI: pjson.appAPI,
    }
  );

module.exports = {

  mode: 'production',
  devtool: "hidden-nosources-source-map",
  target: 'web',
  cache: true,

  devServer: {
    // port: 3000,
    // http2: true,
    // https: true,
    compress: true,
    magicHtml: false,
    hot: false,
    liveReload: false,
    historyApiFallback: true,
    contentBase: './dist',
    open: false,

    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      'Accept-Encoding': '*',
      'Creator': 'Franco Folini (c) 2020',
    },

    client: {
      overlay: false,
    },

  },

  entry: {
    main: './src/main.ts',
    worker: './src/worker.ts',
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    clean: true,
  },

  performance: {
    hints: false,
    maxAssetSize: 500000,
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(
      {
        terserOptions: {
            keep_classnames: true,
            keep_fnames: true
        }
      }
    )],
    moduleIds: 'named',
  },

  module: {
    rules: [

      // scripts loader
      {
        test: /\.(ts|tsx|js|jsx)$/,
        loader: require.resolve('babel-loader'),
        exclude: [ /node_modules/, /.OLD/ ],
        options: {
          //plugins: ['react-hot-loader/babel'],
          cacheDirectory: true,
        },
      },

      // html loader
      {
        test: /\.(htm)$/,
        loader: 'file-loader',
        options: {name: '[name].htm'},
      },

      // less-loader
      {
        test: /\.(less)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "style-loader"
          },{
            loader: "css-loader",
            options: {
              sourceMap: true,
              modules: true,
            }
          },{
            loader: "less-loader",
          },
        ],
      },

      // scss / css loader
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
            },
          },
          'sass-loader',
        ],
        include: /\.module\.s?(c|a)ss$/,
      },

      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        exclude: /\.module\.s?(c|a)ss$/,
      },

      // All assets
      {
        test: /\.(woff(2)?|ttf|eot|svg|png|jpe?g|gif)(\?v=\d+\.\d+\.\d+)?$/,
        //type: 'asset/resource',
        loader: 'file-loader',
        //options: {name: '[name].[ext]'},
      },

      // {
      //   test: /manifest\.(json)$/,
      //   loader: 'file-loader',
      //   options: {name: '[name].json'},
      //   type: 'javascript/auto',
      // },

      // {
      //   test: [/Logo_256x256\.(png)$/, /_noRendering_400x200\.(png)$/, /fa-regular-400\.(woff)$/],
      //   loader: 'file-loader',
      //   options: {
      //     name: '[name].[ext]',
      //     outputPath: 'logos',
      //   },
      // },

      // {
      //   test: /\.(less)$/,
      //   use: ['style-loader', 'css-loader', 'less-loader'],
      // },

    ],
  },

  resolve: {
    alias: {
      Assets:       path.resolve( __dirname, 'src/assets' ),
      Components:   path.resolve( __dirname, 'src/components' ),
      Include:      path.resolve( __dirname, 'src/shared/include' ),
      Modals:       path.resolve( __dirname, 'src/shared/modals' ),
      Reports:      path.resolve( __dirname, 'src/shared/reports' ),
      Shared:       path.resolve( __dirname, 'src/shared' ),
      App:          path.resolve( __dirname, 'src/app' ),
      Config:       path.resolve( __dirname, 'src/config' ),
      Data:         path.resolve( __dirname, 'src/data' ),
      Pages:        path.resolve( __dirname, 'src/pages' ),
      Scripts:      path.resolve( __dirname, 'src/scripts' ),
      Styles:       path.resolve( __dirname, 'src/styles' ),
      Typings:      path.resolve( __dirname, 'src/typings' ),
      Utils:        path.resolve( __dirname, 'src/utils' ),
      Validators:   path.resolve( __dirname, 'src/validators' ),
      Layout:       path.resolve( __dirname, 'src/layout' ),
      Root:         path.resolve( __dirname, 'src/' )
    },
    modules: [path.resolve('node_modules')],
    extensions: [".ts", ".tsx", ".js", ".css", ".less", ".sass", ".scss"],
  },

  plugins: [

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env': dotenv.parsed,
      'process.env.debug': false
    }),

    new CopyPlugin({
      patterns: [
        {
          from: "./src/assets/",
          to: "./assets/",
          // globOptions: {
          //   ignore: ['**/documents']
          // }
        },
        {
          from: "./src/manifest.json",
          to: "./manifest.json",
        }
      ],
    }),

  ].filter(Boolean)

};
