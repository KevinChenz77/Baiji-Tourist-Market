'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // 後台（content-manager）的資料範圍限制：角色2、3 在「商店資料」的 Read／Update 權限勾上這個條件後，
    // 列表與編輯都只會出現 boundAccount 是自己的那一筆。（is-own-shop policy 只管前台 /api 路由，管不到後台）
    await strapi.admin.services.permission.conditionProvider.register({
      displayName: '綁定帳號是本人',
      name: 'is-bound-account',
      handler: (user) => ({ 'boundAccount.id': user.id }),
    });

    // 前台無須登入即可讀取：最新消息／輪播圖／店家工商廣告／商店資料／分類（見規格第5節）
    const publicReadActions = [
      'api::news.news-entry.find',
      'api::news.news-entry.findOne',
      'api::banner.banner.find',
      'api::banner.banner.findOne',
      'api::activity.activity.find',
      'api::activity.activity.findOne',
      'api::shop.shop.find',
      'api::shop.shop.findOne',
      'api::category.category.find',
      'api::category.category.findOne',
    ];

    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) return;

    for (const action of publicReadActions) {
      const existing = await strapi
        .query('plugin::users-permissions.permission')
        .findOne({ where: { action, role: publicRole.id } });

      if (!existing) {
        await strapi
          .query('plugin::users-permissions.permission')
          .create({ data: { action, role: publicRole.id } });
      }
    }
  },
};
