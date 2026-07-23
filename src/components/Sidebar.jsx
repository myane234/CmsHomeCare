import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import { FaStethoscope, FaGift, FaRegFileAlt, FaChartBar } from 'react-icons/fa';
import { FaStethoscope, FaGift, FaRegFileAlt, FaChartBar, FaUserShield } from 'react-icons/fa';

const menuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <FaChartBar /> },
  { to: '/admin/dashboard', label: 'Admin Dashboard', icon: <FaUserShield /> }, // MENU BARU
  { to: '/layanan', label: 'Layanan', icon: <FaStethoscope /> },
  { to: '/promo', label: 'Promo', icon: <FaGift /> },
  { to: '/artikel', label: 'Artikel', icon: <FaRegFileAlt /> },
];

// Menu khusus Super Admin
const superAdminMenus = [
  { to: '/kelola-admin', label: 'Kelola Admin', icon: '🔧' },
];

export default function Sidebar({ open, onClose }) {
  // Gabungkan menu berdasarkan role
  const menus = isSuperAdmin() ? [...menuItems, ...superAdminMenus] : menuItems;

  return (
    <>
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
          {menus.map((item) => (
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