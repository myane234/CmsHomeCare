import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import AdminSidebar from '../pages/admin/AdminSidebar';
import { getSession, logout } from '../utils/auth';
import { isSuperAdmin } from '../utils/role';

const SIDEBAR_STORAGE_KEY = 'sidebar-width';
const SIDEBAR_MIN_WIDTH = 220;
const SIDEBAR_MAX_WIDTH = 420;
const SIDEBAR_DEFAULT_WIDTH = 280;

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = getSession();
  const [open, setOpen] = useState(false); // user dropdown
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    try {
      const savedWidth = parseInt(localStorage.getItem(SIDEBAR_STORAGE_KEY), 10);
      if (savedWidth && !Number.isNaN(savedWidth)) {
        return Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, savedWidth));
      }
    } catch {
      // ignore localStorage errors in environments where it's unavailable
    }
    return SIDEBAR_DEFAULT_WIDTH;
  });
  const [isResizing, setIsResizing] = useState(false);
  const menuRef = useRef(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(sidebarWidth);
  const useAdminSidebar = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (!isResizing) return undefined;

    function handleMouseMove(event) {
      const delta = event.clientX - startXRef.current;
      const nextWidth = Math.min(
        SIDEBAR_MAX_WIDTH,
        Math.max(SIDEBAR_MIN_WIDTH, startWidthRef.current + delta)
      );
      setSidebarWidth(nextWidth);
    }

    function handleMouseUp() {
      setIsResizing(false);
    }

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  function handleResizeMouseDown(event) {
    startXRef.current = event.clientX;
    startWidthRef.current = sidebarWidth;
    setIsResizing(true);
  }

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar Kiri */}
      {useAdminSidebar ? (
        <AdminSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          width={sidebarWidth}
        />
      ) : (
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          width={sidebarWidth}
        />
      )}

      <div
        className="hidden md:block cursor-col-resize bg-slate-100 hover:bg-slate-200"
        style={{ width: '6px' }}
        onMouseDown={handleResizeMouseDown}
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sidebar"
      />

      {/* Area Kanan (Header + Konten Utama) */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Diubah dari bg-accent menjadi bg-white */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between bg-white px-4 sm:px-7">
          <div className="flex items-center gap-2">
            <button
              className="rounded-lg p-2 text-xl md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka menu"
            >
              ☰
            </button>
            {/* <button
              className="hidden rounded-lg p-2 text-lg text-slate-600 transition-colors hover:bg-slate-100 md:inline-flex"
              onClick={() => setSidebarCollapsed((value) => !value)}
              aria-label={sidebarCollapsed ? 'Perbesar sidebar' : 'Perkecil sidebar'}
            >
              {sidebarCollapsed ? '⟶' : '⟵'}
            </button> */}
          </div>
          <div className="hidden md:block" />

          <div className="relative" ref={menuRef}>
            <button
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100"
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
              <div className="absolute right-0 top-[calc(100%+10px)] w-64 rounded-card border border-slate-200 bg-white p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xl">
                    👤
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold">
                      {session?.name || 'Admin'}
                    </div>
                    <div className="flex items-center gap-1.5">
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
                  className="flex w-full items-center gap-2.5 rounded-lg bg-slate-50 px-3.5 py-2.5 text-left text-[13px] font-semibold hover:bg-danger-bg hover:text-danger"
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