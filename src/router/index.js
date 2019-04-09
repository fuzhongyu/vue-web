import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
Vue.use(Router)

import Layout from '@/views/layout/Layout'
import RouterRedirect from '@/components/RouterRedirect'
import permissionConfig from '@/global/permissionConfig'

export const routerMap = [
  {
    path: '/',
    redirect: '/login',
    hidden: true
  }, {
    path: '/login',
    component: _import('login/index'),
    hidden: true
  }, {
    path: '/404',
    component: _import('404'),
    hidden: true
  }, {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: _import('home/index'),
        meta: { title: 'Home', icon: 'home', permission: permissionConfig.homeView, keepAlive: true }
      }, {
        path: '/system',
        component: RouterRedirect,
        redirect: '/system/user',
        meta: { title: 'System', icon: 'settings' },
        children: [
          {
            path: 'user',
            name: 'userList',
            component: _import('user/index'),
            meta: { title: 'User', permission: permissionConfig.userView }
          },
          {
            path: 'user_info',
            name: 'userInfo',
            hidden: true,
            component: _import('user/info')
          },
          {
            path: 'permission',
            name: 'permission',
            component: _import('permission/index'),
            meta: { title: 'Permission', permission: permissionConfig.permissionView }
          },
          {
            path: 'role',
            name: 'roleList',
            component: _import('role/index'),
            meta: { title: 'Role', permission: permissionConfig.roleView }
          }
        ]
      }
    ]
  }, {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export default new Router({
  // mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: routerMap
})
