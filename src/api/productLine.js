import request from '@/utils/request'

export function listProductLine(param) {
  return request({
    url: '/product/line/list',
    method: 'get',
    params: param
  })
}
