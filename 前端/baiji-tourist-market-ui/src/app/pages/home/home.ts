import { Component, CUSTOM_ELEMENTS_SCHEMA, afterNextRender } from '@angular/core';
import { RouterLink } from '@angular/router';
import { setPageMeta } from '../../shared/seo';

interface NewsItem {
  createdAt: string;
  title: string;
  link: string;
}

interface ShopAd {
  title: string;
  link: string;
  image: string;
  brief: string;
}

const bannerImages: string[] = [
  'assets/images/banner/banner-01.jpg',
  'assets/images/banner/banner-02.jpg',
  'assets/images/banner/banner-03.jpeg',
];

const newsList: NewsItem[] = [
  { createdAt: '2026-10-10', title: '慶賀中華民國國慶日', link: '' },
  { createdAt: '2026-09-20', title: '中秋節營業時間調整公告', link: '' },
];

// ponytail: 廣告內容待商場管理方／店家提供，先用佔位卡片保留版位，不是真實廣告。
const shopAds: ShopAd[] = Array.from({ length: 4 }, () => ({
  title: '店家工商廣告準備中',
  link: '',
  image: 'assets/images/placeholder.jpg',
  brief: '廣告版位保留中，待店家提供文案與圖片後上架。',
}));

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly bannerImages = bannerImages;
  protected readonly newsList = newsList;
  protected readonly shopAds = shopAds;

  constructor() {
    setPageMeta(
      '三峽白雞觀光商場｜行修宮商圈美食、伴手禮、交通資訊',
      '三峽白雞觀光商場官方網站，提供行修宮周邊店家美食、伴手禮、登山步道、交通停車與周邊景點等旅遊資訊。',
      ''
    );
    afterNextRender(async () => {
      const { register } = await import('swiper/element/bundle');
      register();
    });
  }
}
