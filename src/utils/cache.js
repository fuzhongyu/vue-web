import { getUserInfo } from '@/api/system/user'
import { setUserInfo, setPermissionList, setMenu, removeCache } from '@/utils/auth'
import { routerMap } from '@/router'

/**
 * 获取用户信息，并缓存至sessionStorage
 * @param userId
 * @returns {Promise<any>}
 */
export function getAndCacheUserInfo(userId) {
  return new Promise((resolve, reject) => {
    getUserInfo(userId).then(res => {
      const result = res.result
      const userInfo = {}
      userInfo['username'] = result.username
      userInfo['nickname'] = result.nickname
      userInfo['avatar'] = result.avatar
      // 将数据存储到sessionStorage
      setUserInfo(userInfo)
      setPermissionList(result.permissionList)
      setMenu(filterRouter(routerMap, result.permissionList))
      resolve()
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 前端登出
 * @constructor
 */
export function fedLogOut() {
  return new Promise((resolve, reject) => {
    removeCache()
    resolve()
  })
}

/**
 * 是否含有权限判断
 * @param route 路由
 * @param permissionList 权限列表
 * @returns {boolean}
 */
function hasPermission(route, permissionList) {
  if (!route.meta || !route.meta.permission) {
    return true
  } else if (permissionList.indexOf(route.meta.permission) > -1) {
    return true
  }
  return false
}

/**
 * 递归过滤异步路由表，返回符合用户权限的路由表
 * @param routerMap 路由表
 * @param permissionList 权限列表
 */
function filterRouter(routerMap, permissionList) {
  // admin 的权限是*，直接返回所有路由
  if (permissionList.indexOf('*') > -1) {
    return routerMap
  }
  // 非admin用户进行路由过滤
  const accessedRouters = routerMap.filter(route => {
    if (hasPermission(route, permissionList)) {
      if (route.children && route.children.length) {
        route.children = filterRouter(route.children, permissionList)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

