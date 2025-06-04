import request from '@/utils/request'

// 分页查询
export function pageList(data) {
  return request({
    url: '/board/codeBind/page',
    method: 'post',
    data
  })
}
//
export function unBindByOrderNum(orderNum) {
  return request({
    url: '/board/codeBind/unBindByOrder',
    method: 'post',
    params: {
      orderNum
    }
  })
}
export function queryUnBindByOrderNum(orderNum) {
  return request({
    url: 'board/codeBind/queryUnBindInfo',
    method: 'get',
    params: {
      orderNum
    }
  })
}
export function unBindBatch(macs) {
  return request({
    url: '/board/codeBind/unBindBatch',
    method: 'post',
    params: {
      macs
    }
  })
}
export function unBind(mac) {
  return request({
    url: '/board/codeBind/unBind',
    method: 'post',
    params: {
      mac
    }
  })
}
