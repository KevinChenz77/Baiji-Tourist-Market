'use strict';

const { errors } = require('@strapi/utils');
const { ApplicationError } = errors;

// 角色3（enduser／商家帳號）給了 Create 權限後，原生 RBAC 無法限制「只能建立一筆」，
// 這裡用 lifecycle hook 補上這個限制：
// 1. 非 Super Admin 建立商店資料時，boundAccount 一律由伺服器端強制設為建立者本人
//    （不接受前端傳來的值，避免被冒用綁給別人）。
// 2. 若該帳號已經綁定過一間商店，擋下第二次建立。
module.exports = {
  async beforeCreate(event) {
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
