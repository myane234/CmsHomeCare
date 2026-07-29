import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import AdminSidebar from '../pages/admin/AdminSidebar';
import { getSession, logout } from '../utils/auth';
import { isSuperAdmin } from '../utils/role';

export default function AdminLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const session   = getSession();

  const [open, setOpen]           = useState(false);   // user dropdown
  const [sidebarOpen, setSidebarOpen]   = useState(false);   // mobile sidebar drawer
  const [collapsed, setCollapsed] = useState(false);   // desktop collapse state

  const menuRef = useRef(null);
  const useAdminSidebar = location.pathname.startsWith('/admin');

  // Restore collapsed preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cms_sidebar_collapsed');
    if (saved === 'true') setCollapsed(true);
  }, []);

  function toggleCollapse() {
    setCollapsed((c) => {
      localStorage.setItem('cms_sidebar_collapsed', String(!c));
      return !c;
    });
  }

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

  const sidebarProps = {
    open: sidebarOpen,
    onClose: () => setSidebarOpen(false),
    collapsed,
    onCollapse: toggleCollapse,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar Kiri */}
      {useAdminSidebar ? (
        <AdminSidebar {...sidebarProps} />
      ) : (
        <Sidebar {...sidebarProps} />
      )}

      {/* Area Kanan (Header + Konten Utama) */}
      <div className="flex flex-1 flex-col overflow-y-auto min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 sm:px-6">
          {/* Mobile hamburger */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Spacer for desktop (hamburger is hidden) */}
          <div className="hidden md:block" />

          {/* User dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 hover:bg-slate-100 transition-colors"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="hidden text-[13px] font-semibold text-slate-700 sm:inline">
                Hi, {session?.name?.split(' ')[0] || 'Admin'}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-green-100 border border-primary/20 text-base font-bold text-primary-dark">
                {(session?.name?.[0] || 'A').toUpperCase()}
              </div>
            </button>

            {open && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/60 z-50">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-green-100 border border-primary/20 text-lg font-bold text-primary-dark">
                    {(session?.name?.[0] || 'A').toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-slate-900">
                      {session?.name || 'Admin'}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="truncate text-xs text-slate-500">{session?.email}</span>
                      {isSuperAdmin() && (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                          Super Admin
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="my-3.5 h-px bg-slate-100" />
                <button
                  className="flex w-full items-center gap-2.5 rounded-xl bg-slate-50 px-3.5 py-2.5 text-left text-[13px] font-semibold text-slate-700 hover:bg-danger-bg hover:text-danger transition-colors"
                  onClick={handleLogout}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Keluar
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}