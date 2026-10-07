import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  { path: 'traffic', loadComponent: () => import('./pages/traffic/traffic').then((m) => m.Traffic) },
  {
    path: 'shop',
    loadComponent: () => import('./pages/shop/shop-list/shop-list').then((m) => m.ShopList),
  },
  {
    path: 'shop/detail/:number',
    loadComponent: () => import('./pages/shop/shop-detail/shop-detail').then((m) => m.ShopDetail),
  },
  { path: 'market', loadComponent: () => import('./pages/market/market').then((m) => m.Market) },
  {
    path: 'market/about',
    loadComponent: () => import('./pages/market-about/market-about').then((m) => m.MarketAbout),
  },
  {
    path: 'nearby/sanxia-attractions',
    loadComponent: () =>
      import('./pages/nearby-attractions/nearby-attractions').then((m) => m.NearbyAttractions),
  },
  { path: 'hiking', loadComponent: () => import('./pages/hiking/hiking').then((m) => m.Hiking) },
  { path: '**', redirectTo: '' },
];
