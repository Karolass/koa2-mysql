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

export const create = async (ctx, next) => {
  const { email, name } = ctx.request.body
  const result = await User.create({ email, name })
  ctx.body = result

  next()
}

export const update = async (ctx, next) => {
  const { id } = ctx.params
  const { email, name } = ctx.request.body
  const result = await User.update({ email, name }, { where: { id } })
  ctx.body = result

  next()
}

export const del = async (ctx, next) => {
  const { id } = ctx.params
  const result = await User.destroy({ where: { id } })
  ctx.body = result

  next()
}
