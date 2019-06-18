export default async (ctx, next) => {
  try {
    await next()

    // handle 404
    const { status } = ctx
    if (status === 404) {
      ctx.throw(404)
    }
  } catch (err) {
    ctx.status = err.status || 500

    if (ctx.status === 404) {
      ctx.body = '404 Not Found'
    } else {
      ctx.body = {
        success: false,
        message: err.message,
      }
      ctx.app.emit('error', err, ctx)
    }
  }
}
