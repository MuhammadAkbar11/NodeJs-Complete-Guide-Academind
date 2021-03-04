const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");

const webpack = require("webpack");

module.exports = {
  entry: {
    client: "./src/client/index.client.js",
    admin: "./src/admin/index.admin.js",
    bootstrapV5: path.resolve(
      __dirname,
      "node_modules/bootstrap/dist/js/bootstrap.js"
    ),
    "feather-icons": path.resolve(
      __dirname,
      "node_modules/feather-icons/dist/feather.min.js"
    ),
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 200,
    poll: 1000,
  },
  mode: "production",
  output: {
    filename: "js/phoenix-[name].min.js",
    path: path.resolve(__dirname, "public/dist"),
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/env"],
            plugins: ["transform-class-properties"],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          "css-loader",
          "sass-loader",
          "postcss-loader",
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new OptimizeCssAssetsWebpackPlugin()],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/phoenix-[name].min.css",
    }),
  ],
};
