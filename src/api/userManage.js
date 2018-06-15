import { service } from 'src/plugins/axios'

//user manage
export function getUserList(searchForm) {
    return service({
        url: '/users',
        method: 'post',
        data: searchForm
    })
}

//role manage
export function getRoleList(searchForm) {
    return service({
        url: '/roles',
        method: 'post',
        data: searchForm
    })
}