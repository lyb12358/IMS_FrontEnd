
export default [
  {
    path: '/',
    redirect: '/index',
    component: () => import('layouts/dashboard'),
    meta: { requiresAuth: false },
    children: [
      { path: 'index', component: () => import('pages/index'), meta: { requiresAuth: false } },
      { path: 'comManage', component: () => import('pages/organization/comManage'), meta: { requiresAuth: true, auth: 'view_comManage' } },
      { path: 'productCode', component: () => import('pages/product/productCode'), meta: { requiresAuth: true, auth: 'view_productCode' } },
      { path: 'productStyle', component: () => import('pages/product/productStyle'), meta: { requiresAuth: true, auth: 'view_productStyle' } },
      { path: 'productCat', component: () => import('pages/product/productCat'), meta: { requiresAuth: true, auth: 'view_productCat' } },
      { path: 'user', component: () => import('pages/userManage/user'), meta: { requiresAuth: true, auth: 'view_user' } },
      { path: 'role', component: () => import('pages/userManage/role'), meta: { requiresAuth: true, auth: 'view_role' } },
      { path: 'changeLog', component: () => import('pages/changeLog'), meta: { requiresAuth: true, auth: 'view_changeLog' } }
    ]
  },
  {
    path: '/auth',
    redirect: '/auth/login',
    meta: { requiresAuth: false },
    component: () => import('layouts/auth'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/auth/login'),
        meta: { requiresAuth: false }
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('pages/auth/register'),
        meta: { requiresAuth: false }
      }
    ]
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]

