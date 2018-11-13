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
        // use: extractLESS.extract({ 
        //   fallback: 'style-loader',
        //   use: [
        //     {loader: 'css-loader'}, 
        //     {loader: 'less-loader'},
        //     {
        //       loader: 'postcss-loader',
        //       options: {
        //         ident: 'postcss',
        //         plugins: [
        //           autoprefixer()
        //         ]
        //       }
        //     },
        //   ],
        // }), 
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
        // 因为这个插件需要干涉模块转换的内容，所以需要使用它对应的 loader， 生产环境使用
        // use: extractCSS.extract({ 
        //   fallback: 'style-loader',
        //   use: [
        //     {loader: 'css-loader'},
        //     { // 样式兼容各个浏览器，补全前缀 -webkit-
        //       loader: 'postcss-loader',
        //       options: {
        //         ident: 'postcss',
        //         plugins: [
        //           autoprefixer()
        //         ]
        //       }
        //     },
        //   ],
        // }), 
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
      /*{
        test: /\.html$/,
        use: [ {
          loader: 'html-loader',
          options: {
            minimize: true
          }
        }]
      },*/
    ],
  },

  // 代码模块路径解析的配置
  /** resolve为懒人准备的对象，省略代码 */
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, 'src')
    ],
    // 在文件中引用别的文件时候，不需要在写后缀
    extensions: [".js",".jsx"], // 减少没必要的后缀匹配，增加webpack的构建速度
  },

  devServer: {
    /* 更改配置文件以告知开发服务器在哪里查找文件：这告诉webpack-dev-server我们从static目录中提供文件localhost:8080 */
    //  contentBase: './root', // path.resolve(__dirname, "../root/")效果一样

    /**webpack-dev-server,访问端口的时候默认的访问文件，如果找不到该文件，访问localhost:8080就会显示根目录下的所有文件
     * 测：dev-server只会寻找index.html，找到则在访问端口时候展现该index.html页面，若根目录下没有index.html，不论
     * 在此处设置index属性为什么，都只会显示所有的文件夹
     */
    index:'index.html',

    /** dev-server用来放置打包资源的虚拟目录
     * evServer里面的publicPath表示的是打包生成的静态文件所在的位置
     * （若是devServer里面的publicPath没有设置，则会认为是output里面设置的publicPath的值）
     */
    /**outPut里的publicPath=> outpubpath; devServer里的publicPath=>serverpubpath
     * 1、outpubpath和serverpubpath都设置了，资源会放置在outpubpath路径下（若两个不同，serverpubpath虚拟目录下不会有资源）
     * 2、outpubPath没有设置，设置了serverpubpath，资源就会放置在serverpubpath虚拟目录下
     * 3、若资源文件多，需要一个文件夹assets,简单为便，直接在outPut里的publicPath设置就行，devServer里的publicPath不用管即可
     */
    // publicPath: '/assets/',

    hot: true, // dev server 的配置要启动 hot，或者在命令行中带参数开启
    port: 8080
    // inline: true,
  },
  devtool: 'source-map',

  plugins: [
    new UglifyPlugin({sourceMap: true}), 
    // 使用 uglifyjs-webpack-plugin 来压缩 JS 代码
    // 如果你留意了我们一开始直接使用 webpack 构建的结果，你会发现默认已经使用了 JS 代码压缩的插件
    // 这其实也是我们命令中的 --mode production 的效果，后续的小节会介绍 webpack 的 mode 参数
    extractCSS,
    extractLESS,
    new webpack.DefinePlugin({
      __VERSION__: '"true"',
      __DEVELOPER__: JSON.stringify('development'),
    }),
    new webpack.HotModuleReplacementPlugin(),// Hot Module Replacement 的插件 实现热替换
  ],
}