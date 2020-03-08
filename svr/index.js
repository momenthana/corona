const Koa = require('koa')
const Router = require('koa-router')

const koa = new Koa()
const router = new Router()

router.get('/', async (ctx, next) => {
  ctx.body = 'root'
})

koa.use(router.routes()).use(router.allowedMethods())

koa.listen(80, () => {
  console.log('http://localhost:80')
})
