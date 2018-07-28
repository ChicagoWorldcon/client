const url = require('url');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const title = process.env.TITLE || 'Chicago Worldcon Bid Member Admin';

const apiHost = process.env.NODE_ENV === 'production' ? '' : (
  process.env.API_HOST ||
  (process.env.DOCKER_HOST && url.parse(process.env.DOCKER_HOST).hostname || 'localhost') + ':4430'
);
if (apiHost) console.log('Using API host', apiHost);

const cfg = {
  entry: './src/index.jsx',
  output: {
    path: __dirname + '/dist',
    publicPath: '/admin',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, exclude: /node_modules/,
        loader: 'babel-loader', query: {
          presets: [ 'es2015', 'react' ],
          plugins: [ 'transform-class-properties', 'transform-object-rest-spread' ]
        }
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      API_HOST: JSON.stringify(apiHost),
      TITLE: JSON.stringify(process.env.TITLE || 'Chicago Worldcon'),
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || ''),
      }
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: 'src/index.ejs',
      title
    })

  ],
  resolve: {
    extensions: [ '.js', '.jsx', '.css' ]
  },
  devServer: {
    contentBase: './dist'
  }
}

module.exports = cfg;
