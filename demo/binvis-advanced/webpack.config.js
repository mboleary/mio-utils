// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";
// const publicPath = process.env.PUBLIC_PATH || "/public/";

const stylesHandler = "style-loader";

const config = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    open: false, // makes browser not automatically open
    host: "localhost",
    port: process.env.PORT || "8080"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),

    new CopyPlugin({
      patterns: [
        { from: "./public/main.css", to: "./main.css" },
        { from: "./public/font", to: "./font" },
        { from: "./public/favicon.png", to: "./favicon.png" },
      ],
    }),

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      // {
      //   test: /\.(js|jsx)$/i,
      //   loader: "babel-loader",
      //   options: {
      //     presets: [
      //       '@babel/preset-env'
      //     ]
      //   }
      // },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";

    config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
  } else {
    config.mode = "development";
  }
  return config;
};
