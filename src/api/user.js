import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'user/current',
    method: 'get',
    params: { token }
  })
}

export function getAvatar(fileName) {
  return request({
    url: 'files/' + fileName,
    method: 'get',
    responseType: 'blob'
  })
}

export function updataUser(data) {
  return request({
    url: '/user/updataUser',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'get'
  })
}