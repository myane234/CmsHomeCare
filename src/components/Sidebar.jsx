import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';

const menuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/layanan', label: 'Layanan', icon: '🩺' },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-white border-r border-slate-200 transition-transform duration-200 md:static md:translate-x-0 ' +
          (open ? 'translate-x-0' : '-translate-x-full')
        }
      >
        <div className="flex flex-col items-start gap-1 bg-accent px-5 py-5 border-b border-slate-200">
          <img src={logo} alt="Smartcare" className="h-10 w-auto object-contain" />
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            CMS Admin
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                'flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ' +
                (isActive
                  ? 'bg-primary-light font-bold text-primary-dark'
                  : 'text-slate-500 hover:bg-primary-light hover:text-primary-dark')
              }
            >
              <span className="w-5 text-center text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
