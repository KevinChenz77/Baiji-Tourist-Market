import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, afterNextRender, computed, signal, viewChild } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { setPageMeta } from '../../shared/seo';
import { API_BASE, mediaUrl } from '../../shared/api';

interface NewsItem {
  createdAt: string;
  title: string;
  link: string;
  image: string;
  content: string;
}

interface ActivityItem {
  title: string;
  startDate: string;
  endDate: string;
  image: string;
  brief: string;
  content: string;
}

interface StrapiMediaFile {
  url: string;
}

interface StrapiBanner {
  image: StrapiMediaFile | null;
}

interface StrapiNews {
  title: string;
  newsDate: string;
  externalLink: string | null;
  image: StrapiMediaFile | null;
  description: string | null;
}

interface StrapiActivity {
  title: string;
  startDate: string;
  endDate: string;
  brief: string;
  content: string;
  image: StrapiMediaFile | null;
}

// ponytail: mock 資料保留對照、不刪除——已改接 Strapi API，見 Home 元件內的 httpResource。
/*
const bannerImages: string[] = [
  'assets/images/banner/banner-01.jpg',
  'assets/images/banner/banner-02.jpg',
  'assets/images/banner/banner-03.jpeg',
];

const newsList: NewsItem[] = [
  {
    createdAt: '2026-11-01',
    title: '行脩宮冬令進香交通管制公告',
    link: '',
    image: 'assets/images/placeholder.jpg',
    content: '因應冬令進香期間人潮增加，行脩宮周邊路段將於活動期間實施交通管制，建議提前規劃停車與抵達時間，避開尖峰時段上山。',
  },
  {
    createdAt: '2026-10-10',
    title: '慶賀中華民國國慶日',
    link: 'https://www.google.com',
    image: 'assets/images/placeholder.jpg',
    content: '國慶日當天商場正常營業，行修宮同步舉辦慶祝活動，歡迎香客與遊客共襄盛舉。',
  },
  {
    createdAt: '2026-09-20',
    title: '中秋節營業時間調整公告',
    link: '',
    image: 'assets/images/placeholder.jpg',
    content: '中秋節連假期間商場營業時間略有調整，請以現場公告為準，造成不便敬請見諒。',
  },
  {
    createdAt: '2026-08-15',
    title: '白雞山步道因颱風影響暫停開放',
    link: '',
    image: 'assets/images/placeholder.jpg',
    content: '受近期颱風影響，白雞山登山步道部分路段坍方，為維護登山安全即日起暫停開放，確切恢復開放時間將另行公告，請登山遊客改道其他步道。',
  },
  {
    createdAt: '2026-07-04',
    title: '商場攤商聯合促銷活動開跑',
    link: 'https://www.facebook.com/',
    image: '',
    content: '',
  },
  {
    createdAt: '2026-05-20',
    title: '母親節感恩回饋活動',
    link: '',
    image: 'assets/images/placeholder.jpg',
    content: '五月感恩月商場攤商推出多項優惠回饋方案，詳情請洽各店家櫃台，數量有限、送完為止。',
  },
  {
    createdAt: '2026-01-01',
    title: '元旦暨跨年期間營業公告',
    link: 'https://www.google.com',
    image: '',
    content: '',
  },
];

// ponytail: 活動內容待商場管理方／店家提供，先用佔位卡片保留版位，不是真實活動。
const activityList: ActivityItem[] = Array.from({ length: 4 }, () => ({
  title: '商家活動訊息準備中',
  startDate: '',
  endDate: '',
  image: 'assets/images/placeholder.jpg',
  brief: '活動版位保留中，待店家提供文案與圖片後上架。',
  content: '活動版位保留中，待店家提供文案與圖片後上架。',
}));
*/

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: { class: 'block' },
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly bannersResource = httpResource<{ data: StrapiBanner[] }>(
    () => `${API_BASE}/banners?populate=*`,
    { defaultValue: { data: [] } }
  );
  private readonly newsResource = httpResource<{ data: StrapiNews[] }>(
    () => `${API_BASE}/news?populate=*`,
    { defaultValue: { data: [] } }
  );
  private readonly activitiesResource = httpResource<{ data: StrapiActivity[] }>(
    () => `${API_BASE}/activities?populate=*`,
    { defaultValue: { data: [] } }
  );

  protected readonly bannerImages = computed(() =>
    this.bannersResource
      .value()
      .data.map((b) => mediaUrl(b.image?.url))
      .slice(0, 5)
  );

  protected readonly newsList = computed<NewsItem[]>(() =>
    this.newsResource
      .value()
      .data.map((n) => ({
        createdAt: n.newsDate,
        title: n.title,
        link: n.externalLink ?? '',
        image: mediaUrl(n.image?.url),
        content: n.description ?? '',
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 5)
  );

  protected readonly activityList = computed<ActivityItem[]>(() =>
    this.activitiesResource.value().data.map((a) => ({
      title: a.title,
      startDate: a.startDate,
      endDate: a.endDate,
      image: mediaUrl(a.image?.url),
      brief: a.brief,
      content: a.content,
    }))
  );

  protected readonly selectedNews = signal<NewsItem | null>(null);
  protected readonly selectedActivity = signal<ActivityItem | null>(null);
  private readonly newsDialog = viewChild<ElementRef<HTMLDialogElement>>('newsDialog');
  private readonly activityDialog = viewChild<ElementRef<HTMLDialogElement>>('activityDialog');

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

  protected openNewsPopup(item: NewsItem): void {
    this.selectedNews.set(item);
    this.newsDialog()?.nativeElement.showModal();
  }

  protected closeNewsPopup(): void {
    this.newsDialog()?.nativeElement.close();
  }

  protected openActivityPopup(item: ActivityItem): void {
    this.selectedActivity.set(item);
    this.activityDialog()?.nativeElement.showModal();
  }

  protected closeActivityPopup(): void {
    this.activityDialog()?.nativeElement.close();
  }
}
