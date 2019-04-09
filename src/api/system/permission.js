import { doGet, doPostJson, doDelete } from '@/utils/request'

export function getMenuTree() {
  return doGet('/system/permission/menu')
}

export function getPermissionInfo(permissionId) {
  return doGet('/system/permission/' + permissionId)
}

export function savePermission(params) {
  return doPostJson('/system/permission/', params)
}

export function deletePermission(params) {
  return doDelete('/system/permission/', params)
}
