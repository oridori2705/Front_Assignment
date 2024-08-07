import path from 'path'
import webpack from 'webpack'
import { merge } from 'webpack-merge'

import common from './webpack.common'

const prodConfiguration: webpack.Configuration = {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [],
  optimization: {
    usedExports: true,
    minimize: true
  }
}

export default merge(common, prodConfiguration)
