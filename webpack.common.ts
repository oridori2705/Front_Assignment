import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import path from 'path'

const configuration: webpack.Configuration = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  entry: './src/index.tsx',
  module: {},

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html')
    }),
    new webpack.ProvidePlugin({ React: 'react' }),
    new CleanWebpackPlugin()
  ]
}

export default configuration
