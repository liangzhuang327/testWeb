1 、// npm init(创建package.json)   npm install(创建node_modules并安装依赖)

2、 // npm install -P (像dependencies安装运行依赖) npm install <> -D (像devDependencies安装开发依赖)


## 编译报错，说<div>这个标签语法错误， 解决办法是.babelrc中使用es2015,react,stage-1

3、// webpack --watch(会监听脚本的变化，并重新编译，但不会刷新浏览器) ====> webpack-dev-server来做到；webpack-dev-server提供一个简单的web服务器和实时重新加载的能力
a:更改配置文件（webpack.config.js）,告诉开发服务器去哪里查找文件


4、//提示: `当配置文件在根目录下`，`且配置文件名为 webpack.config.js`，这两个条件都满足时，可以省略--config参数来启动webpack或wepack dev server; 若不是，要想启动编译程序或者webpack服务就得加--config参数： 
a: webpack --config weback.config.sumfile.js
b: webpack-dev-server --config webpack.config.sumfile.js


## 使用webpace-dev-server后，访问localhost:8080不出现页面，发现id为container的根结点存在，但是里边没有dom节点；  解决办法： 因为根结点引用的打包好的js文件路径不对，使用了webpack-dev-server后就要使用存在于内存中的打包好的文件，即：localhost:8080/bundle.js，不能使用本地的打包好的文件（会找不到）

## Error: Chunk.entrypoints: Use Chunks.groupsIterable and filter by instanceof Entrypoint instead at Chunk.get (/Users/liangzha/gitSelf/project/testWeb/testWebpack/node_modules/webpack/lib/Chunk.js:846:9); 原因：extract-text-webpack-plugin还不能支持webpack4.0.0以上的版本。解决：npm install --save-dev extract-webpack-plugin@next

5、// extract-text-webpack-plugin插件的引用 
## 该插件会将所有的入口 chunk(entry chunks)中引用的 *.css，移动到独立分离的 CSS 文件。因此，你的样式将不再内嵌到 JS bundle 中，而是会放到一个单独的 CSS 文件（即 styles.css）当中。 如果你的样式文件大小较大，这会做更快提前加载，因为 CSS bundle 会跟 JS bundle 并行加载。优点：单独打包css，可以和js并行加载，缺点：增加了网络请求，不能热替换，适用于生产环境
 new ExtractTextPlugin('portal.css')此时传入的就是打包好的css文件名称，路径和output里边设置的路径一样

 6、less-loader安装问题
 ## Error: Cannot find module 'less' 原因，官网给出解释：The less-loader requires less as peerDependency. Thus you are able to control the versions accurately.意思就是less-loader依赖less, 所以还需要安装less模块




7、打包less文件遇到问题：
 ERROR in ./src/style/test.less (./node_modules/less-loader/dist/cjs.js!./src/style/test.less) 1:5
    Module parse failed: Unexpected token (1:5)
    You may need an appropriate loader to handle this file type.
    > span {
    |   color: blue;
    | }
## 打包less文件 不仅需要less-loader来转，还需要css-loader来预处理

8、webpack打包图片的时候 SyntaxError: Unexpected character '�' (1:0)
## webpack打包图片的时候，出现此种错误，大概有三个原因：1、确定不止有url-loader还要有file-loader；2、新增了图片，应重新启动webpack打包，热替换会有可能出现此种问题；3、在webpack中的modules下的rule里的test类型中是否监测了某种图片的类型（例如没有jpeg,上传的图片又是jpeg格式） test: /\.(jpg|png|gif|ico)$/

9、webpack打包图片：项目中（不包含html中，比如css里的url(),或者js里的src属性）有图片的的路径是https的（项目是http的）:该资源会被浏览器block掉
浏览器控制台提示：Cross-Origin Read Blocking (CORB) blocked cross-origin response https://github.com/liangzhuang327/Drips/blob/master/pictrues/3.png with MIME type text/html. See https://www.chromestatus.com/feature/5629709824032768 for more details.
## http网站请求https资源也是可行的，只要https资源放置的服务器设置了允许跨域，就能请求回来；而像github的服务器就不行，如例子中那样；追根到底的问题还是跨域问题，http与https本身就是不同域；引申到解决跨域问题就

