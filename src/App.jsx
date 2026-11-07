import React, { useState, useEffect, useCallback } from 'react';
import { adminApi, getAdminToken, removeAdminToken } from './api/adminApi';
import LoginPage from './components/LoginPage.jsx';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Dashboard from './components/Dashboard.jsx';
import ProductList from './components/ProductList.jsx';
import OrderList from './components/OrderList.jsx';
import UserList from './components/UserList.jsx';
import { CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';

export default function App() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Global State for e-commerce entities
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  // Navigation & UI State
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'products', 'orders', 'users'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Toast Notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Fetch all live data from backend
  const refreshAllData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [prodRes, ordRes, usrRes, statsRes] = await Promise.allSettled([
        adminApi.getProducts(),
        adminApi.getOrders(),
        adminApi.getUsers(),
        adminApi.getStats(),
      ]);

      if (prodRes.status === 'fulfilled' && prodRes.value.products) {
        setProducts(prodRes.value.products);
      }
      if (ordRes.status === 'fulfilled' && ordRes.value.orders) {
        setOrders(ordRes.value.orders);
      }
      if (usrRes.status === 'fulfilled' && usrRes.value.users) {
        setUsers(usrRes.value.users);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value.stats) {
        setStats(statsRes.value.stats);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      showToast('Failed to load some dashboard data', 'error');
    } finally {
      setLoadingData(false);
    }
  }, []);

  // Initial Auth Check
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAdminToken();
      if (!token) {
        setAuthChecking(false);
        return;
      }
      try {
        const res = await adminApi.getMe();
        if (res.success && res.user && res.user.role === 'admin') {
          setCurrentUser({
            id: res.user.id || res.user._id,
            name: res.user.name,
            email: res.user.email,
            role: 'Admin',
            avatar:
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
          });
        } else {
          removeAdminToken();
          setCurrentUser(null);
        }
      } catch {
        removeAdminToken();
        setCurrentUser(null);
      } finally {
        setAuthChecking(false);
      }
    };

    checkAuth();
  }, []);

  // When logged in, fetch data
  useEffect(() => {
    if (currentUser) {
      refreshAllData();
    }
  }, [currentUser, refreshAllData]);

  // Auth Handlers
  const handleLogin = (userCredentials) => {
    setCurrentUser(userCredentials);
    setActiveTab('dashboard');
    showToast(`Welcome back, ${userCredentials.name}!`);
  };

  const handleLogout = () => {
    removeAdminToken();
    setCurrentUser(null);
    setMobileDrawerOpen(false);
    showToast('Signed out successfully', 'info');
  };

  // Product Handlers (Real Backend API calls)
  const handleAddProduct = async (productPayload) => {
    try {
      const res = await adminApi.createProduct(productPayload);
      if (res.success && res.product) {
        setProducts((prev) => [res.product, ...prev]);
        showToast(`Added "${res.product.name}" to catalog!`);
        refreshAllData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to create product', 'error');
    }
  };

  const handleEditProduct = async (productPayload, id) => {
    try {
      const res = await adminApi.updateProduct(id, productPayload);
      if (res.success && res.product) {
        setProducts((prev) =>
          prev.map((p) => ((p._id || p.id) === id ? res.product : p))
        );
        showToast(`Updated "${res.product.name}"`);
        refreshAllData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update product', 'error');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await adminApi.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== productId));
      showToast('Product successfully removed from catalog', 'info');
      refreshAllData();
    } catch (err) {
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  // Order Handlers (Real Backend Status Update)
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await adminApi.updateOrderStatus(orderId, newStatus);
      if (res.success && res.order) {
        setOrders((prev) =>
          prev.map((o) => ((o._id || o.id) === orderId ? res.order : o))
        );
        showToast(`Order status updated to "${newStatus}"!`);
        refreshAllData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update order status', 'error');
    }
  };

  // User Handlers
  const handleEditUser = async (userData, id) => {
    try {
      const res = await adminApi.updateUser(id, userData);
      if (res.success && res.user) {
        setUsers((prev) =>
          prev.map((u) => ((u._id || u.id) === id ? { ...u, ...res.user } : u))
        );
        showToast(`Updated user permissions for "${res.user.name}"`);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update user', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await adminApi.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => (u._id || u.id) !== userId));
      showToast('User account successfully deleted', 'info');
      refreshAllData();
    } catch (err) {
      showToast(err.message || 'Failed to delete user', 'error');
    }
  };

  // If checking authentication
  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
        <p className="text-sm text-slate-400 font-medium">Loading Shop.Co Admin Portal...</p>
      </div>
    );
  }

  // Not authenticated: Show Login
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-800 antialiased selection:bg-black selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSearchQuery('');
        }}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileDrawerOpen}
        setMobileOpen={setMobileDrawerOpen}
        currentUser={currentUser}
        onLogout={handleLogout}
        counts={{
          products: products.length,
          orders: orders.length,
          users: users.length,
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <Header
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenMobileSidebar={() => setMobileDrawerOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTabTitle={
            activeTab === 'dashboard'
              ? 'Dashboard Overview'
              : activeTab === 'products'
              ? 'Product Catalog'
              : activeTab === 'orders'
              ? 'Orders Management'
              : 'User Directory'
          }
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              products={products}
              orders={orders}
              users={users}
              monthlyRevenueData={stats?.monthlyData || []}
              categoryBreakdownData={stats?.categoryBreakdown || []}
              currentUser={currentUser}
              onNavigateTab={setActiveTab}
              onViewOrderDetails={() => setActiveTab('orders')}
            />
          )}

          {activeTab === 'products' && (
            <ProductList
              products={products}
              currentUser={currentUser}
              onAddProduct={handleAddProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              loading={loadingData}
            />
          )}

          {activeTab === 'orders' && (
            <OrderList
              orders={orders}
              currentUser={currentUser}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {activeTab === 'users' && (
            <UserList
              users={users}
              currentUser={currentUser}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}
        </main>
      </div>

      {/* Toast Feedback Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="text-xs font-medium">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white transition-colors ml-2 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
