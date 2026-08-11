import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./product-list/product-list').then((m) => m.ProductList),
  },
  {
    path: ':slug',
    loadComponent: () => import('./product-detail/product-detail').then((m) => m.ProductDetail),
  },
];
