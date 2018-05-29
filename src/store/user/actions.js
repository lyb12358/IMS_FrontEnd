import { getStorageToken, setStorageToken, removeStorageToken } from 'src/utils/tokenControl'
import { login, logout, getInfo } from 'src/api/auth'

export function Login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
            const result = response.data
            setStorageToken(result.data)
            commit('SetToken', result.data)
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

export function GetInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
            const data = response.data.data
            // if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            //     commit('SetRoles', data.roles)
            //     commit('SetPermissions', data.permissions)
            // } else {
            //     reject('getInfo: roles must be a non-null array !')
            // }
            // commit('SetName', data.name)
            // commit('SetAvatar', data.avatar)
            commit('SetUserInfo', data)
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

//deprecated
export function Logout({ commit, state }) {
    return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
            commit('SetToken', '')
            // commit('SetRoles', [])
            // commit('SetPermissions', [])
            commit('SetUserInfo', {})
            removeStorageToken()
            resolve()
        }).catch(error => {
            reject(error)
        })
    })
}

export function FedLogout({ commit }) {
    return new Promise(resolve => {
        commit('SetToken', '')
        // commit('SetRoles', [])
        // commit('SetPermissions', [])
        commit('SetUserInfo', {})
        removeStorageToken()
        resolve()
    })
}