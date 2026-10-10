import { getFetchClient } from '@strapi/strapi/admin';

const config = {
  // 把繁體中文加進可選語言清單（Strapi 一定會保留 'en' 這個選項，無法移除，但不影響預設值）
  locales: ['zh'],
  // 登入頁標題／副標題預設是「歡迎使用 Strapi！」，改成本站名稱（en 也蓋，避免切到英文又跑回 Strapi）
  translations: {
    zh: {
      'Auth.form.welcome.title': '白雞商場後台',
      'Auth.form.welcome.subtitle': '登入您的帳號',
      // 受邀帳號初次設定密碼頁（標題與登入頁共用上面的 welcome.title）
      'Auth.form.register.subtitle': '請設定您的密碼以啟用帳號',
    },
    en: {
      'Auth.form.welcome.title': '白雞商場後台',
      'Auth.form.welcome.subtitle': 'Log in to your account',
      'Auth.form.register.subtitle': 'Set your password to activate your account',
    },
  },
};

// 左側「設定」選單 Strapi 寫死所有人都看得到（權限清單是空的，角色設定關不掉），
// 這裡改成只有 enduser 看不到（其他角色如 Super Admin、WebAdmin 都看得到；角色名稱不分大小寫）。預設先藏，確認身分才顯示，避免閃一下。
// 只是畫面隱藏：設定頁內各功能的 API 本來就有權限保護，非管理者直接打網址也只看得到唯讀的應用程式資訊。
const SETTINGS_LINK = 'nav a[href$="/settings"]';
const SHOP_LIST = '/admin/content-manager/collection-types/api::shop.shop';
const hideSettingsForEndUser = () => {
  const style = document.createElement('style');
  style.textContent = `html:not(.can-see-settings) ${SETTINGS_LINK} { display: none; }`;
  document.head.appendChild(style);

  // enduser 只會用到商店資料，首頁（Strapi 歡迎頁）對他們沒用：登入後或點首頁圖示都直接導到商店資料列表
  const redirectEndUserHome = () => {
    if (document.documentElement.classList.contains('is-enduser') && /^\/admin\/?$/.test(location.pathname)) {
      history.replaceState(null, '', SHOP_LIST);
      window.dispatchEvent(new PopStateEvent('popstate')); // 讓 Strapi 的 React Router 跟著換頁，不用整頁重載
    }
  };

  let checked = false;
  new MutationObserver(async () => {
    if (!document.querySelector(SETTINGS_LINK)) {
      // 登出後選單消失，下次登入（可能換人）要重新判斷
      checked = false;
      document.documentElement.classList.remove('can-see-settings', 'is-enduser');
      return;
    }
    redirectEndUserHome();
    if (checked) return;
    checked = true;
    try {
      const { data } = await getFetchClient().get('/admin/users/me');
      const canSee = !data.data.roles.every((r) => r.name?.trim().toLowerCase() === 'enduser');
      document.documentElement.classList.toggle('can-see-settings', canSee);
      document.documentElement.classList.toggle('is-enduser', !canSee);
      redirectEndUserHome();
    } catch {
      // 查不到就維持隱藏；管理者重新整理頁面即可重查
    }
  }).observe(document.body, { childList: true, subtree: true });
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
  document.title = '白雞商場後台';
  hideSettingsForEndUser();
  // 設定密碼頁的「有新功能和改進時通知我」是 Strapi 的問卷選項，非必填、對店家無用，直接藏掉。
  // 用 confirmPassword 限定在註冊表單，避免藏到登入頁的「記得我」。
  const style = document.createElement('style');
  // 商店資料的「分類」原本是可打字搜尋的下拉，手機點下去會跳鍵盤、出現打字游標。分類只有幾個不需搜尋，
  // 改成像 select：輸入框唯讀（不跳鍵盤、不能打字）＋游標透明，點欄位照樣展開選單點選。
  const CATEGORY_INPUT = 'input[role="combobox"][name="categories"]';
  style.textContent = `form:has(input[name="confirmPassword"]) div:has(> div > div > button[role="checkbox"]) { display: none; }
    ${CATEGORY_INPUT} { caret-color: transparent; cursor: pointer; }
    form:has(input[name="phone1"]) label, form:has(input[name="externalLink"]) label { font-size: 24px; }
    @media (max-width: 1079px) { nav ul a[aria-label] svg { width: 32px; height: 32px; } }`; // 商店資料、最新消息編輯頁的欄位名稱放大，店家較好閱讀；手機版 header 中間的導覽圖示（首頁、Content Manager…）放大，1080px 以上是桌機側邊欄不動
  document.head.appendChild(style);
  // 在 focus 前（pointerdown）補上 readonly，React 重新渲染欄位後下次點擊也會再補
  document.addEventListener('pointerdown', () => document.querySelector(CATEGORY_INPUT)?.setAttribute('readonly', ''), true);
};

export default {
  config,
  bootstrap,
};
