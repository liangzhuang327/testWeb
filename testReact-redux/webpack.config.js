const path = require('path')
const UglifyPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const extractCSS = new ExtractTextPlugin({filename: 'stylesheets/[name]-one.css', disable: true});
const extractLESS = new ExtractTextPlugin({filename: 'stylesheets/[name]-two.css', disable: true});
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: './src/index.jsx',

  output: {
    path: path.resolve(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: `http://localhost:8080/assets`
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)?/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: 'babel-loader',
      },
      {
        test: /\.less$/,
        include: [
            path.resolve(__dirname, 'src'),
          ], 
        use: extractLESS.extract({ 
          use: [
            {loader: 'style-loader'},
            {loader: 'css-loader'}, 
            {loader: 'less-loader'},
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [
                  autoprefixer()
                ]
              }
            },
          ],
        }), 
      },
      {
        test: /\.css$/,
        include: [
            path.resolve(__dirname, 'src'),
          ], 
        use: extractCSS.extract({ 
          use: [
            {loader: 'style-loader'},
            {loader: 'css-loader'},
            { // 样式兼容各个浏览器，补全前缀 -webkit-
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [
                  autoprefixer()
                ]
              }
            },
          ],
        }), 
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg|ico)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: '[path][hash:8].[name].[ext]', // [path],该图片本地文件路径
        },
        include: [path.resolve(__dirname, 'src')],
      },
      {
　　　　　　test: /\.html$/,
　　　　　　loader: 'html-withimg-loader'
　　　　},
    ],
  },
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, 'src')
    ],
    // 在文件中引用别的文件时候，不需要在写后缀
    extensions: [".js",".jsx"], // 减少没必要的后缀匹配，增加webpack的构建速度
  },

  devServer: {
    index:'index.html',
    hot: true,
    port: 8080
  },
  devtool: 'source-map',

  plugins: [
    new UglifyPlugin({sourceMap: true}), 
    extractCSS,
    extractLESS,
    new webpack.DefinePlugin({
      __VERSION__: '"true"',
      __DEVELOPER__: JSON.stringify('development'),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
}