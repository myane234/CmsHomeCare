import { URL } from '../utils/getUrl.js'

function mapApiItem(item) {
  return {
    id: item.id_layanan ?? item.id,
    nama: item.nama_layanan ?? item.nama ?? '',
    kategori: item.kategori_layanan ?? item.kategori ?? '',
    harga: Number(item.harga ?? 0),
    durasi: item.durasi_menit ?? item.durasi ?? 0,
    status: item.status ?? 'aktif',
    deskripsi: item.deskripsi_layanan ?? '',
    gambar: item.foto_layanan ?? '',
  }
}

function toBackendPayload(item) {
  return {
    nama_layanan: item.nama,
    kategori_layanan: item.kategori,
    harga: item.harga,
    durasi_menit: item.durasi,
    status: item.status,
    deskripsi: item.deskripsi_layanan,
    gambar: item.foto_layanan,
  }
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
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(toBackendPayload(payload)),
  })

  const body = await parseJsonResponse(res)
  const data = body.data || body
  return mapApiItem(data)
}

export async function updateLayanan(id, payload) {
  const res = await fetch(`${URL}/layanan/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(toBackendPayload(payload)),
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
