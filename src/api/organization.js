import { service } from 'src/plugins/axios'

export function getOrgList() {
    return service({
        url: '/orgs',
        method: 'get'
    })
}
// 获取品牌
export function getBrandOptions() {
    return service({
        url: '/com/options',
        method: 'get'
    })
}