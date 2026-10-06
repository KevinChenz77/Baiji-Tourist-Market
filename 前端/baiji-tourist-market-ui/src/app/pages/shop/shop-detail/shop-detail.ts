import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  HostListener,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { ShopService, shopCategoryLabels } from '../../../shared/shop.service';
import { setPageMeta } from '../../../shared/seo';

const SOCIAL_ICONS: Record<string, string> = {
  facebook: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036l-.654-.012c-.955 0-1.552.223-1.905.635-.355.403-.515.906-.515 1.634v1.714h3.481c-.08.667-.222 1.534-.375 2.145l-.233.858-.195.664h-2.678v8.288"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63a5.883 5.883 0 0 0-2.126 1.384A5.88 5.88 0 0 0 .63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913a5.89 5.89 0 0 0 1.384 2.126A5.88 5.88 0 0 0 4.14 23.37c.765.297 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558a5.89 5.89 0 0 0 2.126-1.384 5.88 5.88 0 0 0 1.384-2.126c.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.148-.558-2.913a5.89 5.89 0 0 0-1.384-2.126A5.88 5.88 0 0 0 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.072 1.17.054 1.805.249 2.227.415.56.217.96.477 1.382.896.419.42.679.819.896 1.382.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227a3.717 3.717 0 0 1-.9 1.382 3.73 3.73 0 0 1-1.38.896c-.419.164-1.058.36-2.23.413-1.267.057-1.646.07-4.853.07-3.207 0-3.586-.015-4.851-.074-1.169-.061-1.805-.256-2.227-.421a3.71 3.71 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.165-.42-.361-1.059-.413-2.23-.057-1.267-.07-1.646-.07-4.853 0-3.207.015-3.586.07-4.851.052-1.169.248-1.805.413-2.227.217-.56.477-.96.9-1.38.42-.419.819-.679 1.38-.896.422-.164 1.057-.36 2.227-.413C8.415 2.175 8.797 2.16 12 2.16z"/><path d="M12 15.887a3.887 3.887 0 1 1 0-7.774 3.887 3.887 0 0 1 0 7.774zM12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM19.846 5.595a1.44 1.44 0 1 1-2.881 0 1.44 1.44 0 0 1 2.881 0z"/></svg>`,
  line: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 10.304c0-5.369-5.383-9.738-12-9.738S0 4.935 0 10.304c0 4.815 4.278 8.846 10.055 9.608.391.085.924.258 1.059.593.121.303.079.778.039 1.085 0 0-.141.846-.172 1.027-.052.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967C23.274 14.343 24 12.418 24 10.304zM6.772 13.56H4.491a.33.33 0 0 1-.33-.33V8.413a.33.33 0 0 1 .66 0v4.487h1.951a.33.33 0 0 1 0 .66zm1.88.33a.33.33 0 0 1-.33-.33V8.413a.33.33 0 0 1 .66 0v5.147a.33.33 0 0 1-.33.33zm5.288-.33a.33.33 0 0 1-.33.33.327.327 0 0 1-.264-.133l-2.556-3.472v3.275a.33.33 0 0 1-.66 0V8.413a.33.33 0 0 1 .33-.33.327.327 0 0 1 .264.134l2.556 3.471V8.413a.33.33 0 0 1 .66 0zm3.624-3.147a.33.33 0 0 1 0 .66h-1.951v1.657h1.951a.33.33 0 0 1 0 .66h-2.281a.33.33 0 0 1-.33-.33V8.413a.33.33 0 0 1 .33-.33h2.281a.33.33 0 0 1 0 .66h-1.951v1.657h1.951z"/></svg>`,
};

type SharePlatform = 'facebook' | 'instagram' | 'line';

@Component({
  selector: 'app-shop-detail',
  imports: [MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './shop-detail.html',
  styleUrl: './shop-detail.scss',
})
export class ShopDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly shopService = inject(ShopService);
  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly categoryLabels = shopCategoryLabels;

  private readonly paramMap = toSignal(this.route.paramMap, { requireSync: true });

  protected readonly shop = computed(() => {
    const number = this.paramMap().get('number') ?? '';
    return this.shopService.getByNumber(number);
  });

  protected readonly lightboxSrc = signal<string | null>(null);

  constructor() {
    for (const [name, svg] of Object.entries(SOCIAL_ICONS)) {
      this.iconRegistry.addSvgIconLiteral(name, this.sanitizer.bypassSecurityTrustHtml(svg));
    }

    // 查無對應店家時導回列表頁，不另做 404 頁面（2026-10-05 決定）。
    const shop = this.shop();
    if (!shop) {
      this.router.navigateByUrl('/shop');
      return;
    }
    setPageMeta(
      `${shop.name}｜三峽白雞觀光商場店家`,
      `${shop.brief}｜三峽白雞觀光商場`,
      `shop/detail/${shop.number}`
    );

    afterNextRender(async () => {
      const { register } = await import('swiper/element/bundle');
      register();
    });
  }

  protected goBack(): void {
    this.location.back();
  }

  protected openLightbox(src: string): void {
    this.lightboxSrc.set(src);
  }

  protected closeLightbox(): void {
    this.lightboxSrc.set(null);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closeLightbox();
  }

  // 分享本頁連結到社群平台；Instagram 無官方網頁分享端點，改用系統分享或複製連結。
  protected share(platform: SharePlatform): void {
    const url = window.location.href;
    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'noopener');
      return;
    }
    if (platform === 'line') {
      window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`, '_blank', 'noopener');
      return;
    }
    if (navigator.share) {
      navigator.share({ title: this.shop()?.name, url }).catch(() => {});
      return;
    }
    navigator.clipboard?.writeText(url);
    alert('已複製本頁連結，請貼到 Instagram 分享');
  }
}
