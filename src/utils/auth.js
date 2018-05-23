import { login, logout, getInfo } from 'src/api/login'
import { LocalStorage, SessionStorage } from 'quasar'

const TokenKey = 'imsToken'

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