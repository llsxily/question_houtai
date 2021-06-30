import TabsView from '@/layouts/tabs/TabsView'


// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/login',
      children: [
        {
          path: 'question',
          name: '交流问题后台',
          meta: {
            icon: 'table'
          },
          component: () => import('@/pages/list/QueryList'),
        },
        {
          path: 'question/detail/:id',
          name: '问题详情',
          meta: {
            invisible: true
          },
          component: () => import('@/pages/detail/QuestionBasicDetail')
        },
        {
          path: 'answer/:id/:parent_id',
          name: '答案详情',
          meta: {
            invisible: true
          },
          component: () => import('@/pages/detail/AnswerBasicDetail')
        },
        {
          path: 'gaoguan',
          name: '高管邮箱后台',
          meta: {
            icon: 'mail'
          },
          component: () => import('@/pages/list/GaoguanList'),
        },{
          path: 'gaoguan/detail/:id',
          name: '高管邮件详情',
          meta: {
            invisible: true
          },
          component: () => import('@/pages/detail/BasicDetail')
        },
      ]
    },
  ]
}

export default options
