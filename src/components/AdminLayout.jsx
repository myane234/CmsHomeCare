import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import { getSession, logout } from '../utils/auth';

export default function AdminLayout() {
  const navigate = useNavigate();
  const session = getSession();
  const [open, setOpen] = useState(false); // user dropdown
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar
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
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between bg-accent px-4 sm:px-7 border-b border-slate-200">
          <button
            className="rounded-lg p-2 text-xl md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu"
          >
            ☰
          </button>
          <div className="hidden md:block" />

          <div className="relative" ref={menuRef}>
            <button
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/50"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="hidden text-[13px] font-semibold sm:inline">
                Hi, {session?.name?.split(' ')[0] || 'Admin'}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-base sm:h-[34px] sm:w-[34px]">
                👤
              </div>
            </button>

            {open && (
              <div className="absolute right-0 top-[calc(100%+10px)] w-64 rounded-card border border-slate-200 bg-accent p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-xl">
                    👤
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold">
                      {session?.name || 'Admin'}
                    </div>
                    <div className="truncate text-xs text-slate-500">{session?.email}</div>
                  </div>
                </div>
                <div className="my-3.5 h-px bg-black/10" />
                <button
                  className="flex w-full items-center gap-2.5 rounded-lg bg-white px-3.5 py-2.5 text-left text-[13px] font-semibold hover:bg-danger-bg hover:text-danger"
                  onClick={handleLogout}
                >
                  <span>🚪</span> Keluar
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
