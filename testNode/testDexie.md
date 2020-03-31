
### 一、需要在testNode中测试dexie.js依赖库，为了验证此库对indexedDB的封装；
1、引入dexie.js之前现状：
> testNode项目纯为一个node项目，用koa以及koa-router实现服务端返回html直接返回给浏览器渲染，没有多余的代码（服务端渲染）；要想测试dexie.js库，就需要扩充当前这种服务端渲染模式，**添加前端代码**

2、准备引入前端代码
> 现有testNode项目都是服务端渲染，返回hmtl给浏览器渲染，可以在html中动态引入远程脚本（一般上线项目都是远程脚本，脚本放到远程服务器上，此远程脚本即是前端所有的代码）

3、引入前端代码
> 在html中如下引入：
> ```js
> <script type="text/javascript" src="./client/root/index.js"></script>
> ```
#### 3-1:刷新没有任何效果
> 在network中看返回，在koa-router返回的html中看到'./client/root/index.js'的路径反应过来，html是从服务器取回来的，用相对路径取脚本肯定是取不到的，也需要从服务器上去取；但我不想又引入webpack-dev-server，将脚本放到webpack内置的静态资源服务器上，不想再启一个服务，那就将静态脚本也放在localhost:3000上，取的时候经过特定静态路由来取

解决：
> 设置一个取远程脚本的路由，并在html中发送此地址
> ```js
> client/root/index.js:
> var route = require('../route/index.js');
> let pathName = window.location.pathname;
> if (pathName == '/db'){
>   let dom = route['db']()
>   renderDom(dom)
> }
> 
> server/router.js:
> app.get('/client/root/index.js', (ctx, next)=>{
>   ctx.body = path.readFileSync(path.join(__dirname, './client/root/index.js'))
>   next()
> })
> html.js:
> <script type="text/javascript" src="http://localhost:3000/client/root/index.js">

#### 3-2:刷新 看network中的http://localhost:3000/client/root/index.js返回，发现是root/index.js中源码的样子；发现问题：没有将模块依赖都打包在一起，es6语法没有编译
> 写webpack.config.js 来通过root/index.js为入口，将所有依赖都引入打包到一个文件中；
> 建立.babelrc， 引入presets: ['env']
> 将html中远程脚本地址换成打包后的地址static/javascript/entryJs.js

#### 3-3:需要引入babel-loader，因为用了es6语法等
> npm intall babel-loader --save-dev
> npm install babel-core babel-cli --save-dev

根据报错提示：babel-loader的版本是8^，babel-core babel-cli是6^，能够兼容的最高babel-loader是7^,将babel-loader降低版本


#### 3-4:报错require is not defined,换成import报错Uncaught SyntaxError: Cannot use import statement outside a module
> 在前端入口文件，模拟实现的前端路由中root/inde.js，使用require报错，然后使用import就报上述错误，为什么前端文件没有经过babel语法解析？

原因：在node路由处理static/javascript/entryJs.js时候读取的文件错误导致的
解决：在此路由下，读取打包后的文件static/javascript/entryJs.js返回给前端即可

#### 3-5:大致流程通了之后，每个文件报的错误，不会定位到具体文件，只会定位到html中引入的static/javascript/entryJs.js这里，不容易查具体问题，需要加上sourcemap功能
> 加上之后貌似也都一样

现象：1、只是能看到编译后的代码了entryJs，但没有关联到源码文件；
     2、控制台有一个warning： DevTools failed to parse SourceMap: http://localhost:3000/static/javascript/entryJs.js.map
     3、在浏览器source面板page页签下没有webpack://文件夹（soucemap会对每个文件进行映射，此问夹下就是映射的souremap之前的源码文件）
原因：
> 根据第二个现象，查阅资料应该没有取到这个entryJs.map文件；如果将整个项目build之后的代码都放到资源服务器上，那么map文件也会在上边，浏览器应该会自行取到；但是我这个项目中没有静态资源服务器，我是用请求拦截方式模拟的静态资源获取，所以我在node加一个路由用来返回这个entryJs.js.map文件
> ```js
> server/router.js
> routerInstance.get('/static/javascript/entryJs.js.map', (ctx, next) => {
>   let address = path.join(__dirname, '../../static/javascript/entryJs.js.map')
>   let data = fs.readFileSync(address)
>   ctx.body = data
>   next()
>})
>```

结果：1、能够关联到源码文件
     2、source面板下page叶签下有了webapck://文件夹

疑问：为什么浏览器network中看不到取sourcemap文件的服务呢？即http://localhost:3000/static/javascript/entryJs.js.map？

测试：调试node路由，发现确实进入到了static/javascript/entryJs.js.map这个路由中！说明浏览器确实发出了这个请求，但是network中看不到！

结论：猜测应该是浏览器自行根据enable sourcemap选项自行发出的请求，没有在network中显示

#### 3-6:编译不通过，报错
```js
// 编译报错：
ERROR in ./src/client/route/index.jsx
Module build failed (from ./node_modules/babel-loader/lib/index.js):
SyntaxError: Unexpected token (10:8)

   8 |     }
   9 |     return ReactDOM.render(
> 10 |         <div>
     |         ^
  11 |             <button onClick={_onClick}>初始化db:</button>
  12 |         </div>, document.getElementById('container'))
  13 | }
```
> 报错原因是SyntaxError: Unexpected token，语法解析错误，这种错没有具体的错误原因，**语法解析出错**；div这种标签解析不了，测试在root/index.js中同样写一个<div>标签，同样报这个错误
> 确定原因：当前文件中的<div>是解析不了的，为什么解析不了?用的react,没有用react语法解析器 babel-preset-react

解决：
在.babelrc中的预设中加入“react”

#### 3-7:至此第3步前端代码引入后，前端代码能够跑通了！^_^
---
### 二、干！里边全是ts语法，娘希匹，干typescript
这个工作量有点儿大，还是先搞请dexie这个库是如何对原生IndexedDB进行封装的，嗨～～～

---

### 三、Dexie库对原生indexedDB的封装

#### 1、new Dexie()
- 此库对原生indexedDB的引入：
     - indexedDB的兼容写法（_global.indexedDB || _global.mozIndexedDB || _global.webkitIndexedDB || _global.msIndexedDB）
     - IDBKeyRange的兼容写法（_global.IDBKeyRange || _global.webkitIDBKeyRange）
     > 原生indexedDB的几个核心对象：
     > 1、indexedDB对象：浏览器原生提供indexedDB对象，作为开发者的操作接口
     > 2、IDBRequest对象（**表示打开的数据库连接**）：由indexedDB对象调用open方法和deleteDataBase方法返回的对象；数据库的操作都是通过这个对象完成的；其中调用open方法后生成的对象是IDBOpenDBRequest对象，此对象也是继承了IDBRequest对象，在此基础上多了两个监听事件IDBOpenDBRequest.onblocked和IDBOpenDBRequest.onupgradeneeded；
     > 3、IDBDatabase对象：打开数据成功以后，可以从IDBOpenDBRequest对象的result属性上面，拿到一个IDBDatabase对象，它表示**连接的数据库**。后面对数据库的操作，都通过这个对象完成。
     > 4、IDBObjectStore对象：**对应一个对象仓库**（object store），IDBDatabase.createObjectStore()返回的就是IDBObjectStore对象，IDBDatabase 对象的transaction()返回一个事务对象，该对象的objectStore()方法返回 IDBObjectStore 对象；
     > 5、IDBTransaction对象：IDBTransaction 对象用来异步操作数据库事务，所有的读写操作都要通过这个对象进行；IDBDatabase.transaction()返回的就是一个事物对象IDBTransation对象
     