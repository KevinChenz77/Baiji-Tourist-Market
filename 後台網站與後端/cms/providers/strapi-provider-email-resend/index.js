'use strict';

// 透過 Resend HTTP API 寄信（Railway 非 Pro 方案擋對外 SMTP，所以不用 SMTP）
module.exports = {
  init({ apiKey }, { defaultFrom, defaultReplyTo } = {}) {
    return {
      async send({ from, to, cc, bcc, replyTo, subject, text, html }) {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: from || defaultFrom,
            to,
            cc,
            bcc,
            reply_to: replyTo || defaultReplyTo,
            subject,
            text,
            html,
          }),
        });
        if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
      },
    };
  },
};
