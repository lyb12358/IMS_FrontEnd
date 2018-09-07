import axios from 'axios'
import { Notify, Dialog } from 'quasar'
import store from 'src/store'
import { getStorageToken } from 'src/utils/storageControl'


const service = axios.create({
  baseURL: process.env.API,
  timeout: 30000
})

// request interceptors
service.interceptors.request.use(config => {
  if (store.getters['user/token']) {
    config.headers['imsToken'] = getStorageToken()
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptors
service.interceptors.response.use(
  response => {

    const res = response.data
    if (res.code && res.code !== 20000) {
      Notify.create({
        message: res.msg,
        type: 'negative',
        position: 'top-right'
      })

      if (res.code === 50000 || res.code === 50001 || res.code === 50002) {
        Dialog.create({
          title: '重新登录',
          message: '你已被登出，可以取消继续留在该页面，或者重新登录',
          ok: '重新登录',
          cancel: '取消'
        }).then(() => {
          store.dispatch('user/FedLogout').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    } else {
      return response
    }
  },
  error => {
    console.log('err' + error)// for debug
    Notify.create({
      message: '网络异常，请联系信息中心运维部！',
      type: 'negative',
      position: 'top-right'
    })
    return Promise.reject(error)
  }
)

export default ({ Vue }) => {
  Vue.prototype.$axios = service
}

// Here we define a named export
// that we can later use inside .js files:
export { service }