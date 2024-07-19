import request from '@/utils/request'

export function getList() {
  return request({
    url: 'type/selectAll',
    method: 'get',
  })
}
