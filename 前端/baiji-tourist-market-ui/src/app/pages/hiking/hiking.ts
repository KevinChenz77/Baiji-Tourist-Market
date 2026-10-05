import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

interface HikingTrail {
  name: string;
  brief: string;
  image: string;
  sourceUrl: string;
}

// 已於 2026-10-05 查證更新里程/落差/預估時間/難度，詳見 規格內容/03-頁面內容規格.md 登山資訊一節。
const hikingTrails: HikingTrail[] = [
  {
    name: '白雞山登山步道',
    brief:
      '全長約 4.5 公里，海拔 205～734 公尺、落差 529 公尺，前身為採礦台車道，前段平緩、後段約 40 公尺峭壁需拉繩陡上，沿途可見廢棄坑洞與煤礦遺址，山頂可眺望三峽市區與 101 大樓，單程約 3 小時，難度低－中。',
    image: 'assets/images/placeholder.jpg',
    sourceUrl: 'https://hiking.biji.co/index.php?q=trail&act=detail&id=90',
  },
  {
    name: '紫微聖母環山步道（白雞山－紫微天后宮）',
    brief:
      '全長約 4 公里，海拔落差 260 公尺，環狀步道林蔭蓊鬱、設有多座休憩涼亭，稜線展望台可遠眺台北盆地、觀音山與九份平溪方向，全程約 2 小時 40 分，難度低，適合親子健行。',
    image: 'assets/images/placeholder.jpg',
    sourceUrl: 'https://hiking.biji.co/index.php?q=trail&act=detail&id=93',
  },
];

@Component({
  selector: 'app-hiking',
  imports: [MatIconModule],
  templateUrl: './hiking.html',
  styleUrl: './hiking.scss',
})
export class Hiking {
  protected readonly trails = hikingTrails;
}
