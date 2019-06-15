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

  // check required
  if (!email) ctx.throw(400, 'parameter `email` is required')

  // find if exists
  const user = await User.findOne({ where: { email } })
  if (user) ctx.throw(400, 'The email is exists')

  const result = await User.create({ email, name })
  ctx.body = result

  next()
}

export const update = async (ctx, next) => {
  const { id } = ctx.params
  const { email, name } = ctx.request.body

  // check if no parameter
  if (!email && !name) ctx.throw(400, 'body has no parameters')

  await User.update({ email, name }, { where: { id } })
  ctx.body = {
    success: true,
    message: `update ID: ${id} is success`,
  }

  next()
}

export const del = async (ctx, next) => {
  const { id } = ctx.params

  // find if not exists
  const user = await User.findOne({ where: { id } })
  if (!user) ctx.throw(400, 'The id is not exists')

  await User.destroy({ where: { id } })
  ctx.body = {
    success: true,
    message: `delete ID: ${id} is success`,
  }

  next()
}
