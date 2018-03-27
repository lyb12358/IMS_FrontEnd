
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/index') },
      { path: 'comManage', component: () => import('pages/organization/comManage') },
      { path: 'productCode', component: () => import('pages/product/productCode') },
      { path: 'productStyle', component: () => import('pages/product/productStyle') },
      { path: 'productCat', component: () => import('pages/product/productCat') },
      { path: 'user', component: () => import('pages/userManagement/user') },
      { path: 'role', component: () => import('pages/userManagement/role') },
      { path: 'changeLog', component: () => import('pages/changeLog') }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
