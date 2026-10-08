import { isDevMode } from '@angular/core';

export const STRAPI_URL = isDevMode()
  ? 'http://localhost:1337'
  : 'https://cms-api-production-8a2f.up.railway.app';
export const API_BASE = `${STRAPI_URL}/api`;

/** Strapi 媒體欄位回傳相對路徑（如 /uploads/xxx.jpg），補上網域前綴。 */
export function mediaUrl(path: string | null | undefined): string {
  if (!path) return '';
  return path.startsWith('http') ? path : `${STRAPI_URL}${path}`;
}
