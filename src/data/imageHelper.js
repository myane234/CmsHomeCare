// src/utils/imageHelper.js
import { URL } from '../utils/getUrl.js'

export function getImageUrl(value) {
  if (!value || typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  const apiBase = URL === '/api' ? (import.meta.env.VITE_URLDEV || 'http://localhost:8000/api') : URL;
  const baseUrl = apiBase.replace(/\/api\/?$/, '');
  
  // Clean the path
  const normalizedPath = trimmed.replace(/^\/+/, '');
  
  // FIX: Prepend 'storage/' if it's not already there
  const finalPath = normalizedPath.startsWith('storage/') 
    ? normalizedPath 
    : `storage/${normalizedPath}`;

  return baseUrl ? `${baseUrl}/${finalPath}` : finalPath;
}