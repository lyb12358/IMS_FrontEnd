import { service } from 'src/plugins/axios'

//product
export function getProdList(page, row) {
    return service({
        url: '/prods',
        method: 'get',
        params: { page, row }
    })
}

//productStyle
export function getProdStyleList(page, row) {
    return service({
        url: '/prodStyles',
        method: 'get',
        params: { page, row }
    })
}
export function getProdStyleById(id) {
    return service({
        url: '/prodStyles/' + id,
        method: 'get',
    })
}
export function addProdStyle(prodstyle) {
    return service({
        url: '/prodStyles',
        method: 'post',
        data: prodstyle
    })
}
export function updateProdStyle(prodstyle) {
    return service({
        url: '/prodStyle',
        method: 'put',
        data: prodstyle
    })
}


//file,image
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





