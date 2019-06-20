const path = require('path')
const UglifyPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const extractCSS = new ExtractTextPlugin({filename: 'stylesheets/[name]-one.css'});
const extractLESS = new ExtractTextPlugin({filename: 'stylesheets/[name]-two.css'});
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: './src/index.jsx',

  output: {
    path: path.resolve(__dirname, 'static'),
    filename: 'bundle.js',
    /** 打包完成后，资源放置到的文件夹 
     * output里面的publicPath表示的是打包生成的index.html文件里面引用资源的前缀
     */ 
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
        // 因为这个插件需要干涉模块转换的内容，所以需要使用它对应的 loader, 生产环境使用
        use: extractLESS.extract({ 
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true, // 使用 css 的压缩功能
              },
            }, 
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
        // 因为这个插件需要干涉模块转换的内容，所以需要使用它对应的 loader， 生产环境使用
        use: extractCSS.extract({ 
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true, // 使用 css 的压缩功能
              },
            },
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
  /** resolve为懒人准备的对象，省略代码 */
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, 'src')
    ],
    // 在文件中引用别的文件时候，不需要在写后缀
    extensions: [".js", ".jsx"],
  },

  devServer: {
    port: 8080
  },
  plugins: [
    new UglifyPlugin(),
    extractCSS,
    extractLESS,
    new webpack.DefinePlugin({
      __VERSION__: '"true"',
      __DEVELOPER__: JSON.stringify('development'),
    }),
  ],
}

/**
 * 生产环境使用的特殊的功能较开发环境
 * 1、脚本代码压缩
 * 2、css打包文件和脚本分离
 * 3、禁用sourcemap
 * 4、禁用热替换功能HMR
 * 5、css代码压缩
 * 6、图片压缩 image-webpack-loader
 */