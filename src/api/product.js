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
export function addProdStyle(productStyle) {
    return service({
        url: '/prodStyle',
        method: 'post',
        data: productStyle
    })
}
export function updateProdStyle(prodstyle) {
    return service({
        url: '/prodStyle',
        method: 'put',
        data: prodstyle
    })
}
export function checkProdStyle(prodStyle) {
    return service({
        url: '/prodStyles/prodStyle/' + prodStyle,
        method: 'get',
    })
}

//file,image
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

//productCat
export function getProdFamilyList() {
    return service({
        url: '/prodFamilys',
        method: 'get'
    })
}
export function getProdClassList(familyId) {
    return service({
        url: '/prodClasses',
        method: 'get',
        params: { familyId }
    })
}
export function getProdPropList() {
    return service({
        url: '/prodProps',
        method: 'get'
    })
}
export function getProdLevelList() {
    return service({
        url: '/prodLevels',
        method: 'get'
    })
}





