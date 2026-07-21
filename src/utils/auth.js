import { URL } from './getUrl.js';

const AUTH_KEY = 'cmsHomeCare_auth';

export async function login(email, password) {
  try {
    const res = await fetch(`${URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const body = await res.json();

    if (res.ok && body.success) {
      const session = {
        token: body.data.token,
        email,
        name: body.data.nama || 'Admin',
        roles: body.data.roles,
        loggedInAt: new Date().toISOString(),
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      return { success: true };
    }
    
    return { success: false, message: body.message || 'Email atau password salah' };
  } catch {
    return { success: false, message: 'Gagal menghubungi server' };
  }
}

export async function logout() {
  const session = getSession();
  if (session?.token) {
    try {
      await fetch(`${URL}/admin/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`
        },
      });
    } catch {
      // Ignore error on logout
    }
  }
  localStorage.removeItem(AUTH_KEY);
}

export function getSession() {
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated() {
  return !!getSession();
}

export function getAuthHeaders(additionalHeaders = {}) {
  const session = getSession();
  const headers = { ...additionalHeaders };
  if (session?.token) {
    headers['Authorization'] = `Bearer ${session.token}`;
  }
  return headers;
}
