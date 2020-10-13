var webpack = require('webpack')
const env = process.env.NODE_ENV === 'development'
  ? require('./config/dev.env')
  : require('./config/prod.env')

module.exports = {
  runtimeCompiler: true,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': env
      })
    ]
  }
}
