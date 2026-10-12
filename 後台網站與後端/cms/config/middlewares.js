module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: { formidable: { maxFileSize: 10 * 1024 * 1024 } }, // 上傳單檔上限 10MB
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
