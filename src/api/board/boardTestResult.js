import request from '@/utils/request'

// 
export function listTotalResult(data) {
  return request({
    url: '/boardtest/total/result/list',
    method: 'post',
    data
  })
}

export function pageResult(data) {
  return request({
    url: '/boardtest/page',
    method: 'post',
    data
  })
}
