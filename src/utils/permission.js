import Vue from 'vue'
import { getPermissionList } from './auth'

const permission = Vue.directive('permission', {
  bind: function(el, binding, vnode) {
    const btnPermission = binding.value
    if (!Vue.prototype.$_permission(btnPermission)) {
      el.style.display = 'none'
    }
  }
})

// 权限检查方法
Vue.prototype.$_permission = function(btnPermission) {
  const permissionList = getPermissionList()
  // admin 的权限是*
  if (permissionList && (permissionList.indexOf('*') > -1 || permissionList.indexOf(btnPermission) > -1)) {
    return true
  }
  return false
}

export default { permission }
