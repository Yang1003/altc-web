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
    },
    {
        path: 'rolemanager',
        component: () => import('@/views/altc/rolemanager.vue'),
        name: 'rolemanager',
        meta: {
            title: 'rolemanager'
        }
    }
  ]
}
export default userManagerRouter
