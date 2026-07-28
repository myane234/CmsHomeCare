import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import { FaStethoscope, FaGift, FaRegFileAlt, FaChartBar, FaUserShield, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { isSuperAdmin } from '../utils/role';

const menuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <FaChartBar /> },
  { to: '/layanan', label: 'Layanan', icon: <FaStethoscope /> },
  { to: '/promo', label: 'Promo', icon: <FaGift /> },
  { to: '/artikel', label: 'Artikel', icon: <FaRegFileAlt /> },
];

// Menu khusus Super Admin
const superAdminMenus = [
  { to: '/kelola-admin', label: 'Kelola Admin', icon: '🔧' },
];

export default function Sidebar({ open, onClose, collapsed = false, onToggleCollapse }) {
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
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white transition-all duration-200 md:static md:translate-x-0 ' +
          (open ? 'translate-x-0' : '-translate-x-full') +
          ' ' +
          (collapsed ? 'w-20' : 'w-64')
        }
      >
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} border-b border-slate-200 bg-accent px-3 py-4`}>
          <img src={logo} alt="Smartcare" className={collapsed ? 'h-8 w-8 object-contain' : 'h-10 w-auto object-contain'} />
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 md:inline-flex"
            aria-label={collapsed ? 'Perbesar sidebar' : 'Perkecil sidebar'}
          >
            {collapsed ? <FaAngleRight /> : <FaAngleLeft />}
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {menus.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                'flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ' +
                (collapsed ? 'justify-center px-2.5' : '') +
                ' ' +
                (isActive
                  ? 'bg-primary-light font-bold text-primary-dark'
                  : 'text-slate-500 hover:bg-primary-light hover:text-primary-dark')
              }
            >
              <span className="w-5 text-center text-base">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-slate-200 p-4">
          <a
            href="/super-admin/login"
            title={collapsed ? 'Login Super Admin' : undefined}
            className={`flex w-full items-center rounded-lg bg-primary-light px-4 py-2.5 text-sm font-bold text-primary-dark transition-colors hover:bg-primary hover:text-white ${collapsed ? 'justify-center' : 'justify-center gap-2'}`}
          >
            <FaUserShield />
            {!collapsed && <span>Login Super Admin</span>}
          </a>
        </div>
      </aside>
    </>
  );
}