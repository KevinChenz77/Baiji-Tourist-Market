import { RenderMode, ServerRoute } from '@angular/ssr';

// 首頁／商場店家已改接即時 Strapi API，改為 Server 模式每次請求即時渲染，
// 不再於 build 時 Prerender（見 規格內容/05-後台管理系統規格.md 第5節）。
export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server,
  },
  {
    path: 'shop',
    renderMode: RenderMode.Server,
  },
  {
    path: 'shop/detail/:number',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
