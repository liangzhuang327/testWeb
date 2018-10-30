import path from 'path'
import Koa from 'koa'
import serve from 'koa-static'
import logger from 'koa-logger'
import compress from 'koa-compress'
import bodyParser from 'koa-bodyparser'
import chalk from 'chalk'


import viewhook from './middlewares/viewhook'
import router from './controllers'
import env from './env'

require('isomorphic-fetch')

new Koa()
  .use(viewhook())
  .use(compress())
  .use(bodyParser({ enableTypes: ['json'], jsonLimit: '10mb' }))
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(env.HTTP_SERVER_PORT)

console.log(chalk.blue(`listening on port ${env.HTTP_SERVER_PORT} -- ${process.env.NODE_ENV}`))
