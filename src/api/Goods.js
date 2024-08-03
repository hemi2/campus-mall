import request from '@/utils/request'

export function getAllGoods(data) {
    return request({
        url: 'goods/selectByPage',
        method: 'get',
        params: data
    })
}
export function getGoodsByTypeId(data) {
    return request({
        url: 'goods/selectByTypeId',
        method: 'get',
        params: data
    })
}

