import request from '@/utils/request'

// 分页查询生产信息
export function pageBoardMac(data) {
  return request({
    url: 'boardtest/pageBoardMac',
    method: 'post',
    data
  })
}
