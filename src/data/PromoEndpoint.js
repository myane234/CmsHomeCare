// Promo API client
// Uses the endpoint URLs listed in the project docs.
// Notes:
// - These functions use window.fetch.
// - Adjust API base/headers if your backend requires auth.

const API_BASE = 'https://citra.faaruq.com';

function buildHeaders() {
  return {
    'Content-Type': 'application/json',
  };
}

function handleResponse(res) {
  if (!res.ok) {
    return res.text().then((t) => {
      const msg = t || `Request failed with status ${res.status}`;
      throw new Error(msg);
    });
  }
  // Some APIs return empty body for DELETE
  return res.text().then((t) => {
    if (!t) return null;
    try {
      return JSON.parse(t);
    } catch {
      return t;
    }
  });
}

function normalizePromo(raw) {
  // Expected fields from task:
  // - kode_promo
  // - potongan_harga (%persen)
  // - tanggal_berakhir (YY:M:D or string)
  // - status_promo ('Tidak Aktif'/'Aktif')
  // Plus id_promo if backend includes it.
  // This function is defensive and returns raw as-is if unknown.
  return raw;
}

export async function getAllPromo() {
  const res = await fetch(`${API_BASE}/api/promo`, {
    method: 'GET',
    headers: buildHeaders(),
  });
  const data = await handleResponse(res);
  if (Array.isArray(data)) return data.map(normalizePromo);
  // if API wraps results
  if (data && Array.isArray(data.data)) return data.data.map(normalizePromo);
  return data ? [normalizePromo(data)] : [];
}

export async function createPromo(payload) {
  const res = await fetch(`${API_BASE}/api/promo`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await handleResponse(res);
  return normalizePromo(data);
}

export async function getPromoById(id_promo) {
  const res = await fetch(`${API_BASE}/api/promo/${encodeURIComponent(id_promo)}`, {
    method: 'GET',
    headers: buildHeaders(),
  });
  const data = await handleResponse(res);
  return normalizePromo(data);
}

export async function updatePromo(id_promo, payload) {
  const res = await fetch(`${API_BASE}/api/promo/${encodeURIComponent(id_promo)}`, {
    method: 'PUT',
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await handleResponse(res);
  return normalizePromo(data);
}

export async function deletePromo(id_promo) {
  const res = await fetch(`${API_BASE}/api/promo/${encodeURIComponent(id_promo)}`, {
    method: 'DELETE',
    headers: buildHeaders(),
  });
  await handleResponse(res);
  return true;
}

