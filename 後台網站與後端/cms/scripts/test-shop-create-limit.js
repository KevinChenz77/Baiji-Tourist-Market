'use strict';

// 最小自測：驗證 shop lifecycle 的「每帳號只能建立一間商店」限制（無框架，用 node 內建 assert）
// 跑法：node scripts/test-shop-create-limit.js
const assert = require('node:assert');

function mockStrapi(existingShop) {
  return {
    requestContext: { get: () => global.__mockCtx },
    db: { query: () => ({ findOne: async () => existingShop }) },
  };
}

async function run() {
  const lifecycles = require('../src/api/shop/content-types/shop/lifecycles');

  // 1. Super Admin：不受限制，也不會被強制改綁定
  global.strapi = mockStrapi({ id: 1 });
  global.__mockCtx = { state: { user: { id: 999, roles: [{ code: 'strapi-super-admin' }] } } };
  let event = { params: { data: { number: 1 } } };
  await lifecycles.beforeCreate(event);
  assert.strictEqual(event.params.data.boundAccount, undefined, 'Super Admin 不應被強制綁定');

  // 2. 一般角色，尚未有任何商店 -> 允許建立，且自動綁定自己
  global.strapi = mockStrapi(null);
  global.__mockCtx = { state: { user: { id: 42, roles: [{ code: 'enduser' }] } } };
  event = { params: { data: { number: 2 } } };
  await lifecycles.beforeCreate(event);
  assert.strictEqual(event.params.data.boundAccount, 42, '應自動綁定為建立者本人');

  // 3. 一般角色，已經有一間商店 -> 擋下第二次建立
  global.strapi = mockStrapi({ id: 5, boundAccount: 42 });
  global.__mockCtx = { state: { user: { id: 42, roles: [{ code: 'enduser' }] } } };
  event = { params: { data: { number: 3 } } };
  await assert.rejects(() => lifecycles.beforeCreate(event), /每個帳號只能建立一間商店/, '第二間應被擋下');

  // 4. 非使用者觸發（如批次腳本，無 ctx.state.user）-> 不受限制
  global.strapi = mockStrapi(null);
  global.__mockCtx = {};
  event = { params: { data: { number: 4 } } };
  await lifecycles.beforeCreate(event);
  assert.strictEqual(event.params.data.boundAccount, undefined, '非使用者觸發不應被強制綁定');

  console.log('shop create-limit lifecycle: 全部情境通過');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
