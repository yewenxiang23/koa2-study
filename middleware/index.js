const path = require('path')
const ip = require('ip')
const bodyParser = require('koa-bodyparser')
const nunjucks = require('koa-nunjucks-2')
const staticFiles = require('koa-static')
const miSend = require('./mi-send')
const miLog = require('./mi-log')
const miHttpError = require('./mi-http-error')
module.exports = (app) => {
  app.use(miHttpError({
    errorPageFolder: path.resolve(__dirname, '../errorPage')
  })) // 应用请求错误中间件，放在最外层
  app.use(miLog({
    env: app.env,  // koa 提供的环境变量
    projectName: 'koa2-tutorial',
    appLogLevel: 'debug',
    dir: 'logs',
    serverIp: ip.address()
  }))    //log中间件
  app.use(miSend())   //发送JSON数据到客户端
  app.use(staticFiles(path.resolve(__dirname, "../public"))) //静态资源
  app.use(nunjucks({    //模板解析
    ext:'html',
    path:path.join(__dirname, '../views'),
    nunjucksConfig:{
      trimBlocks:true //开启转义 防xss
    }
  }))
  app.use(bodyParser())//解析JSON

  //增加错误监听，中间件加载出错
  app.on('error', (err, ctx) => {
    if(ctx && !ctx.headerSent && ctx.status < 500){
      ctx.status = 500
    }
    if(ctx && ctx.log && ctx.log.error){
      if(!ctx.state.logged){
        ctx.log.error(err.stack)
      }
    }
  })
}