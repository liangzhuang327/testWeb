var KoaRouter = require('koa-router');
var fs = require('fs');
var path = require('path');

var routerInstance = new KoaRouter()

routerInstance.get('*', (ctx, next)=>{
    ctx.body = ctx.render('****')
    next()
})

routerInstance.get('/', (ctx, next)=>{
    ctx.body = ctx.render()
    next()
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

routerInstance.get('/static/javascript/entryJs.js', (ctx, next) => {
    let tt = ctx
    let address = path.join(__dirname, '../../static/javascript/entryJs.js')
    let data = fs.readFileSync(address)
    ctx.body = data
    next()
})

routerInstance.get('/static/javascript/entryJs.js.map', (ctx, next) => {
    let address = path.join(__dirname, '../../static/javascript/entryJs.js.map')
    let data = fs.readFileSync(address)
    ctx.body = data
    next()
})

// routerInstance.get('*', (ctx, next)=>{
//     ctx.body = ctx.render('****')
//     next()
// })

module.exports={
    router: routerInstance
}