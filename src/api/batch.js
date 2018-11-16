import { service } from 'src/plugins/axios'

export function getBatchLogList(searchForm) {
    return service({
        url: '/batchLogs',
        method: 'post',
        data: searchForm
    })
}
export function addBatchDataSync(id) {
    return service({
        url: '/batch/sync/' + id,
        method: 'post'
    })
}