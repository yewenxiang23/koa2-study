const path = require('path')
const nunjucks = require('nunjucks')
module.exports = (opts = {}) => {
  return async (ctx, next) => {
    //增加环境变量，用来传入到视图中方便调试
    const env = opts.env || process.env.NODE_ENV || 'development'
    // 400.html 404.html other.html 的存放位置
    const folder = opts.errorPageFolder
    //指定默认模板文件
    const defaultErrorTemplate = path.resolve(__dirname, './error.html')
    let fileName = 'other'
    try {
      await next()
      //如果没有更改过 response 的 status, 则koa 默认的status是404
      if (ctx.response.status === 404 && !ctx.response.body) ctx.throw(404)
    } catch (e) {
      let status = parseInt(e.status)
      //默认错误信息为 error 对象上携带的 message
      const message = e.message
      if (status >= 400) {
        switch (status) {
          case 400:
          case 404:
          case 500:
            fileName = status;
            break;
          default:
            fileName: 'other'
        }
      }else {
        status = 500
        fileName = status
      }
      //确定最终的 错误模板文件路径
      const filePath = folder ? path.join(folder, `${fileName}.html`): defaultErrorTemplate
      //渲染对应错误类型的视图，并传入参数对象
      try{
        nunjucks.configure(folder? folder : __dirname)
        const data = await nunjucks.render(filePath, {
          env:env,
          status: e.status || e.message,
          error: e.message,
          stack:e.stack
        })
        ctx.status = status
        ctx.body = data
      } catch (e){
        ctx.throw(500, `错误页渲染失败:${e.message}`)
      }
    }
  }
}