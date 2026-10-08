// ponytail: hardcoded for local dev (Strapi on localhost:1337); swap to a real config
// (env var / build-time replacement) once the production Strapi URL on Railway is known.
export const STRAPI_URL = 'http://localhost:1337';
export const API_BASE = `${STRAPI_URL}/api`;

/** Strapi 媒體欄位回傳相對路徑（如 /uploads/xxx.jpg），補上網域前綴。 */
export function mediaUrl(path: string | null | undefined): string {
  if (!path) return '';
  return path.startsWith('http') ? path : `${STRAPI_URL}${path}`;
}
