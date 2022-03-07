// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const webpack = require("webpack");


const getBabelLoader = (lmdbLoader) => {
  if(lmdbLoader) return require.resolve('babel-loader-lmdb');
  return require.resolve('babel-loader');
}


const isProduction = process.env.NODE_ENV == "production";

const config = ({ useLMDBCache, cacheCompression }) => ({
  entry: "./src/index.js",
  cache: false,
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  stats: {
    warnings: false
  },
  // parallelism: 1,
  externals: {
    esbuild: 'jQuery',
    '@swc/core': "swc",
    inspector: '',
  },
  resolve: {
    fallback: {
      path: false,
      os: false,
      util: false,
      inspector: false,
      crypto: false,
      zlib: false,
      stream: false,
      https: false,
      http: false,
      url: false,
      assert: false,
      vm: false,
      querystring: false,
      fs: false,
      esbuild: false,
      worker_threads: false,
      constants: false,
      tty: false,
      child_process: false,
      'uglify-js': false,
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|.d.ts)$/i,
        include: [path.resolve("node_modules"), path.resolve("src")],
        loader: getBabelLoader(useLMDBCache),
        options: {
          cacheDirectory: "./cache" + cacheCompression,
          cacheCompression: cacheCompression,
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
});

module.exports = (useLMDBCache, cacheCompression) => {
  const configIs = config({ useLMDBCache, cacheCompression })
  if (isProduction) {
    configIs.mode = "production";
  } else {
    configIs.mode = "development";
  }
  return configIs;
};
