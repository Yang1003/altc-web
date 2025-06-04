import request from '@/utils/request'

// 分页查询生产信息
export function pageList(data) {
  return request({
    url: '/testResources/board/sapinfo/pageList',
    method: 'post',
    data
  })
}
export function getMacByOrderNo(orderNo) {
  return request({
    url: '/testResources/board/sapinfo/getMacByOrderNo',
    method: 'get',
    params: {
      orderNo
    }
  })
}

export function updateSapinfo(data) {
  return request({
    url: '/testResources/board/sapinfo/updateByMap',
    method: 'post',
    data
  })
}

export function batchDelete(data) {
  return request({
    url: '/testResources/board/sapinfo/batchDelete',
    method: 'post',
    data
  })
}

export function getImportExcelResult(parm) {
  return request({
    url: '/testResources/board/sapinfo/getImportExcelResult',
    method: 'get',
    params: parm
  })
}

export function distinctListProductType(parm) {
  return request({
    url: '/testResources/board/sapinfo/distinctListProductType',
    method: 'get',
    params: parm
  })
}

export function distinctListFiberhomeItem(data) {
  return request({
    url: '/testResources/board/sapinfo/distinctListFiberhomeItem',
    method: 'post',
    data
  })
}

export function getSapinfoByOrdernum(ordernum) {
  return request({
    url: '/testResources/board/sapinfo/getModifyDataBySapOrderNo/' + ordernum,
    method: 'get',
    params: null
  })
}

export function queryDeleteDataByOrdernum(ordernum) {
  return request({
    url: '/testResources/board/sapinfo/queryDeleteDataByOrder/' + ordernum,
    method: 'get',
    params: null
  })
}

export function updateByOrder(data) {
  return request({
    url: '/testResources/board/sapinfo/updateByOrder',
    method: 'post',
    data
  })
}
export function deleteBySapOrderNum(ordernum) {
  return request({
    url: '/testResources/board/sapinfo/deleteBySapOrderNum?sapOrderNum=' + ordernum,
    method: 'post',
    params: null
  })
}
