const koa = require('koa')
const router = require('./router')
const middleware = require('./middleware')
const app = new koa()
middleware(app)  //中间件集合

router(app)
app.listen(3000,()=>{
  console.log('server is running ar http://localhost:3000')
})
