'use strict';

const { ForbiddenError } = require('@strapi/utils').errors;

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    // 非 Super Admin（例如 webAdmin）即使有「使用者」新增／編輯／刪除權限，也只能管理 enduser 角色的帳號：
    // 角色下拉只會看到 enduser，且後端擋掉指派其他角色、或動到非 enduser 帳號（避免改 Super Admin 的密碼）
    // 例外：修改（update）也可以改 webAdmin 帳號的資料，但角色只能維持原樣或改成 enduser
    const ALLOWED_ROLE_NAME = 'enduser';
    const EDITABLE_ROLE_NAMES = [ALLOWED_ROLE_NAME, 'webAdmin'];
    const isSuperAdmin = (user) => user?.roles?.some((r) => r.code === 'strapi-super-admin');
    const roleIds = async (names) =>
      (await strapi.db.query('admin::role').findMany({ where: { name: names } })).map((r) => r.id);
    const sameIds = (a, b) => a.length === b.length && a.every((id) => b.includes(Number(id)));
    const assertRoles = async (ids, currentIds = []) => {
      const allowed = await roleIds([ALLOWED_ROLE_NAME]);
      if (!sameIds(ids, currentIds) && !ids.every((id) => allowed.includes(Number(id)))) {
        throw new ForbiddenError(`只能指派「${ALLOWED_ROLE_NAME}」角色`);
      }
    };
    const findTargets = (ids) =>
      strapi.db.query('admin::user').findMany({ where: { id: ids }, populate: ['roles'] });
    const assertTargets = async (users, names = [ALLOWED_ROLE_NAME]) => {
      const allowed = await roleIds(names);
      if (users.some((u) => u.roles.some((r) => !allowed.includes(r.id)))) {
        throw new ForbiddenError(`只能管理「${names.join('」、「')}」角色的帳號`);
      }
    };
    const guard = (check, handler) => async (ctx) => {
      if (!isSuperAdmin(ctx.state.user)) await check(ctx);
      return handler(ctx);
    };

    strapi.get('controllers').extend('admin::user', (c) => ({
      ...c,
      create: guard((ctx) => assertRoles(ctx.request.body?.roles ?? []), c.create),
      update: guard(async (ctx) => {
        const [target] = await findTargets([ctx.params.id]);
        if (!target) return;
        await assertTargets([target], EDITABLE_ROLE_NAMES);
        if (ctx.request.body?.roles) await assertRoles(ctx.request.body.roles, target.roles.map((r) => r.id));
      }, c.update),
      deleteOne: guard(async (ctx) => assertTargets(await findTargets([ctx.params.id])), c.deleteOne),
      deleteMany: guard(async (ctx) => assertTargets(await findTargets(ctx.request.body?.ids ?? [])), c.deleteMany),
    }));

    strapi.get('controllers').extend('admin::role', (c) => ({
      ...c,
      async findAll(ctx) {
        await c.findAll(ctx);
        if (!isSuperAdmin(ctx.state.user)) {
          ctx.body.data = ctx.body.data.filter((r) => r.name === ALLOWED_ROLE_NAME);
        }
      },
    }));
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // 手機照片靠 EXIF 標記方向，Strapi 產縮圖時會丟掉 EXIF 卻沒轉正 → 後台縮圖轉 90 度；開啟 autoOrientation 上傳時就先轉正
    const uploadStore = strapi.store({ type: 'plugin', name: 'upload', key: 'settings' });
    const uploadSettings = (await uploadStore.get()) ?? {};
    if (!uploadSettings.autoOrientation) await uploadStore.set({ value: { ...uploadSettings, autoOrientation: true } });

    // 後台編輯頁／列表的欄位名稱預設是英文欄位代號（name、phone1…），存在 DB 的版面設定裡；
    // 每次啟動蓋成中文，本機與 Railway 都一致。其他版面設定（排版、顯示欄位）不動。
    const fieldLabels = {
      'content_types::api::shop.shop': {
        number: '商家編號', name: '店名', categories: '分類', doc: '店家介紹',
        phone1: '電話1', phone2: '電話2', line: 'LineID', fb: 'FB', ig: 'IG',
        officialWebsite: '官網連結', images: '圖片上傳', products: '商品與服務', boundAccount: '綁定帳號',
        createdAt: '建立時間', updatedAt: '更新時間', createdBy: '建立者', updatedBy: '更新者',
      },
      'components::shop.product': { image: '圖片上傳', name: '商品名稱', price: '價格', desc: '簡述' },
      'content_types::api::news.news-entry': {
        title: '標題', newsDate: '日期', image: '圖片上傳', description: '內容簡述', externalLink: '外部連結',
        createdAt: '建立時間', updatedAt: '更新時間', createdBy: '建立者', updatedBy: '更新者',
      },
    };
    for (const [uid, labels] of Object.entries(fieldLabels)) {
      const store = strapi.store({ type: 'plugin', name: 'content_manager', key: `configuration_${uid}` });
      const conf = await store.get();
      if (!conf) continue; // 首次啟動 content-manager 還沒產生設定，下次啟動再套
      for (const [field, label] of Object.entries(labels)) {
        const meta = conf.metadatas[field];
        if (!meta) continue;
        if (meta.edit) meta.edit.label = label;
        if (meta.list) meta.list.label = label;
      }
      await store.set({ value: conf });
    }

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
