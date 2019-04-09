/* eslint-disable no-undef */
import axios from 'axios'
import { Message } from 'element-ui'
import global from '@/global/global'
import router from '../router'
import { getToken, getUser } from './auth'
import { fedLogOut } from '@/utils/cache'

export function doGet(url, params) {
  return service({
    url,
    method: 'get',
    params
  })
}

// post表单请求
export function doPost(url, data) {
  return service({
    url,
    method: 'post',
    data
  })
}

// post Json数据流形式请求
export function doPostJson(url, data) {
  return service({
    headers: {
      'Content-Type': 'application/json'
    },
    url,
    method: 'post',
    data,
    transformRequest: [function(data) {
      return JSON.stringify(data)
    }]
  })
}

export function doPut(url, data) {
  return service({
    headers: {
      'Content-Type': 'application/json'
    },
    url,
    method: 'put',
    data,
    transformRequest: [function(data) {
      return JSON.stringify(data)
    }]
  })
}

export function doPatch(url, data) {
  return service({
    headers: {
      'Content-Type': 'application/json'
    },
    url,
    method: 'patch',
    data,
    transformRequest: [function(data) {
      return JSON.stringify(data)
    }]
  })
}

export function doDelete(url, params) {
  return service({
    url,
    method: 'delete',
    params
  })
}

// 创建axios实例
const service = axios.create({
  // api的base_url
  baseURL: process.env.BASE_API,
  // 请求超时时间
  timeout: 30000,
  // 请求带上cookie
  withCredentials: true,
  // 解决long型精度损失问题
  transformResponse: [function(data) {
    return jsonlint.parse(data)
  }]
})

// request拦截器
service.interceptors.request.use(config => {
  const token = getToken()
  const userId = getUser()
  if (token && userId) {
    // 让每个请求携带自定义token 和 user
    config.headers['token'] = token
    config.headers['user'] = userId
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(response => {
  const res = response.data
  if (res.code !== global.successCode) {
    Message({
      message: res.msg,
      type: 'error',
      duration: 5 * 1000
    })
    if (res.code === global.loginExpiry || res.code === global.updatePwd) {
      fedLogOut().then(() => {
        // 为了重新实例化vue-router对象 避免bug
        // location.reload()
        router.push({ path: '/login' })
      })
    }
    return Promise.reject('error')
  } else {
    return res
  }
},
error => {
  console.log('err' + error)// for debug
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
})
