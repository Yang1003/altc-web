import request from '@/utils/request'

export function pageSoftwareList(data) {
  return request({
    url: '/software/page',
    method: 'post',
    data
  })
}

export function boardSoftUpload(data) {
  return request({
    url: '/board/software/upload',
    method: 'post',
    data
  })
}

export function updateStatus(param) {
  return request({
    url: '/software/updateStatus',
    method: 'get',
    params: param
  })
}

export function boardConfigUpload(data) {
  return request({
    url: '/board/software/configUpload',
    method: 'post',
    data
  })
}

export function boardDriverUpload(data) {
  return request({
    url: '/board/software/configUpload',
    method: 'post',
    data
  })
}

// 宽产软件下载
export function boardSoftDownload(data) {
  return request({
    url: '/board/software/getDownloadUrls',
    method: 'post',
    data
  })
}

// 宽产软件启动
export function softwareLunch(data) {
  return request({
    url: '/board/software/lunch',
    method: 'post',
    data
  })
}

// export function verifyLunch(para) {
//   return request({
//     url: '/board/software/lunch',
//     method: 'post',
//     para
//   })
// }

export function getSoftwareStationsByMac(param) {
  return request({
    url: '/board/software/getSoftwareStationsByMac',
    method: 'get',
    params: param
  })
}

export function softwareBindUpdateBind(data) {
  return request({
    url: '/softwareBind/updateBind',
    method: 'post',
    data
  })
}

export function softwareDelete(param) {
  return request({
    url: '/software/delete',
    method: 'delete',
    params: param
  })
}

export function selectBindBySoftwareCode(param) {
  return request({
    url: '/softwareBind/selectBySoftwareCode',
    method: 'get',
    params: param
  })
}
