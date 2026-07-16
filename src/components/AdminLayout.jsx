import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import { getSession, logout } from '../utils/auth';
import './AdminLayout.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const session = getSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <header className="admin-topbar">
          <div />
          <div className="admin-topbar-user" ref={menuRef}>
            <button className="admin-user-trigger" onClick={() => setOpen((o) => !o)}>
              <span className="admin-user-name">Hi, {session?.name?.split(' ')[0] || 'Admin'}</span>
              <div className="admin-avatar">👤</div>
            </button>

            {open && (
              <div className="admin-dropdown">
                <div className="admin-dropdown-header">
                  <div className="admin-avatar admin-avatar-lg">👤</div>
                  <div>
                    <div className="admin-dropdown-name">{session?.name || 'Admin'}</div>
                    <div className="admin-dropdown-email">{session?.email}</div>
                  </div>
                </div>
                <div className="admin-dropdown-divider" />
                <div className="admin-dropdown-menu">
                  <button className="admin-dropdown-item" onClick={handleLogout}>
                    <span>🚪</span> Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
