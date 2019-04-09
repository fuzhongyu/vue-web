import router from './router'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken, getUser, getPermissionList, getUserInfo, getMenu } from '@/utils/auth'
import { getAndCacheUserInfo, fedLogOut } from '@/utils/cache'

router.beforeEach((to, from, next) => {
  // 开启Progress
  NProgress.start()
  const userId = getUser()
  // 判断是否有token和用户id
  if (getToken() && userId) {
    if (to.path === '/login' || to.path === '/') {
      next({ path: '/home' })
    } else {
      // 判断当前用户是否已拉取用户信息,如果已经拉取则下一步，否则先拉取用户信息
      if (getPermissionList() && getUserInfo() && getMenu()) {
        next()
      } else {
        // 拉取并缓存user_info
        getAndCacheUserInfo(userId).then(() => {
          next({ ...to })
        }).catch(() => {
          fedLogOut()
          Message.error('验证失败,请重新登录')
          next({ path: '/login' })
        })
      }
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      // 否则全部重定向到登录页
      next('/login')
    }
  }
  // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
  NProgress.done()
})

router.afterEach(() => {
  // 结束Progress
  NProgress.done()
})
