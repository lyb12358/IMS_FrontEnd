import { service } from 'src/plugins/axios'

export function getBatchLogList(searchForm) {
    return service({
        url: '/batchLogs',
        method: 'post',
        data: searchForm
    })
}