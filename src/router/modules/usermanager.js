import Layout from '@/layout'

const userManagerRouter = {
  path: '/base',
  component: Layout,
  redirect: '/altc/usermanager',
  name: 'base',
  meta: {
    title: 'base',
    icon: 'table'
  },
  children: [{
      path: 'usermanager',
      component: () => import('@/views/altc/usermanager.vue'),
      name: 'usermanager',
      meta: {
        title: 'usermanager'
      }
    }
  ]
}
export default userManagerRouter
