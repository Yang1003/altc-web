import request from '@/utils/request'

export function getPtmClientServerVersion() {
  return request({
    url: '/software/getPtmClientServerVersion',
    method: 'get'
  })
}
export function download() {
  return request({
    url: '/common/ptmClient/download',
    method: 'post'

  })
}
