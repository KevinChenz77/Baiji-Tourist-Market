import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface Facility {
  icon: string;
  label: string;
  detail: string;
  pending: boolean;
}

const facilities: Facility[] = [
  {
    icon: 'local_parking',
    label: '停車場',
    detail: '收費停車場，大型遊覽車停靠「行修宮前第二停車場」。確切車位數、收費方式準備中。',
    pending: true,
  },
  {
    icon: 'wc',
    label: '廁所',
    detail: '已取得現場位置照片，親子廁所／無障礙廁所細節確認中。',
    pending: true,
  },
  { icon: 'support_agent', label: '遊客服務中心／詢問處', detail: '資訊整理中，待現場確認。', pending: true },
  { icon: 'accessible', label: '無障礙設施', detail: '資訊整理中，待現場確認。', pending: true },
  { icon: 'deck', label: '休憩區', detail: '資訊整理中，待現場確認。', pending: true },
  { icon: 'water_drop', label: '飲水機', detail: '資訊整理中，待現場確認。', pending: true },
  { icon: 'recycling', label: '垃圾分類／回收站', detail: '資訊整理中，待現場確認。', pending: true },
  { icon: 'pets', label: '寵物友善規範', detail: '資訊整理中，待現場確認。', pending: true },
  { icon: 'emergency', label: '緊急醫療', detail: '資訊整理中，待現場確認。', pending: true },
  { icon: 'wifi', label: 'Wi-Fi', detail: '資訊整理中，待現場確認。', pending: true },
  { icon: 'luggage', label: '置物／寄物', detail: '資訊整理中，待現場確認。', pending: true },
];

@Component({
  selector: 'app-market',
  imports: [RouterLink, MatIconModule],
  templateUrl: './market.html',
  styleUrl: './market.scss',
})
export class Market {
  protected readonly facilities = facilities;
  protected readonly toiletPhoto = 'assets/images/market/toilet-location.jpg';
}
