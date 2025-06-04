import request from '@/utils/request'

// 分页查询绑定记录
export function pageBindList(data) {
  return request({
    url: '/board/codeBind/page',
    method: 'post',
    data
  })
}
//
export function countByOrderNum(ordernum) {
  return request({
    url: '/board/codeBind/countByOrderNum',
    method: 'get',
    params: {
      ordernum
    }
  })
}

// TSN BOSASN数据编码规则
export function getDataRule(data) {
  return request({
    url: '/data/rule/get',
    method: 'post',
    data
  })
}
export function savaDataRule(data) {
  return request({
    url: '/data/rule/save',
    method: 'post',
    data
  })
}

export function doBindNum(data) {
  return request({
    url: '/board/codeBind/bind/num',
    method: 'post',
    data
  })
}
