'use strict';

// 最小自測：驗證 is-own-shop policy 的三種情境（無框架，用 node 內建 assert）
// 放在 scripts/ 而非 src/api/shop/policies/，避免被 Strapi 開機時當成 policy 自動載入執行
// 跑法：node scripts/test-is-own-shop.js
const assert = require('node:assert');
const isOwnShop = require('../src/api/shop/policies/is-own-shop');

function fakeStrapi(shopRecord) {
  return {
    db: {
      query: () => ({
        findOne: async () => shopRecord,
      }),
    },
  };
}

async function run() {
  // 1. 未登入 -> 擋
  assert.strictEqual(
    await isOwnShop({ state: {}, params: { id: 1 } }, {}, { strapi: fakeStrapi(null) }),
    false,
    '未登入應擋下'
  );

  // 2. Super Admin -> 一定放行，不管 boundAccount 是誰
  const superAdminCtx = { state: { user: { id: 999, roles: [{ code: 'strapi-super-admin' }] } }, params: { id: 1 } };
  assert.strictEqual(
    await isOwnShop(superAdminCtx, {}, { strapi: fakeStrapi({ boundAccount: { id: 1 } }) }),
    true,
    'Super Admin 應放行'
  );

  // 3. 一般角色，boundAccount 等於自己 -> 放行
  const ownerCtx = { state: { user: { id: 42, roles: [{ code: 'shop-account' }] } }, params: { id: 5 } };
  assert.strictEqual(
    await isOwnShop(ownerCtx, {}, { strapi: fakeStrapi({ boundAccount: { id: 42 } }) }),
    true,
    '綁定自己商店應放行'
  );

  // 4. 一般角色，boundAccount 是別人 -> 擋
  assert.strictEqual(
    await isOwnShop(ownerCtx, {}, { strapi: fakeStrapi({ boundAccount: { id: 43 } }) }),
    false,
    '非本人綁定商店應擋下'
  );

  // 5. 一般角色，該商店完全沒綁 boundAccount -> 擋
  assert.strictEqual(
    await isOwnShop(ownerCtx, {}, { strapi: fakeStrapi({ boundAccount: null }) }),
    false,
    '未綁定任何帳號的商店應擋下'
  );

  console.log('is-own-shop policy: 全部情境通過');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
