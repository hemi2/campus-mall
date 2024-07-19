import request from '@/utils/request'

export function getTypeList() {
  return request({
    url: 'type/selectAll',
    method: 'get',
  })
}

export function getTypeById(id) {
  return request({
    url: 'type/selectById' + id,
    method: 'get',
  })
}
