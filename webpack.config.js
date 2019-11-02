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
  mode: dev ? "development" : "production",
  devtool: "cheap-module-eval-source-map",
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
      "@hocs": path.resolve(__dirname, "src/hocs")
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
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: dev
            }
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: dev
            }
          },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: [require("tailwindcss"), require("autoprefixer")]
            }
          }
        ]
      }
    ]
  },
  optimization: {
    noEmitOnErrors: true
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": { NODE_ENV: JSON.stringify(process.env.NODE_ENV) }
    }),
    new MiniCssExtractPlugin({
      filename: dev ? "styles.css" : "styles-[contenthash].css",
      chunkFilename: "styles.css"
    }),
    // new PurgeCssPlugin({
    //   // whitelistPatterns: [/[\w-/:%]+(?<!:)/g],
    //   paths: glob.sync(`${PATH}/**/*`, { nodir: true })
    // }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    ...(!dev ? [new BrotliPlugin({})] : [])
  ],
  devServer: {
    contentBase: [path.join(__dirname, "public")],
    historyApiFallback: true,
    open: true
  }
};
