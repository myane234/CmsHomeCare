// Simple mock auth for the admin CMS.
// In production, replace this with a real API call to your backend.

const AUTH_KEY = 'cmsHomeCare_auth';

// Hardcoded demo admin credentials
const ADMIN_EMAIL = 'admin@smarthomecare.com';
const ADMIN_PASSWORD = 'admin123';

export function login(email, password) {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const session = {
      email,
      name: 'Admin SmartHomeCare',
      loggedInAt: new Date().toISOString(),
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    return { success: true };
  }
  return { success: false, message: 'Email atau password salah' };
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

export function getSession() {
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated() {
  return !!getSession();
}
