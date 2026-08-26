import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./product-list/product-list').then((m) => m.ProductList),
    data: { breadcrumb: 'Productos' },
  },
  {
    path: ':slug',
    data: { breadcrumbParam: 'slug' },
    children: [
      {
        path: '',
        loadComponent: () => import('./product-detail/product-detail').then((m) => m.ProductDetail),
      },
      {
        path: 'manual',
        loadComponent: () => import('./product-manual/product-manual').then((m) => m.ProductManual),
        data: { breadcrumb: 'Manual de usuario' },
      },
    ],
  },
];
