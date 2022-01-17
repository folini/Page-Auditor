/*
  PLEASE DON'T CHANGE WITHOUT AUTHORIZATION
  Franco Folini
  Dario Passariello
*/

const path = require('path');
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const dotenv = require('dotenv').config({path: __dirname + '/.env'});
const TerserPlugin = require("terser-webpack-plugin");

  let pjson = require('./package.json');

  module.exports = (env, argv) => {

  console.log(
    {
      version: pjson.version,
      codeName: pjson.appCode,
      relaseCodeName: pjson.appCodeRelease,
      relaseType: pjson.appType,
      appName: pjson.appName,
      root: pjson.appFolder,
      folderAPI: pjson.appAPI,
      mode: argv.mode === 'development' ? 'development' : 'production',
    }
  );

  console.debug( "\n\tYour API came from: " + JSON.stringify( pjson.apiDev ) + "\n\n");

  return {

    mode: argv.mode === 'development' ? 'development' : 'production',
    devtool: argv.mode === 'development' ? 'eval-source-map' : 'cheap-module-source-map',
    stats: argv.mode === 'development' ? 'errors-warnings' : '',
    cache: argv.mode === 'development' ? false : true,
    target: 'web',

    devServer: {

      static: {
        directory: path.join( __dirname, 'dist'),
        publicPath: '/',
      },

      port: 3000,
      compress: argv.mode === 'development' ? false : true,
      magicHtml: argv.mode === 'development' ? true : false,
      liveReload: argv.mode === 'development' ? true : false,
      hot: argv.mode === 'development' ? true : false,
      historyApiFallback: true,
      open: false,

      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        'Accept-Encoding': '*',
        'Author': 'Franco Folini (c) 2020',
      },

      webSocketServer: 'ws',
      client: {
        overlay: true,
        webSocketTransport: 'ws',
        //progress: true,
        //logging: 'info',
      },

    },

    entry: {
      main: './src/main.ts',
      worker: './src/scripts/worker.ts',
    },

    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      publicPath: '/'
    },

    performance: {
      hints: argv.mode === 'development' ? 'error' : false,
      maxEntrypointSize: 51200000,
      maxAssetSize: 51200000
    },

    optimization: {
      minimize: argv.mode === 'development' ? false : true,
      minimizer: [new TerserPlugin({
        exclude: /static/,
      })]
    },

    resolve: {

      fallback: {
        "fs": false
      },

      alias: {
        Assets:       path.resolve( __dirname, 'src/assets' ),
        Include:      path.resolve( __dirname, 'src/include' ),
        Modals:       path.resolve( __dirname, 'src/modals' ),
        Config:       path.resolve( __dirname, 'src/config' ),
        Data:         path.resolve( __dirname, 'src/data' ),
        Pages:        path.resolve( __dirname, 'src/pages' ),
        Scripts:      path.resolve( __dirname, 'src/scripts' ),
        Styles:       path.resolve( __dirname, 'src/styles' ),
        Layout:       path.resolve( __dirname, 'src/layout' ),
        Root:         path.resolve( __dirname, 'src' )
      },

      modules: [path.resolve('node_modules')],
      extensions: [".ts", ".tsx", ".js", ".less", ".css", "scss"],

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
            cacheDirectory: argv.mode === 'development' ? true : false,
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
                url: false,
                modules: false,
                sourceMap: false,
                importLoaders: 1,
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
                url: false,
                modules: false,
                sourceMap: false,
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
            test: /\.(a?png|jpe?g|gif|ico|bmp|webb)(\?v=\d+\.\d+\.\d+)?$/,
            type: 'asset/resource',
            exclude: [ /node_modules/, /.OLD/ ],
          },

          // fonts
          {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            type: 'asset/resource',
            exclude: [ /node_modules/, /.OLD/ ],
          }

      ],
    },

    plugins: [

      //Environment
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify( argv.mode ),
        'process.env': dotenv.parsed,
        'process.env.debug': argv.mode === 'development' ? true : false
      }),

      new CopyPlugin({
        patterns: [
          {
            from: "./src/assets/",
            to: "./assets/",
            globOptions: {
              gitignore: true,
            }
          },
          {
            from: "./src/manifest.json",
            to: "./manifest.json",
            globOptions: {
              gitignore: true,
            }
          }
        ],
      }),

    ].filter(Boolean)

  };

};
