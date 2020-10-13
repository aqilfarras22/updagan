const path = require('path');
const vueLoaderConfig = require('../build/vue-loader.conf');

// load the default config generator.
// const genDefaultConfig = require('@storybook/vue/dist/server/config/defaults/webpack.config.js');

// module.exports = (baseConfig, env) => {
//   const config = genDefaultConfig(baseConfig, env);

//   // Extend it as you need.
//   function resolve(dir) {
//     return path.join(__dirname, '..', dir);
//   }

//   config.resolve = {
//     extensions: ['.js', '.vue', '.json'],
//     alias: {
//       vue$: 'vue/dist/vue.esm.js',
//       '@': resolve('src'),
//     },
//   };

//   return config;
// };

module.exports = (baseConfig, env, genDefaultConfig) => {
  // make sure you have babel-loader@8 installed and @babel/core@7
  genDefaultConfig.module.rules[0].use[0].loader = require.resolve('babel-loader')

  // This reflect what presets you want webpack's babel loader to go through while transpiling your code
  // use @babel/preset-vue for JSX and env (instead of staged presets)
  genDefaultConfig.module.rules[0].use[0].options.presets = [
    require.resolve('babel-preset-vue'),
    require.resolve('@babel/preset-env'),
  ]
  // This reflect what plugins you want webpack's babel loader to go through while transpiling your code
  // use @babel/plugin-proposal-class-properties for class arrow functions
  genDefaultConfig.module.rules[0].use[0].options.plugins = [
    require.resolve('@babel/plugin-proposal-class-properties'),
  ]
  genDefaultConfig.module = {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      // Transform all ES6 files to plain old ES5.
      {
        test: /\.(js|jsx)$/,
        exclude: [/bower_components/, /node_modules/, /styles/],
        loader: 'babel-loader',
        include: path.resolve(__dirname, '../../src')
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader', 'sass-loader?sourceMap'],
        include: path.resolve(__dirname, '../../')
      },
      {
				test: /.(png|woff|woff2|eot|ttf|svg)$/,
				loader: 'url-loader?limit=10000',
        include: path.resolve(__dirname, '../../')
			},
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader', 'sass-loader?sourceMap'],
        include: path.resolve(__dirname, '../../')
      },
    ]
  }
  /**
   * Resolve import paths from global.SRCDIR
   * @see  http://moduscreate.com/es6-es2015-import-no-relative-path-webpack/
   */
  genDefaultConfig.resolve = {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    },
  }

  // Extend it as you need.
  function resolve(dir) {
    return path.join(__dirname, '..', dir);
  }
  return genDefaultConfig
}
