export const offSetAndLimit = async (ctx, next) => {
  ctx.query.offset = Number(ctx.query.offset) || 0
  ctx.query.limit = Number(ctx.query.limit) || 30

  await next()
}

export default offSetAndLimit
