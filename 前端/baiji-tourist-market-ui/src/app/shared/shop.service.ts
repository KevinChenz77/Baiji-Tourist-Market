import { Service } from '@angular/core';

export enum ShopCategory {
  全部 = 0,
  餐飲 = 1,
  小吃 = 2,
  品茶 = 3,
  農特產 = 4,
  命理 = 5,
  服務 = 6,
}

export interface ShopProduct {
  name: string;
  price?: string;
  image: string;
  desc?: string;
}

export interface Shop {
  number: string;
  type: ShopCategory[];
  name: string;
  brief: string;
  images: string[];
  doc: string;
  products: ShopProduct[];
  phone: string[];
  officialWebsite: string;
  fb: string;
  ig: string;
}

const shops: Shop[] = [
  {
    number: '01',
    type: [ShopCategory.品茶, ShopCategory.農特產],
    name: '自耕茶廠',
    brief: '專營高山茶/碧螺春/東方美人/蜜香紅茶',
    images: [
      'assets/images/placeholder.jpg',
      'assets/images/placeholder.jpg',
      'assets/images/placeholder.jpg',
    ],
    doc: '三代經營的自耕茶園，海拔六百公尺栽種高山茶，主力商品為碧螺春、東方美人與蜜香紅茶。堅持手工採摘、小量烘焙，茶葉皆自家茶園直送，歡迎試飲選購，亦提供茶葉禮盒訂製。',
    products: [
      { name: '碧螺春茶葉', price: 'NT$600 / 150g', image: 'assets/images/placeholder.jpg', desc: '清香回甘，自家茶園手採手炒' },
      { name: '東方美人茶', price: 'NT$1,200 / 150g', image: 'assets/images/placeholder.jpg', desc: '蜜香濃郁，小量烘焙限量供應' },
      { name: '蜜香紅茶禮盒', price: 'NT$980 / 盒', image: 'assets/images/placeholder.jpg', desc: '送禮自用兩相宜，附提盒包裝' },
    ],
    phone: ['0987654321', '02-23456789'],
    officialWebsite: '',
    fb: '',
    ig: '',
  },
  {
    number: '02',
    type: [ShopCategory.餐飲],
    name: '阿婆土雞城',
    brief: '古早味放山土雞料理，假日熱門用餐選擇',
    images: [
      'assets/images/placeholder.jpg',
      'assets/images/placeholder.jpg',
    ],
    doc: '經營超過二十年的土雞料理餐廳，招牌白斬土雞、鹽焗雞皆選用在地放山雞現點現做，另有山產野菜與季節時蔬熱炒，適合家庭聚餐、登山後補充體力。',
    products: [
      { name: '白斬土雞', price: 'NT$680 / 半隻', image: 'assets/images/placeholder.jpg', desc: '現點現做，肉質彈嫩沾醬提味' },
      { name: '鹽焗雞', price: 'NT$680 / 半隻', image: 'assets/images/placeholder.jpg', desc: '鹽焗入味，皮脆肉香' },
      { name: '山產野菜拼盤', price: 'NT$280', image: 'assets/images/placeholder.jpg', desc: '當季野菜現炒，份量十足' },
    ],
    phone: ['02-26712345'],
    officialWebsite: '',
    fb: '',
    ig: '',
  },
  {
    number: '03',
    type: [ShopCategory.小吃],
    name: '廟口滷味',
    brief: '行修宮廟口老字號滷味攤',
    images: [
      'assets/images/placeholder.jpg',
      'assets/images/placeholder.jpg',
    ],
    doc: '緊鄰行修宮廟埕的滷味小攤，豆干、海帶、米血、雞翅都是招牌品項，古早味滷汁每日熬煮，香客參拜完順手買一包當零嘴，也可加購打包帶下山。',
    products: [
      { name: '滷豆干', price: 'NT$50 / 包', image: 'assets/images/placeholder.jpg', desc: '古早味滷汁入味' },
      { name: '滷米血', price: 'NT$50 / 包', image: 'assets/images/placeholder.jpg' },
      { name: '綜合滷味拼盤', price: 'NT$150', image: 'assets/images/placeholder.jpg', desc: '豆干、海帶、雞翅任選組合' },
    ],
    phone: ['0912345678'],
    officialWebsite: '',
    fb: '',
    ig: '',
  },
  {
    number: '04',
    type: [ShopCategory.小吃],
    name: '古早味豆花',
    brief: '手工豆花，夏天剉冰、冬天熱豆花',
    images: [
      'assets/images/placeholder.jpg',
      'assets/images/placeholder.jpg',
    ],
    doc: '每日新鮮現做豆花，口感綿密不死甜，配料有花生、紅豆、粉圓等傳統選項；夏季供應剉冰系列，冬季改賣薑汁熱豆花，是登山客下山後的消暑/暖身首選。',
    products: [
      { name: '原味豆花', price: 'NT$45', image: 'assets/images/placeholder.jpg', desc: '綿密不死甜，可加三種配料' },
      { name: '綜合剉冰', price: 'NT$60', image: 'assets/images/placeholder.jpg', desc: '夏季限定，配料任選' },
      { name: '薑汁熱豆花', price: 'NT$50', image: 'assets/images/placeholder.jpg', desc: '冬季限定，暖胃暖身' },
    ],
    phone: ['0933123456'],
    officialWebsite: '',
    fb: '',
    ig: '',
  },
  {
    number: '05',
    type: [ShopCategory.農特產],
    name: '白雞手作醬菜舖',
    brief: '傳統手工醬菜、脆瓜、桔醬',
    images: [
      'assets/images/placeholder.jpg',
      'assets/images/placeholder.jpg',
    ],
    doc: '承襲傳統古法醃製的醬菜舖，脆瓜、蔭瓜、桔醬、豆腐乳皆為自家手工製作，無添加防腐劑，是許多老顧客回購的伴手禮，亦提供宅配服務。',
    products: [
      { name: '手工脆瓜', price: 'NT$150 / 罐', image: 'assets/images/placeholder.jpg', desc: '古法醃製，無添加防腐劑' },
      { name: '蔭瓜', price: 'NT$150 / 罐', image: 'assets/images/placeholder.jpg' },
      { name: '桔醬', price: 'NT$180 / 瓶', image: 'assets/images/placeholder.jpg', desc: '沾食白斬雞最佳搭檔' },
    ],
    phone: ['02-26713456'],
    officialWebsite: '',
    fb: '',
    ig: '',
  },
  {
    number: '06',
    type: [ShopCategory.餐飲, ShopCategory.小吃],
    name: '山城野菜小館',
    brief: '在地野菜合炒，簡單山產熱炒',
    images: [
      'assets/images/placeholder.jpg',
      'assets/images/placeholder.jpg',
    ],
    doc: '主打在地當季野菜與簡單熱炒料理，川七、山蘇、龍鬚菜依時節上桌，另有炒米粉、薑絲大腸等家常菜色，價格親民，適合登山團體與家庭客群。',
    products: [
      { name: '炒山蘇', price: 'NT$150', image: 'assets/images/placeholder.jpg', desc: '當季現採，清炒蒜香' },
      { name: '炒米粉', price: 'NT$120', image: 'assets/images/placeholder.jpg' },
      { name: '薑絲大腸', price: 'NT$180', image: 'assets/images/placeholder.jpg', desc: '古早家常味，酸香下飯' },
    ],
    phone: ['0922334455'],
    officialWebsite: '',
    fb: '',
    ig: '',
  },
  {
    number: '07',
    type: [ShopCategory.命理],
    name: '行修宮前算命館',
    brief: '命理諮詢、安太歲、開運小物',
    images: [
      'assets/images/placeholder.jpg',
      'assets/images/placeholder.jpg',
    ],
    doc: '提供八字、紫微斗數、姓名學等命理諮詢服務，香期期間可代辦安太歲、點光明燈等事宜，店內另售開運手珠、平安符等小物，歡迎預約諮詢。',
    products: [
      { name: '八字命理諮詢', price: 'NT$800 / 次', image: 'assets/images/placeholder.jpg', desc: '一對一詳細解盤' },
      { name: '安太歲代辦', price: 'NT$300 / 年', image: 'assets/images/placeholder.jpg' },
      { name: '開運平安符', price: 'NT$100 起', image: 'assets/images/placeholder.jpg', desc: '隨身攜帶，祈求平安' },
    ],
    phone: ['02-26714567'],
    officialWebsite: '',
    fb: '',
    ig: '',
  },
  {
    number: '08',
    type: [ShopCategory.服務],
    name: '登山用品租借站',
    brief: '登山杖、雨具、簡易裝備租借',
    images: [
      'assets/images/placeholder.jpg',
      'assets/images/placeholder.jpg',
    ],
    doc: '提供登山杖、雨衣雨傘、頭燈等簡易登山裝備現場租借服務，方便臨時起意上山的遊客不用自備全套裝備，另售瓶裝水、能量補給食品與登山地圖。',
    products: [
      { name: '登山杖租借', price: 'NT$50 / 日', image: 'assets/images/placeholder.jpg' },
      { name: '雨衣租借', price: 'NT$30 / 日', image: 'assets/images/placeholder.jpg' },
      { name: '頭燈租借', price: 'NT$80 / 日', image: 'assets/images/placeholder.jpg', desc: '夜間登山必備' },
    ],
    phone: ['0955667788'],
    officialWebsite: '',
    fb: '',
    ig: '',
  },
  {
    number: '09',
    type: [ShopCategory.品茶],
    name: '雲深茶坊',
    brief: '茶飲、咖啡、靜謐山景雅座',
    images: [
      'assets/images/placeholder.jpg',
      'assets/images/placeholder.jpg',
    ],
    doc: '結合茶飲與咖啡的複合式茶坊，室內外座位皆可遠眺山景，供應手沖單品咖啡、烏龍奶茶與手作甜點，適合健行後坐下來休息片刻、欣賞山林景色。',
    products: [
      { name: '手沖單品咖啡', price: 'NT$150', image: 'assets/images/placeholder.jpg' },
      { name: '烏龍奶茶', price: 'NT$90', image: 'assets/images/placeholder.jpg', desc: '茶香濃郁，回甘不膩' },
      { name: '手作甜點', price: 'NT$120', image: 'assets/images/placeholder.jpg', desc: '每日限量供應' },
    ],
    phone: ['0966778899'],
    officialWebsite: '',
    fb: '',
    ig: '',
  },
  {
    number: '10',
    type: [ShopCategory.餐飲],
    name: '老街咖啡館',
    brief: '複合式咖啡館，提供簡餐與甜點',
    images: [
      'assets/images/placeholder.jpg',
      'assets/images/placeholder.jpg',
    ],
    doc: '',
    products: [
      { name: '招牌簡餐', price: 'NT$220', image: 'assets/images/placeholder.jpg' },
      { name: '手沖咖啡', price: 'NT$130', image: 'assets/images/placeholder.jpg' },
      { name: '手作蛋糕', price: 'NT$110', image: 'assets/images/placeholder.jpg', desc: '每日新鮮烘焙' },
    ],
    phone: ['02-26715678'],
    officialWebsite: 'https://www.google.com',
    fb: '',
    ig: '',
  },
];

