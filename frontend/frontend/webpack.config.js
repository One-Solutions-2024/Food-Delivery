const path = require('path');

module.exports = {
  // Entry point for your app
  entry: './src/index.js',

  // Output configuration
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  // Add the resolve configuration for Node.js polyfills
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'), // Polyfill for the crypto module
    },
  },

  // Module rules and loaders
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },

  // Optional: Add source-map support
  devtool: 'source-map',
};
