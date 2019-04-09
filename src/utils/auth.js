import Cookies from 'js-cookie'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'
const PERMISSION_KEY = 'permission'
const MENU_KEY = 'menu'

/**
 *  存储token 和 userId 在 cookie中
 */
export function getToken() {
  return Cookies.get(TOKEN_KEY)
}

export function setToken(token) {
  Cookies.set(TOKEN_KEY, token, { expires: getExpires() })
}

export function removeToken() {
  Cookies.remove(TOKEN_KEY)
}

export function getUser() {
  return Cookies.get(USER_KEY)
}

export function setUser(userId) {
  Cookies.set(USER_KEY, userId, { expires: getExpires() })
}

export function removeUser() {
  Cookies.remove(USER_KEY)
}

/**
 *  存储用户基本信息 和 用户权限在 sessionStorage中
 */
export function getPermissionList() {
  const permissionList = sessionStorage.getItem(PERMISSION_KEY)
  if (permissionList) {
    return JSON.parse(permissionList)
  } else {
    return null
  }
}

export function setPermissionList(permissionList) {
  sessionStorage.setItem(PERMISSION_KEY, JSON.stringify(permissionList))
}

export function removePermissionList() {
  sessionStorage.removeItem(PERMISSION_KEY)
}

export function getUserInfo() {
  const userInfo = sessionStorage.getItem(USER_KEY)
  if (userInfo) {
    return JSON.parse(userInfo)
  } else {
    return null
  }
}

export function setUserInfo(user) {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function removeUserInfo() {
  sessionStorage.removeItem(USER_KEY)
}

export function getMenu() {
  const menu = sessionStorage.getItem(MENU_KEY)
  if (menu) {
    return JSON.parse(menu)
  } else {
    return null
  }
}

export function setMenu(menu) {
  sessionStorage.setItem(MENU_KEY, JSON.stringify(menu))
}

export function removeMenu() {
  sessionStorage.removeItem(MENU_KEY)
}

/**
 * 清除缓存
 */
export function removeCache() {
  removeToken()
  removeUser()
  removeUserInfo()
  removePermissionList()
  removeMenu()
}

function getExpires() {
  var date = new Date()
  date.setTime(date.getTime() + 12 * 60 * 60 * 1000)
  return date
}
