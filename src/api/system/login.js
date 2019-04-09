import { doGet, doPostJson } from '@/utils/request'

export function login(username, password) {
  return doPostJson('/login', { username: username, password: password })
}

export function logout() {
  return doGet('/logout')
}
