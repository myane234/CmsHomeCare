// Real API calls to the live Laravel backend for Artikel CMS.
// Docs: https://citra.faaruq.com/docs
// Endpoints: GET/POST /api/artikel, GET/PUT/DELETE /api/artikel/{id}

import { apiGet, apiPostForm, apiPutForm, apiDelete } from '../utils/apiClient';

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

export async function getAllArtikel(kategori) {
  const query = kategori ? `?kategori_artikel=${encodeURIComponent(kategori)}` : '';
  const res = await apiGet(`/api/artikel${query}`);
  return res?.data || [];
}

export async function getArtikelById(id) {
  const res = await apiGet(`/api/artikel/${id}`);
  return res?.data || res;
}

export async function createArtikel(payload) {
  const formData = buildFormData(payload);
  return apiPostForm('/api/artikel', formData);
}

export async function updateArtikel(id, payload) {
  const formData = buildFormData(payload);
  return apiPutForm(`/api/artikel/${id}`, formData);
}

export async function deleteArtikel(id) {
  return apiDelete(`/api/artikel/${id}`);
}
