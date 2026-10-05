import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ShopCategory,
  ShopService,
  shopCategories,
  shopCategoryLabels,
} from '../../../shared/shop.service';
import { setPageMeta } from '../../../shared/seo';

@Component({
  selector: 'app-shop-list',
  imports: [RouterLink],
  templateUrl: './shop-list.html',
  styleUrl: './shop-list.scss',
})
export class ShopList {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly shopService = inject(ShopService);

  protected readonly categories = shopCategories;
  protected readonly categoryLabels = shopCategoryLabels;

  private readonly queryParamMap = toSignal(this.route.queryParamMap, {
    requireSync: true,
  });

  protected readonly currentCategory = computed<ShopCategory>(() => {
    const raw = this.queryParamMap().get('type');
    const parsed = raw === null ? ShopCategory.全部 : Number(raw);
    return this.categories.includes(parsed) ? parsed : ShopCategory.全部;
  });

  protected readonly shops = computed(() =>
    this.shopService.getShuffledByCategory(this.currentCategory())
  );

  constructor() {
    setPageMeta(
      '商場店家｜三峽白雞觀光商場',
      '瀏覽三峽白雞觀光商場內餐飲、小吃、品茶、農特產、命理與服務店家，依分類快速找到你要的店家。',
      'shop'
    );
  }

  protected selectCategory(category: ShopCategory): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { type: category === ShopCategory.全部 ? null : category },
      queryParamsHandling: 'merge',
    });
  }

  protected onMobileSelect(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.selectCategory(value);
  }
}
