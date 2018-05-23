import { service } from 'src/plugins/axios'

export function login(user) {
    return service({
        url: '/user/login',
        method: 'post',
        data: user
    })
}

export function getInfo(token) {
    return service({
        url: '/user/info',
        method: 'get',
        params: { token }
    })
}

export function logout() {
    return service({
        url: '/user/logout',
        method: 'post'
    })
}
