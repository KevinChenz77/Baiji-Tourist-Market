import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export const SITE_URL = 'https://www.baijimarket.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/icon-512.png`;
const PAGE_LD_ID = 'page-ld';

/**
 * 在元件建構子中同步呼叫，設定該頁的 title、meta description、
 * canonical 與 Open Graph 標籤。path 用不含開頭斜線的路由路徑（首頁傳 ''）。
 * image 不傳則用網站 icon。順便清掉上一頁的頁面專屬 JSON-LD。
 */
export function setPageMeta(
  title: string,
  description: string,
  path: string,
  image: string = DEFAULT_OG_IMAGE
): void {
  const titleService = inject(Title);
  const metaService = inject(Meta);
  const document = inject(DOCUMENT);

  titleService.setTitle(title);
  metaService.updateTag({ name: 'description', content: description });
  metaService.updateTag({ property: 'og:title', content: title });
  metaService.updateTag({ property: 'og:description', content: description });
  metaService.updateTag({ property: 'og:type', content: 'website' });
  metaService.updateTag({ property: 'og:image', content: image });

  const url = path ? `${SITE_URL}/${path}` : `${SITE_URL}/`;
  metaService.updateTag({ property: 'og:url', content: url });

  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);

  document.getElementById(PAGE_LD_ID)?.remove();
}

/** 在 setPageMeta 之後呼叫，於 <head> 放入該頁專屬的 schema.org JSON-LD（SSR 會輸出到 HTML）。 */
export function setPageJsonLd(data: object): void {
  const document = inject(DOCUMENT);
  const script = document.createElement('script');
  script.id = PAGE_LD_ID;
  script.type = 'application/ld+json';
  // 店家文字來自後台輸入，跳脫 < 避免 "</script>" 提前結束標籤。
  script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
  document.head.appendChild(script);
}
