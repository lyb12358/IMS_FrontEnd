import { Notify } from 'quasar'
import { getStorageToken } from 'src/utils/tokenControl'
export default ({ router, store, Vue }) => {
  const whiteList = ['/auth/login', '/auth/register']// no redirect whitelist
  router.beforeEach((to, from, next) => {
    if (getStorageToken()) { // determine if there has token
      /* has token*/
      if (to.path === '/auth/login') {
        next({ path: '/' })
      } else {
        // if (store.getters['user/roles'].length === 0) { // 判断当前用户是否已拉取完user_info信息
        //   store.dispatch('user/GetInfo').then(response => { // 拉取user_info
        //     console.log(response.data.roles)
        //     console.log(response.data.permissions)
        //     const roles = response.data.roles
        //     const permissions = response.data.permissions
        //     store.dispatch('GenerateRoutes', { permissions }).then(() => {
        //       router.addRoutes(store.getters.addRouters)
        //       next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        //     })
        //   }).catch((error) => {
        //     store.dispatch('FedLogOut').then(() => {
        //       Notify.create({
        //         message: error.msg || '鉴权失败，请重新登录',
        //         type: nagetive,
        //         position: 'bottom-right'
        //       })
        //       next({ path: '/' })
        //     })
        //   })
        // } else {
        next()
        // }
      }
    } else {
      /* has no token*/
      if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
        next()
      } else {
        next('/auth/login') // 否则全部重定向到登录页
      }
    }
  })
}
