const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin");


const isProduction = process.env.NODE_ENV === 'production';


module.exports = {
  entry: './scripts/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  mode: 'none',
  devtool: 'source-map',
  devServer: {
    contentBase: './public'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  plugins: [
    new UglifyJsPlugin({ sourceMap: !isProduction }),
    new CopyWebpackPlugin([
      { from: './index.html' },
      { from: './index.css' }
    ])
  ]
  
};