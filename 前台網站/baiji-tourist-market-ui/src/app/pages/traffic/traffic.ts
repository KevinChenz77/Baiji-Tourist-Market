import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { setPageMeta } from '../../shared/seo';

interface DrivingRoute {
  title: string;
  guide: string;
  mapUrl: string;
}

interface RouteBadge {
  label: string;
  url: string;
}

interface TransitOption {
  title: string;
  summary: string;
  badges: RouteBadge[];
  walkNote: string;
  extraNote?: string;
  mapTransitMode: string;
}

// 原地址「新北市三峽區嘉添里白雞路155號」在 Google 地圖會導到錯誤地點，改用地標名稱
const DESTINATION = '行修宮(行天宮三峽分宮)';

const drivingRoutes: DrivingRoute[] = [
  {
    title: '新店／安坑交流道 → 白雞停車場',
    guide:
      '國道 3 號安坑交流道下 → 安坑路（110 縣道）往三峽方向 → 成福橋 → 竹崙路 → 紫微路 → 白雞停車場。（北部／新店方向出發適用）',
    mapUrl: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent('國道3號安坑交流道')}&destination=${encodeURIComponent(DESTINATION)}&travelmode=driving`,
  },
  {
    title: '三鶯交流道 → 白雞停車場',
    guide:
      '國道 3 號三鶯交流道下 → 復興路往三峽老街 → 台 3 線（中正路一段）→ 正義街 → 白雞路 → 紫薇路 → 白雞停車場。（桃園／中壢方向出發適用）',
    mapUrl: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent('國道3號三鶯交流道')}&destination=${encodeURIComponent(DESTINATION)}&travelmode=driving`,
  },
];

const embedMapUrl = `https://www.google.com/maps?q=${encodeURIComponent(DESTINATION)}&output=embed`;

const EBUS_778 = 'https://ebus.gov.taipei/EBus/VsSimpleMap?rid=17515&sec=0';
const EBUS_779 = 'https://ebus.gov.taipei/EBus/VsSimpleMap?routeid=0400077900&gb=1';
const EBUS_F626 = 'https://ebus.gov.taipei/EBus/VsSimpleMap?routeid=0454062600&gb=0';

function transitMapUrl(mode: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(DESTINATION)}&travelmode=transit&transit_mode=${mode}`;
}

const transitOptions: TransitOption[] = [
  {
    title: '公車',
    summary:
      '台北客運 778（三峽－白雞）。於三峽老街／三峽公車站一帶上車，終點「白雞站」下車。平日、假日頭末班車皆為 05:50～19:10，為收費路線（一段票）。',
    badges: [{ label: '778', url: EBUS_778 }],
    walkNote: '白雞站下車後，步行約 3 分鐘內可達商場。',
    mapTransitMode: 'bus',
  },
  {
    title: '免費公車',
    summary:
      '新北市新巴士 F626（紫微線）。於三峽國小一帶上車，於「行天宮白雞行修宮」站下車即達，全程免費。發車時間約 08:15／10:15／13:30／16:30／18:30（班次少，建議先查即時動態確認）。',
    badges: [{ label: 'F626', url: EBUS_F626 }],
    walkNote: '「行天宮白雞行修宮」站下車即達商場。',
    mapTransitMode: 'bus',
  },
  {
    title: '捷運（三鶯線）＋公車',
    summary:
      '搭新北捷運三鶯線至「三峽站（LB06）」，出站後轉乘 778 公車至「白雞站」下車。三鶯線已於 2026-06-30 通車，三峽站鄰近公車站牌，轉乘步行距離不遠。',
    badges: [{ label: '778', url: EBUS_778 }],
    walkNote: '白雞站下車後，步行約 3 分鐘內可達商場。',
    mapTransitMode: 'bus,subway',
  },
  {
    title: '捷運＋免費公車',
    summary:
      '搭新北捷運三鶯線至「三峽站（LB06）」，出站後轉乘 F626 免費巴士（紫微線）至「行天宮白雞行修宮」站下車。',
    badges: [{ label: 'F626', url: EBUS_F626 }],
    walkNote: '「行天宮白雞行修宮」站下車即達商場。',
    mapTransitMode: 'bus,subway',
  },
  {
    title: '新店捷運站＋免費公車',
    summary:
      '搭台北客運 779（新店捷運站－三峽一站）至「檢查站」站（在地俗稱「竹崙橋頭」）下車，過馬路到對向站牌轉乘 F626 免費巴士（紫微線）往白雞方向，至「行天宮白雞行修宮」站下車，不需要搭到三峽市區再轉車。',
    badges: [
      { label: '779', url: EBUS_779 },
      { label: 'F626', url: EBUS_F626 },
    ],
    walkNote: '「行天宮白雞行修宮」站下車即達商場。',
    extraNote:
      '「檢查站」下車後，779／F626 的站牌分別在馬路對向（往新店／往白雞方向相反），需過馬路到對面站牌等 F626，和其他組合「同一站牌直接換乘」不同，請留意。',
    mapTransitMode: 'bus',
  },
];

@Component({
  selector: 'app-traffic',
  imports: [MatTabsModule, MatIconModule],
  host: { class: 'block' },
  templateUrl: './traffic.html',
})
export class Traffic {
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly drivingRoutes = drivingRoutes;
  protected readonly transitOptions = transitOptions;
  protected readonly embedMapUrl: SafeResourceUrl =
    this.sanitizer.bypassSecurityTrustResourceUrl(embedMapUrl);
  protected readonly motorcycleParkingPhoto =
    'assets/images/traffic/motorcycle-parking-location.png';

  constructor() {
    setPageMeta(
      '交通方式｜三峽白雞觀光商場',
      '三峽白雞觀光商場交通指南，提供開車路線、778公車、新巴士F626免費接駁、三鶯線捷運轉乘方式與停車場資訊。',
      'traffic'
    );
  }

  protected transitMapUrl(mode: string): string {
    return transitMapUrl(mode);
  }
}
