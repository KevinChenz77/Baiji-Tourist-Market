'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const zlib = require('zlib');

// 每週四 01:00（台北）把 SQLite .db 壓縮後寄到 BACKUP_EMAIL；圖片 uploads 不在內（見規格 2.2）
module.exports = {
  weeklyDbBackup: {
    task: async ({ strapi }) => {
      const to = process.env.BACKUP_EMAIL;
      if (!to || strapi.db.dialect.client !== 'sqlite') return;
      // VACUUM INTO 產生一致的快照，不受寫入中的交易影響
      const tmp = path.join(os.tmpdir(), `baiji-backup-${Date.now()}.db`);
      try {
        await strapi.db.connection.raw('VACUUM INTO ?', [tmp]);
        const gz = zlib.gzipSync(fs.readFileSync(tmp));
        const date = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' });
        await strapi.plugin('email').service('email').send({
          to,
          subject: `Baiji 資料庫備份 ${date}`,
          text: `附件為 ${date} 的 SQLite 資料庫備份（gzip 壓縮，解壓後即為 data.db）。`,
          attachments: [{ filename: `baiji-${date}.db.gz`, content: gz.toString('base64') }],
        });
        strapi.log.info(`DB 備份已寄出 (${gz.length} bytes)`);
      } catch (e) {
        strapi.log.error(`DB 備份失敗: ${e.message}`);
      } finally {
        fs.rmSync(tmp, { force: true });
      }
    },
    options: { rule: '0 1 * * 4', tz: 'Asia/Taipei' },
  },
};
