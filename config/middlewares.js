module.exports = [
  // 'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  {
      name: 'strapi::compression',
      config: {
        gzip: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
