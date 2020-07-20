const { merge } = require("webpack-merge");
const common = require("./webpack.common.js"); 
          
module.exports = merge(common, {
  mode: "development",
  output: {
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: "/node_modules/",
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-react"],
              plugins: ["@babel/transform-runtime"]
            }
          }
        ]
      }
    ]
  },
  devServer: {
    proxy: {
      '/admin/api': 'http://localhost:3000'
    },
    historyApiFallback: true
  }
});
