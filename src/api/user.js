import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/ptm/user/login',
    method: 'post',
    data
  })
}

export function register(data) {
    return request({
      url: '/ptm/user/register',
      method: 'post',
      data
    })
  }

export function getInfo(token) {
  return request({
    url: '/ptm/user/info',
    method: 'get',
    params: {
      token
    }
  })
}

export function logout() {
  return request({
    url: '/ptm/user/logout',
    method: 'post'
  })
}
