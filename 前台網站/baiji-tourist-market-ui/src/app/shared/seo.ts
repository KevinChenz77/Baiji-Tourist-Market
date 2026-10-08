import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

const SITE_URL = 'https://www.baijimarket.com';

/**
 * 在元件建構子中同步呼叫，設定該頁的 title、meta description、
 * canonical 與 Open Graph 標籤。path 用不含開頭斜線的路由路徑（首頁傳 ''）。
 */
export function setPageMeta(title: string, description: string, path: string): void {
  const titleService = inject(Title);
  const metaService = inject(Meta);
  const document = inject(DOCUMENT);

  titleService.setTitle(title);
  metaService.updateTag({ name: 'description', content: description });
  metaService.updateTag({ property: 'og:title', content: title });
  metaService.updateTag({ property: 'og:description', content: description });
  metaService.updateTag({ property: 'og:type', content: 'website' });

  const url = path ? `${SITE_URL}/${path}` : `${SITE_URL}/`;
  metaService.updateTag({ property: 'og:url', content: url });

  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
}
