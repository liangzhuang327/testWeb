# koa
### 1、app.use了两个中间件，页面显示not found
> 调试 node --inspect-brk=9000 src/server/app.js发现没有走第二个中间件，结合koa中compose函数
> 找出，没有调用next()方法。
#### 总结：koa中间件中一定要调用next方法，否则该中间件之后的中间件都不会走


# Koa-router
### 1、先后有两个路由'/say'和'*'，发一个/say的url，只会进入第一个路由。路由匹配到一个就不会继续向下匹配？
> 已知：koa-router实例的routes方法会返回一个函数，就是添加到koa中的中间件。当一个请求过来的时候，进
> 入路由中间件，调用`koaRouter.match`方法，去`koaRouter.stack`中遍历所有的`layer`实例，将符合请
> 求路由中path的`layer`过滤出来放入一个数组`matched`。最后将过滤完的`matched`数组中layer的执行函
> 数传入koa的`compose`函数。所以这个问题和koa中第二个中间件不调用的问题一样了，只要调用next,就会进入
> 下一个匹配到的路由，如果不调用next，就不会进入下一个路由

> 对于这个问题就是：如果在`/say`的路由处理函数中调用next,就会进入`*`的路由，如果不调用next就不会进入
> `／*`的路由

### 2、走了koa-router之后，koa不走koa-router之后的中间件了
> 问题现象：浏览器输入localhost:3000/say，会返回相应的hmtl,但是不打印下方中间件的console中1，
> 1异步完成 4。也就是说kao走完router,不走后边的中间件了
> 问题代码：
```js
// app.js file
app.use(html.html)
   .use(router.router.routes())
   .use(router.router.allowedMethods())
   .use(async function(ctx, next){
      console.log(1)
      await new Promise(resolve=>{
        setTimeout(()=>{
          resolve(1)
        },3000)
      })
      console.log('1 异步完成')
      await next() 
      console.log(4)
    })
   .listen(3000)

// router.js file
routerInstance.get('/say', (ctx, next)=>{
    ctx.body = ctx.render('say')
    ctx.status = 200
    //next() // 此处调用next方法就可以进入*的路由中去
})

routerInstance.get('*', (ctx, next)=>{
    ctx.body = ctx.render('****')
    //next()
})
```
> **已知**：koa-router源码中知道，请求url匹配到的路由数组`matched`，传入`compose`函数中顺序执行
> 分析app.js中的代码，在koa中最终的中间件`middleware`中包含四个中间件，在koa-router中匹配到的
> 路由数组`matched`有两个/say和/*两个`layer`，当请求到来，走到koa-router时候，会将`matched`中
> 的`layer`（这里类似与koa的中间件）传入koa-router中的`compose`函数，经compose函数顺序执行
> **已知**：`copomse`执行函数中，如果传入数组函数中，如果第一个函数没有调用`next`方法是不会进入第
> 二个函数的

> **结论**：因为路由layer也就是中间件`/say`以及`/*`中都没有调用`next`方法，导致koa无法调用其剩余的
> 中间件

### 3、针对上一结论中：导致koa无法调用剩余的中间件，为什么koa-router中的layer能影响koa中间件的执行？

> koa-router源码中的compose函数：
```js
function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      // 当把matched数组中所有的layer都执行完之后，将fn赋值为compose函数传进来的next
      // 而此时的next的真面目就是koa中koa-router后边的中间件！
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, function next () {
          return dispatch(i + 1)
        }))
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```
> **原因**：koa-router中的compose函数将matched数组执行完之后，此时的next就为koa中下一个中间件！