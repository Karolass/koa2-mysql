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
]
