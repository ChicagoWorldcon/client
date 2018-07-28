const url = require('url');
const webpack = require('webpack');

const title = process.env.TITLE || 'Chicago Worldcon Bid';

const cfg = {
  entry: [
    './src/index.jsx'
  ],
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: "bundle.js"
  },
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'], exclude: /flexboxgrid/ },
      { test: /\.css$/, loader: 'style-loader!css-loader?modules', include: /flexboxgrid/, },
      { test: /\.jsx?$/, exclude: /node_modules/, use: ['babel-loader'] },
      { test: /\.(jpe?g|png|gif|svg)$/i, loader: 'file-loader?name=img/[name].[ext]' },
        //{ test: /\.(jpe?g|png|gif|svg)$/i, loader: 'url-loader?limit=8192' }
      {
        type: 'javascript/auto',
        test: /\.messages\.json$/,
        loader: 'messageformat-loader',
        options: {
            locale: ['en'],
        }
      }
    ]
  },
  resolve: {
    extensions: [ '.js', '.jsx', '.css' ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin()
  ]
};

const globals = {
  API_HOST: JSON.stringify(''),
  ENV: JSON.stringify(process.env.NODE_ENV || ''),
  TITLE: JSON.stringify(title)
}

if (process.env.NODE_ENV === 'production') {

  console.log('PRODUCTION build\n');
  globals['process.env'] = {
    NODE_ENV: JSON.stringify('production')
  }

} else {

  console.log((process.env.NODE_ENV || 'development').toUpperCase() + ' build');
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  cfg.entry.push('webpack/hot/dev-server');
  cfg.plugins.push(new HtmlWebpackPlugin({
    inject: 'body',
    template: 'src/index.ejs',
    title
  }));

  const apiHost = process.env.API_HOST ||
    (process.env.DOCKER_HOST && url.parse(process.env.DOCKER_HOST).hostname || 'localhost') + ':4430';
  globals.API_HOST = JSON.stringify(apiHost);
  console.log('Using API host', apiHost, '\n');
}
cfg.plugins.push(new webpack.DefinePlugin(globals));

module.exports = cfg;
