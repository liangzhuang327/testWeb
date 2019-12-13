var KoaRouter = require('koa-router');

var routerInstance = new KoaRouter()

routerInstance.get('/', (ctx, next)=>{
    ctx.body = ctx.render()
})

routerInstance.get('/say', (ctx, next)=>{
    ctx.body = ctx.render('say')
    ctx.status = 200
    next() // 此处调用next方法就可以进入*的路由中去
})

routerInstance.use('/talk', (ctx, next)=>{
    ctx.body = ctx.render('talk')
})

routerInstance.redirect('/action', 'say', 301)
routerInstance.get('/action', (ctx, next)=>{
    ctx.redirect('/say')
    ctx.status = 302
})

// routerInstance.get('*', (ctx, next)=>{
//     ctx.body = ctx.render('****')
//     next()
// })

module.exports={
    router: routerInstance
}