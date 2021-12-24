/*
  PLEASE DON'T CHANGE WITHOUT AUTHORIZATION
*/

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

  console.debug( "\n\tYour API came from: " + JSON.stringify( pjson.apiDev ) + "\n\n");

module.exports = {

    mode: 'development',
    devtool: 'eval-source-map',
    stats: 'errors-warnings',
    target: 'web',
    cache: true,

    devServer: {

      // static: {
      //   directory: path.join( __dirname, 'dist'),
      //   publicPath: '/dist',
      // },

      port: 3000,
      // http2: true,
      // https: true,
      compress: true,
      magicHtml: true,
      hot: true,
      liveReload: false,
      historyApiFallback: true,

      open: false,

      headers: {
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Credentials': true,
        // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        // 'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        // 'Accept-Encoding': '*',
        // 'Creator': 'Franco Folini (c) 2020',
      },

      client: {
        overlay: true,
        webSocketTransport: 'ws',
        //progress: true,
        //logging: 'info',
      },
      webSocketServer: 'ws',
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
      minimizer: [new TerserPlugin()],
      moduleIds: 'named',
    },

    resolve: {
      alias: {
        Assets:       path.resolve( __dirname, 'src/assets' ),
        Components:   path.resolve( __dirname, 'src/components' ),
        Include:      path.resolve( __dirname, 'src/include' ),
        Modals:       path.resolve( __dirname, 'src/modals' ),
        Reports:      path.resolve( __dirname, 'src/reports' ),
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
        Root:         path.resolve( __dirname, 'src' )
      },
      modules: [path.resolve('node_modules')],
      extensions: [".ts", ".tsx", ".js", ".less", ".css"],
    },

    module: {
      rules: [
        // we use babel-loader to load our jsx and tsx files
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

        // css-loader and less-loader
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
                url: false
              }
            },{
              loader: "less-loader"
            },
          ],
        },
        // CSS, SCSS
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

        // assets
        {
          test: /\.(woff(2)?|ttf|eot|svg|png|jpe?g|gif)(\?v=\d+\.\d+\.\d+)?$/,
          //loader: 'file-loader',
          type: 'asset',
          //exclude: [ /node_modules/, /.OLD/ ],
        },

      ],
    },

    plugins: [

      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
        'process.env': dotenv.parsed,
        'process.env.debug': true
      }),

      new CopyPlugin({
        patterns: [
          {
            from: "./src/assets/",
            to: "./dist/assets/",
            // globOptions: {
            //   ignore: ['**/documents']
            // }
          },
          {
            from: "./src/manifest.json",
            to: "./dist/manifest.json",
          }
        ],
      }),

    ].filter(Boolean)

};
