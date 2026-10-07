import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { setPageMeta } from '../../shared/seo';

interface Facility {
  icon: string;
  label: string;
  detail: string;
  pending: boolean;
  rules?: string[];
}

const facilities: Facility[] = [
  {
    icon: 'wc',
    label: '廁所',
    detail: '已取得現場位置照片，親子廁所／無障礙廁所細節確認中。',
    pending: true,
  },
  { icon: 'support_agent', label: '遊客服務中心／詢問處', detail: '資訊整理中，待現場確認。', pending: true },
  { icon: 'deck', label: '休憩區', detail: '位於商場中庭，大樹下方設有休憩區可稍作休息。', pending: false },
  { icon: 'water_drop', label: '飲水機', detail: '飲水機位於行修宮右側淨手室。', pending: false },
  { icon: 'recycling', label: '垃圾分類／回收站', detail: '位於商場中庭，設有垃圾丟棄與回收區。', pending: false },
  {
    icon: 'pets',
    label: '寵物友善規範',
    detail: '歡迎攜帶寵物同遊，入場請遵守以下規範：',
    pending: false,
    rules: [
      '第一條（管領責任）：進入本空間時，請飼主全程陪伴在毛小孩身邊，切勿讓寵物單獨留置。',
      '第二條（防護措施）：為保障他人安全，寵物進入商場內必須繫上牽繩、使用胸背帶、放置於寵物推車或外出籠內。若牽繩可延伸，請固定在適當長度（建議 1.5 公尺內）。',
      '第三條（衛生維護）：寵物如在商場內便溺，請飼主務必主動清理乾淨，或告知現場工作人員協助消毒；依據食安法良好衛生規範準則，寵物嚴禁進入廚房及工作備餐區；寵物不得使用餐廳提供給人類的杯具及餐具，如有飲水需求，請向店家索取免洗餐具。',
      '第四條（秩序安撫）：如毛小孩因環境陌生而持續吠叫或有焦慮行為，請飼主耐心安撫。',
      '第五條（損害賠償）：請勿讓寵物啃咬、破壞本場所之桌椅或裝飾物品。若有損壞，飼主須負擔全額賠償責任。',
    ],
  },
  { icon: 'emergency', label: '緊急醫療', detail: '資訊整理中，待現場確認。', pending: true },
];

@Component({
  selector: 'app-market',
  imports: [RouterLink, MatIconModule],
  host: { class: 'block' },
  templateUrl: './market.html',
})
export class Market {
  protected readonly facilities = facilities;
  protected readonly toiletPhoto = 'assets/images/market/toilet-location.jpg';
  protected readonly waterFountainPhoto = 'assets/images/market/water-fountain-location.png';
  protected readonly restAreaPhoto = 'assets/images/market/rest-area-location.jpeg';

  constructor() {
    setPageMeta(
      '商場介紹｜三峽白雞觀光商場',
      '三峽白雞觀光商場設施介紹，包含停車場、廁所、遊客服務中心等必要設施資訊。',
      'market'
    );
  }
}
