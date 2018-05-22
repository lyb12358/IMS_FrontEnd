import axios from 'axios'
import { Notify } from 'quasar'
import store from 'src/store'
import { getStorageToken } from 'src/utils/auth'

const service = axios.create({
  baseURL: process.env.API,
  timeout: 15000
})

// request interceptors
service.interceptors.request.use(config => {
  if (store.getters.token) {
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

    // const res = response.data
    // if (res.result !== 'success') {
    //   Notify.create({
    //     message: res.info,
    //     type: nagetive,
    //     position: 'bottom-right'
    //   })

    //   // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
    //       confirmButtonText: '重新登录',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('FedLogOut').then(() => {
    //         location.reload()// 为了重新实例化vue-router对象 避免bug
    //       })
    //     })
    //   }
    //   return Promise.reject('error')
    // } else {
    //   return response
    // }
    return response
  },
  error => {
    console.log('err' + error)// for debug
    Notify.create({
      message: res.info,
      type: nagetive,
      position: 'bottom-right'
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