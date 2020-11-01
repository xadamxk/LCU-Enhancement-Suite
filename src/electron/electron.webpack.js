const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  return {
    context: path.resolve(__dirname),
    entry: './main.ts',
    target: 'electron-main',
    devtool: argv.mode === 'production' ? undefined : 'inline-source-map',
    stats: 'errors-only',
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
    },
    optimization: {
      minimize: argv.mode === 'production',
      nodeEnv: false
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.electron.json'
          }
        },
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: 'assets',
            to: 'assets',
            noErrorOnMissing: true
          },
        ],
      }),
    ],
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, '..', '..', 'dist', 'electron'),
    }
  }
};
