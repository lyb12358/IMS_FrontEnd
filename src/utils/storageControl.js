import { login, logout, getInfoByToken } from 'src/api/auth'
import { LocalStorage, SessionStorage } from 'quasar'

const TokenKey = 'imsToken'


//token
export function getStorageToken() {
    return SessionStorage.get.item(TokenKey)
}

export function setStorageToken(token) {
    return SessionStorage.set(TokenKey, token)
}

export function removeStorageToken() {
    return SessionStorage.remove(TokenKey)
}

export function removeStorageAll() {
    return SessionStorage.clear()
}


