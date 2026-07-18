import { URL } from '../utils/getUrl.js'

function resolveImageUrl(value) {
  if (!value || typeof value !== 'string') return ''

  const trimmed = value.trim()
  if (!trimmed) return ''

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:image/')) {
    return trimmed
  }

  const apiBase = URL === '/api' ? (import.meta.env.VITE_URLDEV || 'http://localhost:8000/api') : URL
  const baseUrl = apiBase.replace(/\/api\/?$/, '')
  const fallbackOrigin = typeof window !== 'undefined' ? window.location.origin : ''
  const origin = baseUrl || fallbackOrigin
  const normalizedPath = trimmed.replace(/^\/+/, '')

  return origin ? `${origin}/${normalizedPath}` : normalizedPath
}

function mapApiItem(item) {
  return {
    id: item.id_layanan ?? item.id,
    nama: item.nama_layanan ?? item.nama ?? '',
    kategori: item.kategori_layanan ?? item.kategori ?? '',
    harga: Number(item.harga ?? 0),
    durasi: item.durasi_menit ?? item.durasi ?? 0,
    status: item.status ?? 'aktif',
    deskripsi: item.deskripsi_layanan ?? '',
    gambar: resolveImageUrl(item.foto_layanan ?? item.gambar ?? ''),
  }
}

function toFormData(item) {
  const fd = new FormData();
  fd.append('nama_layanan', item.nama ?? '');
  fd.append('kategori_layanan', item.kategori ?? '');
  fd.append('harga', item.harga ?? 0);
  fd.append('durasi_menit', item.durasi ?? 0);
  fd.append('status', item.status ?? 'aktif');
  fd.append('deskripsi_layanan', item.deskripsi ?? '');
  if (item.gambar instanceof File) {
    fd.append('foto_layanan', item.gambar);
  }
  return fd;
}

async function parseJsonResponse(response) {
  const body = await response.json().catch(() => null)
  if (!response.ok) {
    const message = body?.message ?? 'Terjadi kesalahan pada server'
    throw new Error(message)
  }
  return body
}

export async function getAllLayanan() {
  const res = await fetch(`${URL}/layanan/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const json = await parseJsonResponse(res)
  if (!json.success || !Array.isArray(json.data)) {
    throw new Error(json.message || 'Gagal mengambil data layanan')
  }

  return json.data.map(mapApiItem)
}

export async function getKategoriLayanan() {
  const res = await fetch(`${URL}/layanan?ambil_kategori=true`, {
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json'
    }
  })

  const body = await parseJsonResponse(res);

  const data = body.data;

  return data;
}

export async function getLayananById(id) {
  const res = await fetch(`${URL}/layanan/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const body = await parseJsonResponse(res)
  if (!body) {
    throw new Error('Layanan tidak ditemukan')
  }

  const data = body.data || body
  return mapApiItem(data)
}

export async function createLayanan(payload) {
  const res = await fetch(`${URL}/layanan/`, {
    method: 'POST',
    body: toFormData(payload),
    // Tidak set Content-Type agar browser auto-set multipart boundary
  })

  const body = await parseJsonResponse(res)
  const data = body.data || body
  return mapApiItem(data)
}

export async function updateLayanan(id, payload) {
  const fd = toFormData(payload);
  fd.append('_method', 'PUT'); // Laravel method spoofing untuk multipart
  const res = await fetch(`${URL}/layanan/${id}`, {
    method: 'POST',
    body: fd,
    // Tidak set Content-Type agar browser auto-set multipart boundary
  })

  const body = await parseJsonResponse(res)
  const data = body.data || body
  return mapApiItem(data)
}

export async function deleteLayanan(id) {
  const res = await fetch(`${URL}/layanan/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  await parseJsonResponse(res)
  return true
}
