'use strict';

const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getClientEnvironment = require('./env');
const paths = require('./paths');
var ExtractTextPlugin = require('extract-text-webpack-plugin')
// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = '/';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
const publicUrl = '';
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);
const cssFilePath = ' static/css/bundle.css'
// This is the development configuration.
// It is focused on developer experience and fast rebuilds.
// The production configuration is different and lives in a separate file.
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
console.log(require.resolve('antd-mobile').replace(/warn\.js$/, ''))
console.log(paths.appNodeModules + 'antd-mobile/lib/icon/style/assets')
module.exports = {
  // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
  // See the discussion in https://github.com/facebookincubator/create-react-app/issues/343.
  devtool: 'cheap-module-source-map',
  // These are the "entry points" to our application.
  // This means they will be the "root" imports that are included in JS bundle.
  // The first two entry points enable "hot" CSS and auto-refreshes for JS.
  entry: [
  
    require.resolve('./polyfills'),
  
    require.resolve('react-dev-utils/webpackHotDevClient'),
  
    paths.appIndexJs,

  ],
  output: {
    pathinfo: true,
  
    filename: 'static/js/bundle.js',
  
    chunkFilename: 'static/js/[name].chunk.js',

    publicPath: publicPath,

    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
   
    modules: ['node_modules', paths.appNodeModules].concat(
    
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
  
    extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
    alias: {
      
      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      '@': path.join(__dirname, '../src'),
      'react-native': 'react-native-web',
      'containers':path.resolve(__dirname, '../src/containers'),
      'src':path.resolve(__dirname, '../src/'),
      'images':path.resolve(__dirname, '../src/images'),
      'components':path.resolve(__dirname, '../src/components'),
    },
    plugins: [
     
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve('eslint'),
            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: paths.appSrc,
      },
      {
        test: /\.(svg)$/i,
        loader: 'svg-sprite-loader',
        include: [
          //paths.appNodeModules + 'antd-mobile/lib/icon/style/assets',
          require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // antd-mobile使用的svg目录
          //paths.appSrc,
          //path.resolve(__dirname, '../src/images'),  // 个人的svg文件目录，如果自己有svg需要在这里配置
          //path.resolve('react-photoswipe').replace(/warn\.js$/, '')
        ]
      },
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.(svg)$/i,
            loader: require.resolve('url-loader'),
            include: [
              path.resolve('node_modules/react-photoswipe').replace(/warn\.js$/, ''),
              path.resolve(__dirname, '../src/images')
            ]
          },
          // Process JS with Babel.
          {
            test: /\.(js|jsx|mjs)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {
              cacheDirectory: true,
              plugins: [["import", {
                libraryName: "antd-mobile",
                style: 'css'
              }]]
            },
          },

          {
            test: /\.css$/,
            include: /node_modules/,
            use: ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: [
                {
                  loader: "css-loader",
                  options: {sourceMap: true}
                },
                "postcss-loader"
              ]
            })
          },
         
          // {
          //   test: /\.css$/,
          //   include: /node_modules/,
          //   use: [
          //     require.resolve('style-loader'),
          //     {
          //       loader: require.resolve('css-loader'),
          //       options: {
          //         importLoaders: 1,
          //       },
          //     },
          //     {
          //       loader: require.resolve('postcss-loader'),
          //       options: {
          //         // Necessary for external CSS imports to work
          //         // https://github.com/facebookincubator/create-react-app/issues/2677
          //         ident: 'postcss',
          //         plugins: () => [
          //           require('postcss-flexbugs-fixes'),
          //           autoprefixer({
          //             browsers: [
          //               '>1%',
          //               'last 4 versions',
          //               'Firefox ESR',
          //               'not ie < 9', // React doesn't support IE8 anyway
          //             ],
          //             flexbox: 'no-2009',
          //           }),
          //         ],
          //       },
          //     },
          //   ],
          // },
          {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: [
                {
                  loader: "css-loader",
                  options: {sourceMap: true}
                },
                "postcss-loader",
                "sass-loader",
              ]
            })
          },
          {
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/, /\.scss$/,/\.svg$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
  
    ],
  },
  plugins: [
   
    new ExtractTextPlugin(cssFilePath),
    new InterpolateHtmlPlugin(env.raw),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml ,
    }),
    // Add module names to factory functions so they appear in browser profiler.
    new webpack.NamedModulesPlugin(),
    
    new webpack.DefinePlugin(env.stringified),
   
    new webpack.HotModuleReplacementPlugin(),
   
    new CaseSensitivePathsPlugin(),
   
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
   
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  
  performance: {
    hints: false,
  },
};
