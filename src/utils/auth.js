import { login, logout, getInfo } from 'src/api/login'
import { LocalStorage } from 'quasar'

const TokenKey = 'imsToken'

export function getStorageToken() {
    return LocalStorage.get.item(TokenKey)
}

export function setStorageToken(token) {
    return LocalStorage.set(TokenKey, token)
}

export function removeStorageToken() {
    return LocalStorage.remove(TokenKey)
}

export function removeStorageAll() {
    return LocalStorage.clear()
}