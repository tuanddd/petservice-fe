const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = merge(common, {
  mode: "development",
  devtool: "cheap-module-eval-source-map",

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: true
            }
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true
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
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css",
      chunkFilename: "styles.css"
    })
    // new PurgeCssPlugin({
    //   // whitelistPatterns: [/[\w-/:%]+(?<!:)/g],
    //   paths: glob.sync(`${PATH}/**/*`, { nodir: true })
    // }),
  ],
  devServer: {
    contentBase: [path.join(__dirname, "public")],
    historyApiFallback: true,
    open: true
  }
});
