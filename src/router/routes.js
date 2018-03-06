
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/index') },
      { path: 'company', component: () => import('pages/organization/company') },
      { path: 'department', component: () => import('pages/organization/department') },
      { path: 'productCode', component: () => import('pages/product/productCode') },
      { path: 'productStyle', component: () => import('pages/product/productStyle') },
      { path: 'user', component: () => import('pages/userManagement/user') },
      { path: 'role', component: () => import('pages/userManagement/role') }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
