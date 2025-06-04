import request from '@/utils/request'

// 分页查询系统配置
export function sysConfigQuery(data) {
  return request({
    url: '/system/config/query',
    method: 'post',
    data
  })
}
