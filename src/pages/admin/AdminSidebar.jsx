import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { FaChartBar, FaUserMd, FaUserPlus, FaAngleLeft, FaAngleRight, FaChevronDown } from 'react-icons/fa';

const menuItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <FaChartBar /> },
  {
    label: 'Master Data',
    icon: <FaUserMd />,
    children: [
      { to: '/admin/nakes', label: 'Master Data Nakes', icon: <FaUserMd /> },
      { to: '/admin/nakes/requests', label: 'Request Nakes', icon: <FaUserPlus /> },
    ],
  },
  { to: '/admin/booking', label: 'Manajemen Booking', icon: <FaChartBar /> },
];

export default function AdminSidebar({ open, onClose, collapsed = false, onToggleCollapse }) {
  const [masterDataOpen, setMasterDataOpen] = useState(true);

  const renderNavItem = (item, isSubItem = false) => (
    <NavLink
      key={item.to}
      to={item.to}
      end={item.to === '/admin/nakes'}
      onClick={onClose}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${collapsed ? 'justify-center px-2.5' : ''} ${
          isActive
            ? 'bg-primary-light font-bold text-primary-dark'
            : 'text-slate-500 hover:bg-primary-light hover:text-primary-dark'
        } ${isSubItem ? 'ml-2' : ''}`
      }
    >
      <span className="w-5 text-center text-base">{item.icon}</span>
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  );

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
          'fixed inset-y-0 left-0 z-40 flex h-full flex-shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-200 md:sticky md:top-0 md:h-screen ' +
          (open ? 'translate-x-0' : '-translate-x-full md:translate-x-0') +
          ' ' +
          (collapsed ? 'w-20' : 'w-64')
        }
      >
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} border-b border-slate-200 bg-white px-3 py-4`}>
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

        <nav className="flex flex-col gap-1 p-3">
          {menuItems.map((item) => {
            if (item.children) {
              return (
                <div key={item.label} className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => setMasterDataOpen((prev) => !prev)}
                    className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-left text-sm font-medium text-slate-500 transition-colors hover:bg-primary-light hover:text-primary-dark"
                  >
                    <span className="w-5 text-center text-base">{item.icon}</span>
                    {!collapsed && <span className="flex-1">{item.label}</span>}
                    {!collapsed && (
                      <FaChevronDown className={`text-xs transition-transform ${masterDataOpen ? 'rotate-180' : ''}`} />
                    )}
                  </button>

                  {(masterDataOpen || collapsed) && (
                    <div className={`flex flex-col gap-1 ${collapsed ? 'mt-1' : 'ml-2 mt-1 border-l border-slate-200 pl-2'}`}>
                      {item.children.map((child) => renderNavItem(child, true))}
                    </div>
                  )}
                </div>
              );
            }

            return renderNavItem(item);
          })}
        </nav>
      </aside>
    </>
  );
}