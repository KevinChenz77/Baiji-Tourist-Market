'use strict';

// 對應規格第 3.2 節：角色2（網站維護者）／角色3（商家帳號）只能 update 自己綁定的那一筆商店資料。
// 綁定關係存在 shop.boundAccount（relation -> admin::user），而非文件原規劃的「user 綁 shop」方向，
// 因為 admin::user 的 schema 由 @strapi/admin 核心鎖定（pluginOptions 標記不可見/不可擴充），
// 關聯放在 shop 這邊是 Strapi 支援的一般 relation，不需碰 admin::user 的內部定義。
module.exports = async (ctx, config, { strapi }) => {
  const user = ctx.state.user;
  if (!user) return false;

  const isSuperAdmin = Array.isArray(user.roles) && user.roles.some((r) => r.code === 'strapi-super-admin');
  if (isSuperAdmin) return true;

  const { id } = ctx.params;
  const shop = await strapi.db.query('api::shop.shop').findOne({
    where: { id },
    populate: ['boundAccount'],
  });

  return Boolean(shop?.boundAccount) && String(shop.boundAccount.id) === String(user.id);
};
