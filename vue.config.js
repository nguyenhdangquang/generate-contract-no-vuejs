module.exports = {
  devServer: {
    proxy: 'http://34.107.150.222'
  },
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'local' ? 'source-map' : false,
    output: {
      filename: '[name].[hash:8].js',
      chunkFilename: '[name].[hash:8].js',
   }
  },
  productionSourceMap: false
}
