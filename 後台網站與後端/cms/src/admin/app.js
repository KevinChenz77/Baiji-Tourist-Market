const config = {
  // 把繁體中文加進可選語言清單（Strapi 一定會保留 'en' 這個選項，無法移除，但不影響預設值）
  locales: ['zh'],
};

// 進站第一次（localStorage 還沒存過任何語言設定）就先預設繁體中文，
// 不用讓不懂英文的 62 位上稿人員自己去找右上角的語言切換器。
// 已經手動選過語言的使用者（localStorage 已有值）不會被蓋掉。
const bootstrap = () => {
  if (!window.localStorage.getItem('strapi-admin-language')) {
    window.localStorage.setItem('strapi-admin-language', 'zh');
  }
  // Strapi 預設分頁標題寫死為 "Strapi Admin"，登入頁不會再改它，在這裡蓋掉。
  // 登入後的內頁仍會由 Strapi 設成「頁面名 | Strapi」，後綴寫死在套件內，改不了。
  document.title = '三峽白雞觀光商場 後台';
};

export default {
  config,
  bootstrap,
};
