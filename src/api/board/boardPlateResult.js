import request from '@/utils/request'

// 查询
export function listTestLog() {
  return request({
    url: '/inner/test/log/divide/table/list',
    method: 'get'
  })
}

export function pageLog(data) {
  return request({
    url: '/inner/test/log/query/page',
    method: 'post',
    data
  })
}

export function queryBoardTestLogExportInfo(data) {
  return request({
    url: '/inner/test/log/query/queryBoardTestLogExportInfo',
    method: 'post',
    data
  })
}
export function exportProcess(batchNum) {
  return request({
    url: '/inner/test/log/query/exportProcess',
    method: 'get',
    params: {
      batchNum
    }
  })
}
