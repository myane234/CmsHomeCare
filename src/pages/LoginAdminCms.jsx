import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/auth';
import logo from '../assets/logo.png';
import './LoginAdminCms.css';

export default function LoginAdminCms() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Email dan password wajib diisi');
      return;
    }

    setLoading(true);
    // simulate a short request delay for UX
    setTimeout(() => {
      const result = login(form.email, form.password);
      setLoading(false);
      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.message);
      }
    }, 400);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src={logo} alt="Smartcare" className="login-logo-img" />
        </div>
        <p className="login-subtitle">Masuk ke panel admin CMS HomeCare</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            placeholder="admin@smarthomecare.com"
            value={form.email}
            onChange={handleChange}
            className="form-input"
            autoComplete="username"
          />

          <label className="form-label">Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="form-input"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((s) => !s)}
              tabIndex={-1}
            >
              {showPassword ? 'Sembunyikan' : 'Lihat'}
            </button>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="login-hint">
          Demo: admin@smarthomecare.com / admin123
        </p>
      </div>
    </div>
  );
}
