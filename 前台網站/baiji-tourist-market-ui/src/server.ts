import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * 動態 sitemap：固定頁面 + Strapi 即時店家清單，新增／修改店家不用手動更新。
 */
const SITE_URL = 'https://www.baijimarket.com';
const CMS_API = 'https://cms-api-production-8a2f.up.railway.app/api';
const STATIC_PATHS = ['', 'traffic', 'shop', 'market', 'market/about', 'nearby/sanxia-attractions', 'hiking'];

app.get('/sitemap.xml', async (_req, res) => {
  let shops: { number: number; updatedAt: string }[] = [];
  try {
    const r = await fetch(
      `${CMS_API}/shops?fields[0]=number&fields[1]=updatedAt&pagination[pageSize]=100`,
    );
    shops = ((await r.json()) as { data: typeof shops }).data;
  } catch {
    // CMS 掛掉時仍回傳固定頁面，不讓 sitemap 整個 500。
  }
  const urls = [
    ...STATIC_PATHS.map((p) => `<url><loc>${SITE_URL}/${p}</loc></url>`),
    ...shops.map(
      (s) =>
        `<url><loc>${SITE_URL}/shop/detail/${s.number}</loc><lastmod>${s.updatedAt.slice(0, 10)}</lastmod></url>`,
    ),
  ];
  res
    .type('application/xml')
    .set('Cache-Control', 'public, max-age=3600')
    .send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
    );
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
