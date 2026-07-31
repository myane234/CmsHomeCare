import { URL } from '../utils/getUrl.js';
import { getAuthHeaders } from '../utils/auth.js';

async function parseJsonResponse(response) {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body?.message ?? `Error ${response.status}: Terjadi kesalahan pada server`;
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

export async function getAllProvinsi() {
  const res = await fetch(`${URL}/wilayah-layanan`, {
    method: 'GET',
    headers: getAuthHeaders({
      'Accept': 'application/json',
    }),
  });

  const json = await parseJsonResponse(res);
  const data = extractData(json);
  return Array.isArray(data) ? data : (data ? [data] : []);
}

export async function createProvinsi(data) {
  const res = await fetch(`${URL}/wilayah-layanan`, {
    method: 'POST',
    headers: getAuthHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }),
    body: JSON.stringify(data),
  });

  const json = await parseJsonResponse(res);
  return extractData(json);
}

export async function updateProvinsi(idProvinsi, data) {
  const res = await fetch(`${URL}/wilayah-layanan/${encodeURIComponent(idProvinsi)}`, {
    method: 'PUT',
    headers: getAuthHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }),
    body: JSON.stringify(data),
  });

  const json = await parseJsonResponse(res);
  return extractData(json);
}

export async function deleteProvinsi(idProvinsi) {
  const res = await fetch(`${URL}/wilayah-layanan/${encodeURIComponent(idProvinsi)}`, {
    method: 'DELETE',
    headers: getAuthHeaders({
      'Accept': 'application/json',
    }),
  });

  return await parseJsonResponse(res);
}

export async function toggleStatusProvinsi(idProvinsi) {
  const res = await fetch(`${URL}/wilayah-layanan/${encodeURIComponent(idProvinsi)}/toggle-status`, {
    method: 'PATCH',
    headers: getAuthHeaders({
      'Accept': 'application/json',
    }),
  });

  const json = await parseJsonResponse(res);
  return extractData(json);
}

