import controllers from '../controllers'

export default [
  {
    method: 'get',
    path: '/',
    controller: controllers.user.list,
  },
  {
    method: 'get',
    path: '/:id',
    controller: controllers.user.findOne,
  },
  {
    method: 'post',
    path: '/',
    controller: controllers.user.create,
  },
  {
    method: 'put',
    path: '/:id',
    controller: controllers.user.update,
  },
  {
    method: 'delete',
    path: '/:id',
    controller: controllers.user.del,
  },
]
