import { doGet, doPostJson, doPut, doPatch, doDelete } from '@/utils/request'

export function getUserPage(params) {
  return doGet('/system/user', params)
}

export function getUserInfo(userId) {
  return doGet('/system/user/' + userId)
}

export function addUser(params) {
  return doPostJson('/system/user/', params)
}

export function updateUser(userId, params) {
  return doPut('/system/user/' + userId, params)
}

export function deleteUser(userId) {
  return doDelete('/system/user/' + userId)
}

export function updatePassword(userId, params) {
  return doPatch('/system/user/' + userId + '/pwd', params)
}
