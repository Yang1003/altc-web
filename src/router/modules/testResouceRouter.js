import Layout from '@/layout'

const testResouceRouter = {
  path: '/testResouceManage',
  component: Layout,
  redirect: '/ptm/testResouceManage',
  name: 'TestResouceManage',
  meta: {
    title: 'testResouceManage',
    icon: 'table'
  },
  children: [{
      path: 'softManage',
      component: () => import('@/views/ptm/testResouceManage/softManage'),
      name: 'SoftManage',
      meta: {
        title: 'softManage'
      }
    },
    {
      path: 'sapinfoManage',
      component: () => import('@/views/ptm/testResouceManage/sapinfoManage'),
      name: 'SapinfoManage',
      meta: {
        title: 'sapinfoManage'
      }
    }

  ]
}
export default testResouceRouter