10、webpack 的 devtool设置了sourcemap: true ，打包结果是：
Built at: 2018-11-06 21:24:02
                                Asset       Size  Chunks             Chunk Names
                            bundle.js    383 KiB    main  [emitted]  main
c78d6bba178c5a95327b4157fabba42c.jpeg   43.5 KiB          [emitted]  
             stylesheets/main-one.css  759 bytes    main  [emitted]  main
         stylesheets/main-one.css.map  101 bytes    main  [emitted]  main
             stylesheets/main-two.css   64 bytes    main  [emitted]  main
         stylesheets/main-two.css.map  101 bytes    main  [emitted]  main
如上，css的sorcemap生效了，但是js脚本只有一个bundle.js,并没有bundle.js.map文件，脚本的sourcemap没有生效！
## 解决办法：在uglifyjs-webpack-plugin此压缩插件中，实例化的时候传入参数sourcemap: true （此插件中也有此属性！），然后打包就生效了；如下：
Built at: 2018-11-06 21:27:10
                                Asset       Size  Chunks             Chunk Names
                            bundle.js    383 KiB    main  [emitted]  main
                        bundle.js.map   1.52 MiB    main  [emitted]  main
c78d6bba178c5a95327b4157fabba42c.jpeg   43.5 KiB          [emitted]  
             stylesheets/main-one.css  759 bytes    main  [emitted]  main
         stylesheets/main-one.css.map  101 bytes    main  [emitted]  main
             stylesheets/main-two.css   64 bytes    main  [emitted]  main
         stylesheets/main-two.css.map  101 bytes    main  [emitted]  main

11、webpack.DefinePlugin定义的变量，在脚本中引用，始终报undefined的错误：
## 原因：因为插件执行直接文本替换，所以赋予它的值必须包含字符串本身内部的实际引号。通常，这可以通过替代引号来完成，例如'"production"'，或通过使用JSON.stringify('production')

12、图片在webpack-dev-server打包完成之后，始终不显示
## webpack打包的路径大致分为三种：1、css里的background,这种直接被webpack接手，路径会在打包前后根据对应关系自动替换；2、js脚本里的图片<img src> 或者内连样式中的background，这种因为在脚本中（猜测是无法识别.jpg等后缀），并不会经过url-loader和file-loader处理，所以webpack处理不了这种。解决方法，先把图片require('../rose.jpeg')引进来，赋值给变量然后在引用；3、在根html中图片，url-loader无法处理.html里的图片，所以就需要借助其他的loader  html-withimg-loader来处理

13、webpack4中启动开发模式，development mode之后webpack会自动启用一些开发模式的配置，比如Hot Reloading,即有改动自动刷新页面。但对于开发来说，页面复杂，调取服务多的时候这种Hot Reloading还是很不友好；所以有了 Hot Modules Replacement（模块热替换），即是某一模块发生变化，只会在页面局部刷新此模块的改动，不会造成整个页面的刷新。但是webpack4的development mode中并没有引用此功能，需要我们手动配置
## 如何配置：（1个配置，1个插件,1个入口文件改动）即可以完成HMR功能；                    需要在配置文件里的 devServer对象中将hot设置为true（dev server 的配置要启动 hot，或者在命令行中带参数开启），一个插件webpack.HotModuleReplacementPlugin（实现替换的功能），一个入口文件改动就是在入口文件里设定替换if (module.hot){module.hot.accept()}
问题：无法对css来进行热替换？？
## 原因：css/less无法实现热替换是因为开发环境使用了extract-text-webpack-plugin这个插件使打包出来的css和js分离；解决：在开发环境中不使用样式分离，开发方便，热替换才是最关键；方法：不使用extract-text-webpack-plugin这个插件；如果使用这个插件的话只需在初始化此插件的时候设置参数disable为true，并且在module.rules里边的处理css/less的loader稍作改变如
  test: /\.scss$/,
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: ['css-loader', 'sass-loader']
  })
改变之后：
...
  test: /\.scss$/,
  use: ['style-loader', 'css-loader', 'sass-loader']
...
再次重启webpack，就会发现样式文件也会有热替换了

