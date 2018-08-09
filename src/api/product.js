import { service } from 'src/plugins/axios'

//product
export function getProdList(searchForm) {
    return service({
        url: '/prods',
        method: 'post',
        data: searchForm
    })
}
export function getProdById(id) {
    return service({
        url: '/prods/prod/' + id,
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
export function getProdStyleById(id) {
    return service({
        url: '/prodStyles/id/' + id,
        method: 'get',
    })
}
export function checkProdStyle(prodStyle) {
    return service({
        url: '/prodStyles/prodStyle/' + prodStyle,
        method: 'get',
    })
}
export function addProdStyle(prodStyle) {
    return service({
        url: '/prodStyle',
        method: 'post',
        data: prodStyle
    })
}
export function updateProdStyle(prodstyle) {
    return service({
        url: '/prodStyle',
        method: 'put',
        data: prodstyle
    })
}










