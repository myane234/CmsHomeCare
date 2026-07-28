import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { FaChartBar, FaUserMd, FaUserPlus, FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const menuItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <FaChartBar /> },
  { to: '/admin/nakes', label: 'Master Data Nakes', icon: <FaUserMd /> },
  { to: '/admin/nakes/requests', label: 'Request Nakes', icon: <FaUserPlus /> },
  { to: '/admin/booking', label: 'Manajemen Booking', icon: <FaChartBar /> },
];

export default function AdminSidebar({ 
  open, 
  onClose, 
  width = 260, 
  collapsed = false, 
  onToggleCollapse 
}) {
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
          'fixed inset-y-0 left-0 z-40 flex flex-shrink-0 flex-col bg-white border-r border-slate-200 transition-all duration-300 md:sticky md:top-0 h-screen ' +
          (open ? 'translate-x-0' : '-translate-x-full md:translate-x-0')
        }
        style={{ width: collapsed ? '80px' : `${width}px` }}
      >
        {/* Header Logo dengan bg-accent */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} border-b border-slate-200 bg-accent px-3 py-4`}>
          <img
            src={logo}
            alt="Smartcare"
            className={collapsed ? 'h-8 w-8 object-contain' : 'h-10 w-auto object-contain'}
          />
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 md:inline-flex"
            aria-label={collapsed ? 'Perbesar sidebar' : 'Perkecil sidebar'}
          >
            {collapsed ? <FaAngleRight /> : <FaAngleLeft />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col gap-1 p-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin/nakes'}
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
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}