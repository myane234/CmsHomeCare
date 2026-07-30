// Real API calls to the live Laravel backend for Artikel CMS.
// Docs: https://citra.faaruq.com/docs
// Endpoints: GET/POST /api/artikel, GET/PUT/DELETE /api/artikel/{id}

import { URL } from '../utils/getUrl.js';
import { getAuthHeaders } from '../utils/auth.js';

export const KATEGORI_ARTIKEL_OPTIONS = ['Tips Kesehatan', 'Kegiatan'];

function buildFormData(payload) {
  const fd = new FormData();
  fd.append('judul_artikel', payload.judul_artikel);
  fd.append('kategori_artikel', payload.kategori_artikel);
  fd.append('isi_artikel', payload.isi_artikel);
  // Only append the image if a new file was actually selected.
  // On update, omitting it keeps the existing image on the backend.
  if (payload.gambar_artikel instanceof File) {
    fd.append('gambar_artikel', payload.gambar_artikel);
  }
  return fd;
}

async function parseJsonResponse(response) {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body?.message ?? 'Terjadi kesalahan pada server';
    throw new Error(message);
  }
  return body;
}

function extractData(body) {
  if (body && typeof body === 'object' && body.data !== undefined) {
    return body.data;
  }
  return body;
}

export async function getAllArtikel(kategori) {
  const query = kategori ? `?kategori_artikel=${encodeURIComponent(kategori)}` : '';
  const res = await fetch(`${URL}/artikel${query}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const json = await parseJsonResponse(res);
  const data = extractData(json);
  return Array.isArray(data) ? data : data || [];
}

export async function getArtikelById(id) {
  const res = await fetch(`${URL}/artikel/${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const json = await parseJsonResponse(res);
  return extractData(json);
}

export async function createArtikel(payload) {
  const formData = buildFormData(payload);
  const res = await fetch(`${URL}/artikel`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });
  const json = await parseJsonResponse(res);
  return extractData(json);
}

export async function updateArtikel(id, payload) {
  const formData = buildFormData(payload);
  formData.append('_method', 'PUT');
  const res = await fetch(`${URL}/artikel/${encodeURIComponent(id)}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });
  const json = await parseJsonResponse(res);
  return extractData(json);
}

export async function deleteArtikel(id) {
  const res = await fetch(`${URL}/artikel/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
  });
  await parseJsonResponse(res);
  return true;
}
