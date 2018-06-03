
export default [
  {
    path: '/',
    redirect: '/index',
    component: () => import('layouts/dashboard'),
    meta: { requiresAuth: false },
    children: [
      { path: 'index', name: 'index', component: () => import('pages/index'), meta: { requiresAuth: false } },
      { path: 'comManage', name: 'comManage', component: () => import('pages/orgManage/comManage'), meta: { requiresAuth: true, auth: 'view_comManage' } },
      { path: 'productCode', name: 'productCode', component: () => import('pages/productManage/productCode'), meta: { requiresAuth: true, auth: 'view_productCode' } },
      { path: 'productStyle', name: 'productStyle', component: () => import('pages/productManage/productStyle'), meta: { requiresAuth: true, auth: 'view_productStyle' } },
      { path: 'productCat', name: 'productCat', component: () => import('pages/productManage/productCat'), meta: { requiresAuth: true, auth: 'view_productCat' } },
      { path: 'productCard', name: 'productCard', component: () => import('pages/productManage/productCard'), meta: { requiresAuth: false } },
      { path: 'user', name: 'user', component: () => import('pages/userManage/user'), meta: { requiresAuth: true, auth: 'view_user' } },
      { path: 'role', name: 'role', component: () => import('pages/userManage/role'), meta: { requiresAuth: true, auth: 'view_role' } },
      { path: 'changeLog', name: 'changeLog', component: () => import('pages/changeLog'), meta: { requiresAuth: true, auth: 'view_changeLog' } }
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
    path: '/mobileWarn',
    name: 'mobileWarn',
    component: () => import('pages/mobileWarn'),
    meta: { requiresAuth: false }
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]

