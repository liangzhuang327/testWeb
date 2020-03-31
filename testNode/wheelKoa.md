### 1、实例化
> 实例化新建一个实例，将koa中比较重要的几个api实例化出来，use/listen/callback/handleRequest
> 这几个关键方法，用来融合中间件送给http.createServer做为处理函数
```js
class Applycation extends Events{
    constructor(options){
        super()
        this.middlewares=[],
        this.context = Object.create(context),
        this.request = Object.create(request),
        this.response = Object.create(response),
    }

    use(fn){
        this.middlewares.push(fn)
    }

    listen(...args){
        const server = http.createServer(this.callback())
        server.listen(...args)
    }

    // return 一个函数，用作请求进来后的回调函数
    callback(){
        const fn = compose(this.middlewares);
        const handleRequest = (req, res) => {
            // 每次请求进来后，动态构建最新的ctx
            const context = this.createContext(req, res)
            this.handleRequest(ctx, fn)
        } 
        return handleRequest
    }

    // 让每次的请求 将所有的中间件都走一遍
    handleRequest(ctx, fnMiddleware){
        // 每次请求进来后设置默认状态码404
        const res = ctx.res;
        res.statusCode = 404;
        const onerror = err => ctx.onerror(err);
        const handleResponse = () => respond(ctx);
        onFinished(res, onerror);
        return fnMiddleware(ctx).then(handleResponse).catch(onerror);
    }
}
```
### 2、运行时, 从地址栏引起的一次服务调用
```js
    // 返回一个组合调用的 函数
    // 用闭包，存储调用位置指针index
    function compose(ctx, fnMiddleware){
        return function (context, next) {
            // last called middleware #
            let index = -1
            return dispatch(0)
            function dispatch (i) {
                if (i <= index) return Promise.reject(new Error('next() called multiple times'))
                index = i
                let fn = middleware[i]
                // 当运行到i=middleware.length,本可以直接return 为什么要多走一步将next赋/// 值给fn? 这就是绝妙之处，主要是为了koa插件能完美衔接，例如koa和koa-router中中间件的调用，
                if (i === middleware.length) fn = next
                if (!fn) return Promise.resolve()
                try {
                    return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
                } catch (err) {
                    return Promise.reject(err)
                }
            }
        }
    }
```