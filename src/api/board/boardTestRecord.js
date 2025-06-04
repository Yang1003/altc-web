import request from '@/utils/request'

export function pageResult(data) {
  return request({
    url: '/boardtest/page',
    method: 'post',
    data
  })
}
export function deleteRecord(data) {
  return request({
    url: '/boardtest/result/delete',
    method: 'post',
    data
  })
}

// exportTestResult
