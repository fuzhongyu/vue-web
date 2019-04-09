import { doGet, doPostJson, doDelete } from '@/utils/request'

export function getRoleList(params) {
  return doGet('/system/role', params)
}

export function getRolePage(params) {
  return doGet('/system/role/page', params)
}

export function getRoleInfo(roleId) {
  return doGet('/system/role/' + roleId)
}

export function saveRole(params) {
  return doPostJson('/system/role/', params)
}

export function deleteRole(roleId) {
  return doDelete('/system/role/' + roleId)
}

export function getRolePermissionList(roleId) {
  return doGet('/system/role/' + roleId + '/permission')
}

export function updateRolePermission(roleId, permissionList) {
  return doPostJson('/system/role/' + roleId + '/permission', permissionList)
}
