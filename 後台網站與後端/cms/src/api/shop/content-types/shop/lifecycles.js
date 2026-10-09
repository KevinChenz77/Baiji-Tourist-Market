'use strict';

const { errors } = require('@strapi/utils');
const { ApplicationError } = errors;

// 數量上限（規格第 5 節）：Strapi 欄位設定沒有「最多幾個」的選項，在這裡擋。
const MAX_IMAGES = 2;
const MAX_PRODUCTS = 10;
const count = (v) => (Array.isArray(v) ? v.length : v?.set?.length ?? 0);
const validateLimits = ({ images, products }) => {
  if (count(images) > MAX_IMAGES) {
    throw new ApplicationError(`商店圖片最多 ${MAX_IMAGES} 張，請刪除多餘的圖片`);
  }
  if (count(products) > MAX_PRODUCTS) {
    throw new ApplicationError(`商品最多 ${MAX_PRODUCTS} 個，請刪除多餘的商品`);
  }
};

// 角色3（enduser／商家帳號）給了 Create 權限後，原生 RBAC 無法限制「只能建立一筆」，
// 這裡用 lifecycle hook 補上這個限制：
// 1. 非 Super Admin 建立商店資料時，boundAccount 一律由伺服器端強制設為建立者本人
//    （不接受前端傳來的值，避免被冒用綁給別人）。
// 2. 若該帳號已經綁定過一間商店，擋下第二次建立。
module.exports = {
  async beforeUpdate(event) {
    validateLimits(event.params.data);
  },

  async beforeCreate(event) {
    validateLimits(event.params.data);

    const ctx = strapi.requestContext.get();
    const user = ctx?.state?.user;
    if (!user) return; // 非透過一般 HTTP 請求觸發（如批次匯入腳本），不受限制

    const isSuperAdmin = Array.isArray(user.roles) && user.roles.some((r) => r.code === 'strapi-super-admin');
    if (isSuperAdmin) return;

    event.params.data.boundAccount = user.id;

    const existing = await strapi.db.query('api::shop.shop').findOne({
      where: { boundAccount: user.id },
    });

    if (existing) {
      throw new ApplicationError('每個帳號只能建立一間商店，如需調整請聯絡管理者');
    }
  },
};
