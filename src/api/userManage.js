import { service } from 'src/plugins/axios'

//user
export function getUserList(searchForm) {
    return service({
        url: '/users',
        method: 'post',
        data: searchForm
    })
}

//role
export function getRoleList(searchForm) {
    return service({
        url: '/roles',
        method: 'post',
        data: searchForm
    })
}