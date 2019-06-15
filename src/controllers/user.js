import User from '../models/user'

export const list = async (ctx, next) => {
  const { limit, offset } = ctx.query
  const result = await User.findAll({ where: { isValid: true }, limit, offset })
  ctx.body = result.length > 0 ? result : null

  next()
}

export const findOne = async (ctx, next) => {
  const { id } = ctx.params
  const result = await User.findOne({ where: { id, isValid: true } })
  ctx.body = result

  next()
}
