import { service } from 'src/plugins/axios'

// product_cat品类
// 获取品类列表
export function getProdCatList(id) {
    return service({
        url: '/prodCats/CatType/' + id,
        method: 'get',
    })
}
// product_class类别
// 获取产品类别(全级别)
export function getProdClassList() {
    return service({
        url: '/prodClasses',
        method: 'get'
    })
}
// 获取产品类别(对应父类)
export function getProdClassListByParent(id) {
    return service({
        url: '/prodClasses/ClassType/' + id,
        method: 'get',
    })
}
// product_param参数
// 获取产品参数(全部)
export function getProdParamList() {
    return service({
        url: '/prodParams',
        method: 'get'
    })
}
// 获取产品参数(对应父类)
export function getProdParamListByParent(id) {
    return service({
        url: '/prodParams/ParamType/' + id,
        method: 'get',
    })
}
// product_spe规格
// 获取规格列表
export function getProdSpeList(id) {
    return service({
        url: '/prodSpes/speType/' + id,
        method: 'get',
    })
}





