import { getFetchClient } from '@strapi/strapi/admin';

const config = {
  // 把繁體中文加進可選語言清單（Strapi 一定會保留 'en' 這個選項，無法移除，但不影響預設值）
  locales: ['zh'],
};

// 左側「設定」選單 Strapi 寫死所有人都看得到（權限清單是空的，角色設定關不掉），
// 這裡改成只有 Super Admin 看得到。預設先藏，確認是 Super Admin 才顯示，避免閃一下。
// 只是畫面隱藏：設定頁內各功能的 API 本來就有權限保護，非管理者直接打網址也只看得到唯讀的應用程式資訊。
const SETTINGS_LINK = 'nav a[href$="/settings"]';
const hideSettingsForNonSuperAdmin = () => {
  const style = document.createElement('style');
  style.textContent = `html:not(.is-super-admin) ${SETTINGS_LINK} { display: none; }`;
  document.head.appendChild(style);

  let checked = false;
  new MutationObserver(async () => {
    if (!document.querySelector(SETTINGS_LINK)) {
      // 登出後選單消失，下次登入（可能換人）要重新判斷
      checked = false;
      document.documentElement.classList.remove('is-super-admin');
      return;
    }
    if (checked) return;
    checked = true;
    try {
      const { data } = await getFetchClient().get('/admin/users/me');
      const isSuperAdmin = data.data.roles.some((r) => r.code === 'strapi-super-admin');
      document.documentElement.classList.toggle('is-super-admin', isSuperAdmin);
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
  document.title = '三峽白雞觀光商場 後台';
  hideSettingsForNonSuperAdmin();
};

export default {
  config,
  bootstrap,
};
