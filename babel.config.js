module.exports = {

  presets: [
    "@babel/preset-typescript",
    ['@babel/preset-env',
      {
        targets: {
          esmodules: true,
        },
      }
    ]
  ],

  plugins: [
    "@babel/plugin-proposal-class-properties",
    ["@babel/plugin-transform-runtime",
      {
        "regenerator": true
      }
    ]
  ],


};
