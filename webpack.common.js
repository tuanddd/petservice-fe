const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const PurgeCssPlugin = require("purgecss-webpack-plugin");
const path = require("path");
const glob = require("glob");

const PATH = path.resolve(__dirname, "src");

const dev = process.env.NODE_ENV !== "production";

module.exports = {
  entry: {
    app: "./src/index"
  },
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js"
  },
  resolve: {
    alias: {
      "@api-urls": path.resolve(__dirname, "src/api-urls"),
      "@context": path.resolve(__dirname, "src/context"),
      "@components": path.resolve(__dirname, "src/components"),
      "@api": path.resolve(__dirname, "src/api.js"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@images": path.resolve(__dirname, "src/images"),
      "@svgs": path.resolve(__dirname, "src/svgs"),
      "@hocs": path.resolve(__dirname, "src/hocs"),
      "@const": path.resolve(__dirname, "src/const")
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "images"
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              ref: true
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }
    ]
  },
  optimization: {
    noEmitOnErrors: true
  },
  plugins: [
    // new PurgeCssPlugin({
    //   // whitelistPatterns: [/[\w-/:%]+(?<!:)/g],
    //   paths: glob.sync(`${PATH}/**/*`, { nodir: true })
    // }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ]
};
