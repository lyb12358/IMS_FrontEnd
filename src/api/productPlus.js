import { service } from 'src/plugins/axios'


export function codeExport(searchForm) {
    return service({
        url: '/excel/prodCodes',
        method: 'post',
        responseType: 'blob',
        data: searchForm
    })
}
export function specDownload(id) {
    return service({
        url: '/specs/' + id,
        method: 'get',
        responseType: 'blob'
    })
}





