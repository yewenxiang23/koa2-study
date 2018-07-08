const HomeService = require("../service/home")
module.exports = {
  async index (ctx, next) {
    // ctx.response.body = `<h1>index page</h1>`
    ctx.send({name:'ye'})
  },
  async home (ctx, next) {
    ctx.response.body = `<h1>home page</h1>`
    ctx.redirect('/')
  },
  async homeParams (ctx, next) {
    console.log(ctx.params)
    ctx.response.body = `<h1>home page /:id/:name</h1>`
  },
  async login(ctx, next){
    await ctx.render('home/login',{
      btnName:'Go'
    })
  },
  async register(ctx, next){
    let {
      name,
      password
    } = ctx.request.body
    let res = await HomeService.register(name, password)
    if(res.status === -1){
      await ctx.render("home/login", res.data)
    }else {
      ctx.state.title = "个人中心"
      await ctx.render("home/success", res.data)
    }
  }
}