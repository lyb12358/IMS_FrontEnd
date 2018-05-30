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
            commit('SetPermissions', data.permissions)
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
            commit('SetPermissions', [])
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
        commit('SetPermissions', [])
        commit('SetUserInfo', {})
        removeStorageToken()
        resolve()
    })
}