
export default [
  {
    path: '/',
    redirect: '/index',
    component: () => import('layouts/dashboard'),
    meta: { requiresAuth: false },
    children: [
      { path: 'index', name: 'index', component: () => import('pages/index'), meta: { title: '主页', requiresAuth: false } },
      { path: 'user', name: 'user', component: () => import('pages/userManage/user'), meta: { title: '用户', requiresAuth: true, auth: 3 } },
      { path: 'role', name: 'role', component: () => import('pages/userManage/role'), meta: { title: '角色', requiresAuth: true, auth: 4 } },
      { path: 'comManage', name: 'comManage', component: () => import('pages/orgManage/comManage'), meta: { title: '部门管理', requiresAuth: true, auth: 5 } },
      { path: 'productCode', name: 'productCode', component: () => import('pages/productManage/productCode'), meta: { title: '商品编号管理', requiresAuth: true, auth: 6 } },
      { path: 'productStyle', name: 'productStyle', component: () => import('pages/productManage/productStyle'), meta: { title: '商品款式管理', requiresAuth: true, auth: 7 } },
      { path: 'material', name: 'material', component: () => import('pages/productManage/material'), meta: { title: '物料辅料管理', requiresAuth: true, auth: 8 } },
      { path: 'productCat', name: 'productCat', component: () => import('pages/productManage/productCat'), meta: { title: '类别管理', requiresAuth: true, auth: 9 } },
      { path: 'productCard', name: 'productCard', component: () => import('pages/productManage/productCard'), meta: { title: '商品卡片', requiresAuth: false } },
      { path: 'changeLog', name: 'changeLog', component: () => import('pages/changeLog'), meta: { title: '更新日志', requiresAuth: true, auth: 10 } }
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

