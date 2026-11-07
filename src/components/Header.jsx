import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  LogOut,
  Shield,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Package,
  X
} from 'lucide-react';

export default function Header({
  currentUser,
  onLogout,
  onToggleRole,
  onOpenMobileSidebar,
  searchQuery,
  setSearchQuery,
  activeTabTitle
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const notificationRef = useRef(null);

  const notifications = [
    {
      id: 1,
      title: 'New Order Received',
      desc: 'Order #ORD-9421 from Sophia Montgomery ($484.91)',
      time: '10m ago',
      icon: Package,
      color: 'text-blue-500 bg-blue-50'
    },
    {
      id: 2,
      title: 'Low Stock Alert',
      desc: 'Breathable Running Shoes (only 4 units left)',
      time: '45m ago',
      icon: AlertTriangle,
      color: 'text-amber-500 bg-amber-50'
    },
    {
      id: 3,
      title: 'System Synced',
      desc: 'Inventory catalog reconciled with warehouse database',
      time: '2h ago',
      icon: CheckCircle2,
      color: 'text-emerald-500 bg-emerald-50'
    }
  ];

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAdmin = currentUser?.role === 'Admin';

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left section: Hamburger (mobile) + Active page title & Search */}
      <div className="flex items-center gap-3 md:gap-4 flex-1">
        <button
          type="button"
          id="btn-open-mobile-sidebar"
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <h2 className="text-base font-bold text-slate-800 tracking-tight capitalize">
            {activeTabTitle}
          </h2>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-xs md:max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            id="header-global-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Filter ${activeTabTitle}...`}
            className="w-full pl-9 pr-8 py-1.5 rounded-lg border border-slate-200 bg-slate-50/70 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right section: API Status, User profile, Logout */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Status Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live API Connected</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            id="btn-header-notifications"
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (unreadCount > 0) setUnreadCount(0);
            }}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Notifications
                </span>
                <span className="text-[11px] font-medium text-blue-600 cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div key={n.id} className="p-3 hover:bg-slate-50 flex items-start gap-3 transition-colors">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                        <p className="text-xs text-slate-500 truncate">{n.desc}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-2 bg-slate-50 text-center border-t border-slate-100">
                <span className="text-xs text-slate-500">All alerts up to date</span>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge */}
        <div className="flex items-center gap-2.5 pl-2 sm:border-l border-slate-200">
          <img
            src={currentUser?.avatar || '/ahsan-raza.jpg'}
            alt={currentUser?.name || 'M AHSAN RAZA'}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-slate-200 ring-2 ring-slate-100"
          />
          <div className="hidden sm:block text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-800 block truncate max-w-[120px]">
                {currentUser?.name || 'M AHSAN RAZA'}
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                  isAdmin
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-indigo-100 text-indigo-800'
                }`}
              >
                {isAdmin ? 'Admin' : 'User'}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block truncate max-w-[110px]">
              {isAdmin ? 'Full Permissions' : 'Read Only'}
            </span>
          </div>
        </div>

        {/* Header Logout Button */}
        <button
          type="button"
          id="btn-header-logout"
          onClick={onLogout}
          className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
          title="Log out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
