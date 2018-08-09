import { service } from 'src/plugins/axios'


export function excelDownload() {
    return service({
        url: '/test/excel',
        method: 'get',
        responseType: 'blob'
    })
}
export function specDownload(id) {
    return service({
        url: '/specs/' + id,
        method: 'get',
        responseType: 'blob'
    })
}





