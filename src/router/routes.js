
export default [
  {
    path: '/',
    redirect: '/index',
    component: () => import('layouts/dashboard'),
    meta: { requiresAuth: false },
    children: [
      { path: 'index', name: 'index', component: () => import('pages/index'), meta: { title: '首页', requiresAuth: false } },
      { path: 'comManage', name: 'comManage', component: () => import('pages/orgManage/comManage'), meta: { title: '部门管理', requiresAuth: true, auth: 'view_comManage' } },
      { path: 'productCode', name: 'productCode', component: () => import('pages/productManage/productCode'), meta: { title: '产品编号管理', requiresAuth: true, auth: 'view_productCode' } },
      { path: 'productStyle', name: 'productStyle', component: () => import('pages/productManage/productStyle'), meta: { title: '产品款式管理', requiresAuth: true, auth: 'view_productStyle' } },
      { path: 'productCat', name: 'productCat', component: () => import('pages/productManage/productCat'), meta: { title: '产品类别管理', requiresAuth: true, auth: 'view_productCat' } },
      { path: 'productCard', name: 'productCard', component: () => import('pages/productManage/productCard'), meta: { title: '产品卡片', requiresAuth: false } },
      { path: 'user', name: 'user', component: () => import('pages/userManage/user'), meta: { title: '用户', requiresAuth: true, auth: 'view_user' } },
      { path: 'role', name: 'role', component: () => import('pages/userManage/role'), meta: { title: '角色', requiresAuth: true, auth: 'view_role' } },
      { path: 'changeLog', name: 'changeLog', component: () => import('pages/changeLog'), meta: { title: '更新日志', requiresAuth: true, auth: 'view_changeLog' } }
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

