import { getStorageToken, setStorageToken, removeStorageToken } from 'src/utils/auth'
import { login, logout, getInfo } from 'src/api/login'

export function Login({ commit }, userInfo) {
    const account = userInfo.account.trim()
    return new Promise((resolve, reject) => {
        login(account, userInfo.password).then(response => {
            const data = response.data
            setStorageToken(data.token)
            commit('SetToken', data.token)
            resolve()
        }).catch(error => {
            reject(error)
        })
    })
}

export function GetInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
            const data = response.data
            if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                commit('SetRoles', data.roles)
                commit('SetPermissions', data.permissions)
            } else {
                reject('getInfo: roles must be a non-null array !')
            }
            commit('SetName', data.name)
            commit('SetAvatar', data.avatar)
            resolve()
        }).catch(error => {
            reject(error)
        })
    })
}

export function Logout({ commit, state }) {
    return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
            commit('SetToken', '')
            commit('SetRoles', [])
            commit('SetPermissions', [])
            removeStorageToken()
            resolve()
        }).catch(error => {
            reject(error)
        })
    })
}