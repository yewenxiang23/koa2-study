const log4js = require('log4js')
const access = require('./access.js')
const methods = ["trace", "debug", "info", "warn", "error","fatal", "mark"]

const baseInfo = {
  appLogLevel: 'debug', //指定记录的日志级别
  dir: 'logs', //指定日志存放目录
  env: 'development', //指定当前环境，当为开发环境时，在控制台也输出，方便调试
  projectName: 'koa2-study',  //项目名，记录在日志中的项目信息
  serverIp: '0.0.0.0'  //默认情况下服务器IP地址
}
module.exports = (options) => {
  const contextLogger = {}, appenders ={};
  const allOption = Object.assign({},baseInfo,options || {})
  const {env, appLogLevel, dir, projectName, serverIp} = allOption
  const commonInfo = {projectName, serverIp}
  appenders.cheese = {
    type: 'dateFile',  //日志类型
    filename: `${dir}/task`, //输出的文件名
    pattern: "-yyyy-MM-dd.log", //文件名后增加后缀
    alwaysIncludePattern: true //是否总是有后缀名
  }
  if(env === 'development'){
    appenders.out = {
      type:'console'
    }
  }
  let config = {
    appenders,
    categories:{
      default:{
        appenders:Object.keys(appenders),
        level:appLogLevel,
      }
    }
  }
  log4js.configure(config);
  const logger = log4js.getLogger('cheese');
  return async (ctx, next) => {
    //记录请求开始时间
    const start = Date.now()
    //循环methods方法，将所有方法挂载到ctx上
    methods.forEach((method,i) => {
      contextLogger[method] = (message) => {
        logger[method](access(ctx, message, commonInfo))
      }
    })
    ctx.log = contextLogger
    await next()
    const end = Date.now()
    const responseTime = end - start  //响应时间
    logger.info(`响应时间为${responseTime/1000}s`)
  }
}