module.exports = {
  mode: "development",
  entry: {
    bundle: './src/main.js',
    demo: "./src/demo.js"
  },
  output: {
    filename: '[name].js',
    publicPath: '.'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader"
      }
    ]
  },
  devtool: "source-map"
}