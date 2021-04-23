const path = require('path');

module.exports = {
  mode: 'development',
  target: ['web', 'es5'],  // ここ
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        include: [
            path.resolve(__dirname, 'src'), 
            path.resolve(__dirname, 'node_modules', 'react'),
            path.resolve(__dirname, 'node_modules', 'react-dom')
        ],
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            configFile: 'tsconfig.json',
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: 'src/index.ejs',
    //   filename: 'index.html',
    //   inject: 'body',
    //   hash: true,
    // }),
  ],
};