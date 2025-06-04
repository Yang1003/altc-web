import request from '@/utils/request'

export function driverUpload(data) {
  return request({
    url: '/board/softwareDriver/driverUpload',
    method: 'post',
    data
  })
}

export function selectDriver(parm) {
  return request({
    url: '/board/softwareDriver/selectDriver',
    method: 'get',
    params: parm
  })
}
