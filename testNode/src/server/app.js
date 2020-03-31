var http = require('http');
var path = require('path');
var html = require('./html.js')
var Koa = require('koa');
var router = require('./router.js')
var staticServer = require('koa-static')

var app = new Koa()

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
      await next() // 没有await: 1 2 43;有await: 1234
      console.log(4)
    })
   //  .use(async function(ctx, next){
   //    console.log(2)
   //    await new Promise(resolve=>{
   //      setTimeout(()=>{
   //        resolve(1)
   //      },3000)
   //    })
   //    console.log('2 异步完成')
   //    next()
   //    console.log(3)
   //  })
  //  .use(router.router.routes())
  //  .use(router.router.allowedMethods())
  //  .use(staticServer(path.join(__dirname, '../') + '/client/test.css', {index:false}))
   .listen(3000)