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
        if (store.getters['user/permissions'].length === 0) {
          store.dispatch('user/GetInfo').then(response => {
          }).catch((error) => {
            store.dispatch('user/FedLogout').then(() => {
              Notify.create({
                message: error.data.msg || '鉴权失败，请重新登录',
                type: 'negative',
                position: 'bottom-right'
              })
              next({ path: '/' })
            })
          })
        }
        const permissions = store.getters['user/permissions']
        if (to.meta.requiresAuth && (permissions.indexOf('superAdmin') < 0)) {
          if (permissions.indexOf(to.meta.auth) > -1) {
            console.log('有权限进入')
            next()
          } else {
            Notify.create({
              message: '权限不足，无法访问',
              type: 'negative',
              position: 'bottom-right'
            })
          }
        } else {
          console.log('不需要权限或者是超级管理员')
          next()
        }
      }
    } else {
      /* has no token*/
      if (whiteList.indexOf(to.path) > -1) {
        next()
      } else {
        next('/auth/login')
      }
    }
  })
}
