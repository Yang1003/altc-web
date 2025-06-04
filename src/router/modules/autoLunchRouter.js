import Layout from '@/layout'

const autoLunchRouter = {
  path: '/autoLunch',
  component: Layout,
  redirect: '/ptm/autoLunch',
  name: 'AutoLunch',
  meta: {
    title: 'autoLunch',
    icon: 'table'
  },
  children: [{
      path: 'softLunch',
      component: () => import('@/views/ptm/autoLunch/softLunch'),
      name: 'SoftLunch',
      meta: {
        title: 'softLunch'
      }
    }

  ]
}
export default autoLunchRouter
