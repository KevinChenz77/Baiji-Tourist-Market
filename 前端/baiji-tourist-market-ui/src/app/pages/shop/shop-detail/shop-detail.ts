import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ShopService, shopCategoryLabels } from '../../../shared/shop.service';
import { setPageMeta } from '../../../shared/seo';

@Component({
  selector: 'app-shop-detail',
  imports: [MatIconModule],
  templateUrl: './shop-detail.html',
  styleUrl: './shop-detail.scss',
})
export class ShopDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly shopService = inject(ShopService);

  protected readonly categoryLabels = shopCategoryLabels;

  private readonly paramMap = toSignal(this.route.paramMap, { requireSync: true });

  protected readonly shop = computed(() => {
    const number = this.paramMap().get('number') ?? '';
    return this.shopService.getByNumber(number);
  });

  constructor() {
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
  }

  protected goBack(): void {
    this.location.back();
  }
}
