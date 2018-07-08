module.exports = (ctx, message, commonInfo) => {
  const client = {
    method:ctx.request.method,
    url:ctx.request.url,
    host:ctx.request.host,    //发送请求的客户端的host
    message,
    referer:ctx.request.headers['referer'], //请求的源地址
    userAgent: ctx.request.headers['user-agent'],   //客户端信息，设备及浏览器
  }
  return JSON.stringify(Object.assign(commonInfo,client))
}