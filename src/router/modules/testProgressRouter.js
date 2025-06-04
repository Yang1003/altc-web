import Layout from '@/layout'

const testProgressRouter = {
  path: '/testProgressManage',
  component: Layout,
  redirect: '/ptm/testProgressManage',
  name: 'TestProgressManage',
  meta: {
    title: 'testProgressManage',
    icon: 'table'
  },
  children: [{
      path: 'labelBind',
      component: () => import('@/views/ptm/testProgressManage/labelBind'),
      name: 'LabelBind',
      meta: {
        title: 'labelBind'
      }
    },
    {
      path: 'labelUnbind',
      component: () => import('@/views/ptm/testProgressManage/labelUnbind'),
      name: 'LabelUnbind',
      meta: {
        title: 'labelUnbind'
      }
    },
    // {
    //   path: 'boardtestfail',
    //   component: () => import('@/views/ptm/testProgressManage/boardtestfail'),
    //   name: 'Boardtestfail',
    //   meta: {
    //     title: 'boardtestfail'
    //   }
    // },
    {
      path: 'markAsRepair',
      component: () => import('@/views/ptm/testProgressManage/markAsRepair'),
      name: 'MarkAsRepair',
      meta: {
        title: 'markAsRepair'
      }
    }

  ]
}
export default testProgressRouter