export const shopCategoryLabels: Record<ShopCategory, string> = {
  [ShopCategory.全部]: '全部',
  [ShopCategory.餐飲]: '餐飲',
  [ShopCategory.小吃]: '小吃',
  [ShopCategory.品茶]: '品茶',
  [ShopCategory.農特產]: '農特產',
  [ShopCategory.命理]: '命理',
  [ShopCategory.服務]: '服務',
};

/** 供 app.routes.server.ts 的 getPrerenderParams 使用，產生 /shop/detail/:number 的靜態頁清單。 */
export const shopNumbers: string[] = shops.map((shop) => shop.number);

export const shopCategories: ShopCategory[] = [
  ShopCategory.全部,
  ShopCategory.餐飲,
  ShopCategory.小吃,
  ShopCategory.品茶,
  ShopCategory.農特產,
  ShopCategory.命理,
  ShopCategory.服務,
];

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

@Service()
export class ShopService {
  // ponytail: in-memory cache keyed by category, cleared on reload — good enough
  // since the shuffle only needs to survive list<->detail navigation within a session.
  private readonly shuffledCache = new Map<ShopCategory, Shop[]>();

  getAll(): Shop[] {
    return shops;
  }

  getByCategory(category: ShopCategory): Shop[] {
    if (category === ShopCategory.全部) {
      return shops;
    }
    return shops.filter((shop) => shop.type.includes(category));
  }

  /** 篩選後的清單以隨機順序顯示，同一分類在列表 ↔ 詳情頁來回時順序保持不變，重新整理才會重新洗牌。 */
  getShuffledByCategory(category: ShopCategory): Shop[] {
    let cached = this.shuffledCache.get(category);
    if (!cached) {
      cached = shuffle(this.getByCategory(category));
      this.shuffledCache.set(category, cached);
    }
    return cached;
  }

  getByNumber(number: string): Shop | undefined {
    return shops.find((shop) => shop.number === number);
  }
}
