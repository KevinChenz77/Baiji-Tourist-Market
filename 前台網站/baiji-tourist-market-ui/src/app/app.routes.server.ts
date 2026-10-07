import { RenderMode, ServerRoute } from '@angular/ssr';
import { shopNumbers } from './shared/shop.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'shop/detail/:number',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return shopNumbers.map((number) => ({ number }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
