import { Controller, Post, Get, Required } from '../decorator/router'
import { checkPassword } from '../service/user'

@Controller('/user')
class UserRouter {
  @Post('/login')
  @Required({ body: ['email', 'password'] })
  async login(ctx, next) {
    const { email, password } = ctx.request.body
    try {
      const data = await checkPassword(email, password)
      const { user, match } = data

      if (match) {
        const userInfo = {
          _id: user._id,
          email: user.email,
          userName: user.userName
        }
        ctx.session.user = userInfo

        return (ctx.body = {
          code: 1,
          type: 'success',
          data: userInfo
        })
      }

      return (ctx.body = {
        code: 0,
        type: 'error',
        message: '用户名或密码错误'
      })
    } catch (error) {
      console.log(error)
    }
  }

  @Get('/logout')
  logout(ctx, next) {
    ctx.session = null

    return (ctx.body = {
      code: 1,
      type: 'success',
      data: {}
    })
  }

  @Post('/check')
  @Required({ body: ['email', 'password'] })
  async check(ctx, next) {
    const { email, password } = ctx.request.body
    let data

    try {
      data = await checkPassword(email, password)
    } catch (error) {
      return (ctx.body = {
        code: 0,
        type: 'error',
        message: '用户校验失败'
      })
    }

    if (data.match) {
      return (ctx.body = {
        code: 1,
        type: 'success',
        data: {}
      })
    } else {
      return (ctx.body = {
        code: 0,
        type: 'error',
        message: '用户校验失败'
      })
    }
  }
}

export default UserRouter
