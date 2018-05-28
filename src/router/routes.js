
export default [
  {
    path: '/',
    redirect: '/index',
    component: () => import('layouts/dashboard'),
    children: [
      { path: 'index', component: () => import('pages/index') },
      { path: 'comManage', component: () => import('pages/organization/comManage') },
      { path: 'productCode', component: () => import('pages/product/productCode') },
      { path: 'productStyle', component: () => import('pages/product/productStyle') },
      { path: 'productCat', component: () => import('pages/product/productCat') },
      { path: 'user', component: () => import('pages/userManage/user') },
      { path: 'role', component: () => import('pages/userManage/role') },
      { path: 'changeLog', component: () => import('pages/changeLog') }
    ]
  },
  {
    path: '/auth',
    redirect: '/auth/login',
    meta: { guest: true },
    component: () => import('layouts/auth'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/auth/login'),
        meta: { title: 'Login' }
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('pages/auth/register'),
        meta: { title: 'Register' }
      }
    ]
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
