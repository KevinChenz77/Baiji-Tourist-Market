import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { setPageMeta } from '../../shared/seo';

interface NearbyAttraction {
  name: string;
  driveTime: string;
  lat: number;
  lng: number;
  officialWebsite: string;
  image: string;
  brief: string;
}

// 已於 2026-10-05 查證更新車程與座標，詳見 規格內容/03-頁面內容規格.md 周邊景點一節的查證備註。
const nearbyAttractions: NearbyAttraction[] = [
  {
    name: '大板根森林溫泉渡假村',
    driveTime: '約 5-10 分鐘',
    lat: 24.871,
    lng: 121.4069,
    officialWebsite: 'https://www.thegreatroots.com/',
    image: 'assets/images/nearby/dabangen.png',
    brief: '結合森林步道、溫泉與度假設施的園區，鄰近白雞山區，適合半日放鬆行程。',
  },
  {
    name: '三峽清水祖師廟',
    driveTime: '約 15-20 分鐘',
    lat: 24.934,
    lng: 121.3702,
    officialWebsite: 'http://www.longfuyan.org.tw/front/bin/home.phtml',
    image: 'assets/images/nearby/qingshui-zushi-temple.png',
    brief: '三峽地標古廟，以精細木雕、石雕聞名，與三峽老街相鄰，是在地信仰與工藝代表。',
  },
  {
    name: '三峽老街（三角湧老街）',
    driveTime: '約 15-20 分鐘',
    lat: 24.9338,
    lng: 121.3698,
    officialWebsite: 'https://www.sanxias.com.tw/index.php',
    image: 'assets/images/nearby/sanxia-old-street.png',
    brief: '紅磚拱廊與巴洛克式牌樓街屋保存完整，沿街有小吃、茶莊與文創店家，適合散步採買。',
  },
  {
    name: '滿月圓國家森林遊樂區',
    driveTime: '約 30-40 分鐘',
    lat: 24.8304,
    lng: 121.4447,
    officialWebsite: 'https://recreation.forest.gov.tw/Forest/RA?typ=0&typ_id=0200001',
    image: 'assets/images/nearby/manyueyuan.png',
    brief: '林相豐富、瀑布群與吊橋景觀兼具的森林遊樂區，有多條親子友善步道。',
  },
  {
    name: '鶯歌老街',
    driveTime: '約 25-30 分鐘',
    lat: 24.9522,
    lng: 121.3473,
    officialWebsite: 'https://newtaipei.travel/zh-tw/attractions/detail/110661',
    image: 'assets/images/nearby/yingge-old-street.png',
    brief: '台灣陶瓷重鎮，老街兩側林立陶藝店家與 DIY 體驗工坊，適合選購紀念品。',
  },
  {
    name: '新北市立鶯歌陶瓷博物館',
    driveTime: '約 25-30 分鐘',
    lat: 24.9493,
    lng: 121.352,
    officialWebsite: 'https://www.ceramics.ntpc.gov.tw/',
    image: 'assets/images/nearby/ceramics-museum.png',
    brief: '以陶瓷為主題的公立博物館，常設展介紹台灣陶瓷發展史，另有特展與戶外水景廣場。',
  },
  {
    name: '熊空茶園（禾煦熊空）',
    driveTime: '約 40 分鐘',
    lat: 24.8784,
    lng: 121.4625,
    officialWebsite: 'https://www.he-xu.com.tw/hexu-113-page193',
    image: 'assets/images/nearby/xiongkong-tea.jpeg',
    brief:
      '海拔 700 公尺高山秘境茶園，占地廣闊，有百年茶廠、森林玻璃屋咖啡廳與櫻花林，適合半日賞景放鬆（每週二公休）。',
  },
];

@Component({
  selector: 'app-nearby-attractions',
  imports: [MatIconModule],
  host: { class: 'block' },
  templateUrl: './nearby-attractions.html',
})
export class NearbyAttractions {
  protected readonly attractions = nearbyAttractions;

  constructor() {
    setPageMeta(
      '周邊三峽景點｜三峽白雞觀光商場',
      '三峽白雞觀光商場周邊景點推薦，包含三峽老街、清水祖師廟、大板根森林溫泉、鶯歌老街等順遊景點與車程資訊。',
      'nearby/sanxia-attractions'
    );
  }

  protected navUrl(attraction: NearbyAttraction): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${attraction.lat},${attraction.lng}`;
  }
}
