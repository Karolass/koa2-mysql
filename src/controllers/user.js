import User from '../models/user'

export const list = async (ctx, next) => {
  const user = await User.findAll()
  ctx.body = user

  next()
}

export const fineOne = async (ctx, next) => {
  ctx.body = {
    message: `kerker ${ctx.params.id}`,
    query: ctx.query,
  }

  next()
}
