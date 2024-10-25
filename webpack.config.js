const path = require('path');
const glob = require('glob');

// Configuration for bundling public/reusable-js/to-bundle-for-nodejs/*.js files into public/reusable-js/bundled-for-nodejs/*.js
const bundleForNodeJsConfig = {
  target: 'node',
  entry: glob.sync('./public/reusable-js/to-bundle-for-nodejs/*.js').reduce((acc, filePath) => {
    const entryName = path.basename(filePath, '.js');
    acc[entryName] = path.resolve(filePath);
    return acc;
  }, {}),
  output: {
    path: path.resolve(__dirname, 'public/reusable-js/bundled-for-nodejs'),
    filename: '[name].js',
    library: {
      type: 'commonjs-module',
    },
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.mjs', '.json'],
    modules: [path.resolve(__dirname, 'public'), 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};

module.exports = [bundleForNodeJsConfig];
