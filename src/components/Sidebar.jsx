import React from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Eye,
  Store,
  X
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  currentUser,
  onLogout,
  counts = { products: 0, orders: 0, users: 0 }
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      badge: counts.products
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingCart,
      badge: counts.orders
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      badge: counts.users
    }
  ];

  const handleSelectTab = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  const isAdmin = currentUser?.role === 'Admin';

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
            <Store className="w-5 h-5 text-white" />
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="leading-tight truncate">
              <span className="font-bold text-white tracking-tight text-base block font-integral">SHOP.CO</span>
              <span className="text-[11px] text-slate-400 block font-medium">Admin Dashboard</span>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        {mobileOpen ? (
          <button
            type="button"
            id="btn-close-mobile-sidebar"
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          /* Desktop collapse toggle */
          <button
            type="button"
            id="btn-toggle-desktop-sidebar"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Role Access Banner */}
      {(!collapsed || mobileOpen) && (
        <div className="mx-3 mt-3 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              isAdmin ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}
          >
            {isAdmin ? <Shield className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-white truncate">
                {isAdmin ? 'Admin Mode' : 'User Mode'}
              </p>
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                  isAdmin ? 'bg-blue-900/60 text-blue-300' : 'bg-emerald-900/60 text-emerald-300'
                }`}
              >
                {isAdmin ? 'Full' : 'Read-Only'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {isAdmin ? 'Manage all modules' : 'View only permissions'}
            </p>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              id={`nav-item-${item.id}`}
              onClick={() => handleSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              } ${collapsed && !mobileOpen ? 'justify-center px-0' : ''}`}
              title={collapsed && !mobileOpen ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {(!collapsed || mobileOpen) && (
                <>
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {item.badge !== null && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        isActive
                          ? 'bg-blue-500/50 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom User info & Logout */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        {(!collapsed || mobileOpen) ? (
          <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-700"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
              </div>
            </div>
            <button
              type="button"
              id="btn-sidebar-logout"
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            id="btn-sidebar-logout-collapsed"
            onClick={onLogout}
            className="w-full py-2.5 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:block shrink-0 transition-all duration-300 ease-in-out h-screen sticky top-0 ${
          collapsed ? 'w-18' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 w-72 z-50 transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
}
