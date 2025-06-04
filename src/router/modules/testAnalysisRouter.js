import Layout from '@/layout'

const testAnalysisRouter = {
  path: '/dateAnalysis',
  component: Layout,
  redirect: '/ptm/dateAnalysis',
  name: 'dateAnalysis',
  meta: {
    title: 'dateAnalysis',
    icon: 'table'
  },
  children: [{
      path: 'boradTestResult',
      component: () => import('@/views/ptm/dateAnalysis/boradTestResult'),
      name: 'BoradTestResult',
      meta: {
        title: 'boradTestResult'
      }
    }, {
      path: 'boradTestRecord',
      component: () => import('@/views/ptm/dateAnalysis/boradTestRecord'),
      name: 'BoradTestRecord',
      meta: {
        title: 'boradTestRecord'
      }
    },


  ]
}
export default testAnalysisRouter
