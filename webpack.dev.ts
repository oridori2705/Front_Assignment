import path from 'path'
import { Configuration as WebpackConfiguration } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import merge from 'webpack-merge'

import common from './webpack.common'
interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration
}

const devConfiguration: Configuration = {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    port: 3000,
    open: true,
    compress: true,
    historyApiFallback: true,
    hot: true
  },
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: [new BundleAnalyzerPlugin()]
}

export default merge(common, devConfiguration)
