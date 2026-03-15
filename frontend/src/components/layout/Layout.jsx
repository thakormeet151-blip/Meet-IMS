import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Package, ArrowDownToLine, ArrowUpFromLine,
  ArrowLeftRight, ClipboardList, Settings, LogOut, Menu, X,
  Bell, ChevronDown, Warehouse
} from 'lucide-react';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/receipts', icon: ArrowDownToLine, label: 'Receipts' },
  { to: '/deliveries', icon: ArrowUpFromLine, label: 'Deliveries' },
  { to: '/transfers', icon: ArrowLeftRight, label: 'Transfers' },
  { to: '/adjustments', icon: ClipboardList, label: 'Adjustments' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-dark-900 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-dark-800 border-r border-dark-600 flex flex-col shrink-0`}>
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-dark-600 h-16">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shrink-0">
            <Warehouse size={16} className="text-white" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="font-bold text-white text-sm leading-tight">CoreInventory</p>
              <p className="text-brand-500 text-xs font-medium">Management System</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} className="shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        {sidebarOpen && (
          <div className="p-3 border-t border-dark-600">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-dark-700">
              <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center shrink-0">
                <span className="text-brand-400 font-bold text-xs">{user?.name?.[0]?.toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-200 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
              <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors">
                <LogOut size={15} />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-dark-800 border-b border-dark-600 flex items-center justify-between px-6 shrink-0">
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="text-slate-400 hover:text-brand-400 transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-4">
            <button className="relative text-slate-400 hover:text-brand-400 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">3</span>
            </button>
            <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setUserMenuOpen(o => !o)}>
              <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center">
                <span className="text-brand-400 font-bold text-xs">{user?.name?.[0]?.toUpperCase()}</span>
              </div>
              <span className="text-sm font-medium text-slate-300 hidden md:block">{user?.name}</span>
              <ChevronDown size={14} className="text-slate-500" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
