import { service } from 'src/plugins/axios'

//product
export function getProdCodeList(searchForm) {
    return service({
        url: '/prodCodes',
        method: 'post',
        data: searchForm
    })
}
export function getProdCodeById(id) {
    return service({
        url: '/prodCode/id/' + id,
        method: 'get',
    })
}
export function addProdCode(product) {
    return service({
        url: '/prodCode',
        method: 'post',
        data: product
    })
}
export function updateProdCode(product) {
    return service({
        url: '/prodCode',
        method: 'put',
        data: product
    })
}

//productStyle
export function getProdStyleList(searchForm) {
    return service({
        url: '/prodStyles',
        method: 'post',
        data: searchForm
    })
}
export function getProdStyleOptions(productStyle) {
    return service({
        url: '/prodStyles/options',
        method: 'post',
        data: productStyle
    })
}
export function getProdStyleById(id) {
    return service({
        url: '/prodStyle/id/' + id,
        method: 'get',
    })
}
export function addProdStyle(productStyle) {
    return service({
        url: '/prodStyle',
        method: 'post',
        data: productStyle
    })
}
export function updateProdStyle(productStyle) {
    return service({
        url: '/prodStyle',
        method: 'put',
        data: productStyle
    })
}
//记数
export function codeCount() {
    return service({
        url: '/prodCode/count',
        method: 'get',
    })
}
export function styleCount() {
    return service({
        url: '/prodStyle/count',
        method: 'get',
    })
}










