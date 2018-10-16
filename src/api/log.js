import { service } from 'src/plugins/axios'

export function getProdLogList(type, id) {
    return service({
        url: '/prodLogs/' + type + '/' + id,
        method: 'get',
    })
}