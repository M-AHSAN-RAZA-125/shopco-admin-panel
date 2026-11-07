import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Plus,
  ArrowUpRight,
  Shield,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export default function Dashboard({
  products = [],
  orders = [],
  users = [],
  monthlyRevenueData = [],
  categoryBreakdownData = [],
  currentUser,
  onNavigateTab,
  onOpenCreateOrder,
  onViewOrderDetails
}) {
  const [chartMetric, setChartMetric] = useState('revenue'); // 'revenue' or 'orders'
  const isAdmin = currentUser?.role === 'Admin';

  // Dynamic KPI calculations based on current live orders & products
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, ord) => sum + (Number(ord.total || ord.totalAmount) || 0), 0);
  }, [orders]);

  const totalOrdersCount = useMemo(() => orders.length, [orders]);
  const totalProductsCount = useMemo(() => products.length, [products]);
  const lowStockCount = useMemo(
    () => products.filter((p) => p.stock > 0 && p.stock <= 10).length,
    [products]
  );
  const activeUsersCount = useMemo(
    () => users.length,
    [users]
  );

  // Recent 5 orders
  const recentOrders = useMemo(() => {
    return [...orders].slice(0, 5);
  }, [orders]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getStatusBadge = (status = '') => {
    const s = String(status).toLowerCase();
    switch (s) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-3 h-3" />
            Shipped
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Clock className="w-3 h-3" />
            Processing
          </span>
        );
      case 'placed':
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            Placed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Welcome & Role Context Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-300 border border-blue-400/30 flex items-center gap-1">
                {isAdmin ? <Shield className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {isAdmin ? 'Administrator Access' : 'Standard User Access'}
              </span>
              <span className="text-xs text-slate-400">• Live Production Stream</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Welcome back, {currentUser?.name || 'Administrator'}!
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              {isAdmin
                ? 'You have complete control over catalog inventory, real-time order processing, and user access records.'
                : 'You are currently reviewing store analytics and product listings in secure read-only mode.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {isAdmin ? (
              <button
                type="button"
                id="btn-dashboard-create-order"
                onClick={onOpenCreateOrder}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create Order</span>
              </button>
            ) : (
              <span className="px-3.5 py-2 bg-slate-800/80 border border-slate-700 text-slate-300 rounded-xl text-xs font-medium flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>Read-Only Privileges</span>
              </span>
            )}
            <button
              type="button"
              id="btn-dashboard-view-products"
              onClick={() => onNavigateTab('products')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold transition-all border border-slate-700"
            >
              Browse Catalog
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* KPI 1: Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              {formatCurrency(totalRevenue)}
            </h3>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center text-emerald-600 font-semibold">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                +14.2%
              </span>
              <span className="text-slate-400">vs last month</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              {totalOrdersCount.toLocaleString()}
            </h3>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center text-emerald-600 font-semibold">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                +8.5%
              </span>
              <span className="text-slate-400">vs last month</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Total Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Products
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              {totalProductsCount} items
            </h3>
            <div className="flex items-center gap-1.5 text-xs">
              {lowStockCount > 0 ? (
                <span className="text-amber-600 font-medium">
                  {lowStockCount} items low stock
                </span>
              ) : (
                <span className="text-emerald-600 font-medium">All stock healthy</span>
              )}
            </div>
          </div>
        </div>

        {/* KPI 4: Active Users */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Users
            </span>
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              {activeUsersCount} / {users.length}
            </h3>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center text-emerald-600 font-semibold">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                +11.8%
              </span>
              <span className="text-slate-400">community growth</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue & Orders Timeline Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Revenue & Volume Analytics</h2>
              <p className="text-xs text-slate-500">Monthly fiscal tracking and performance</p>
            </div>

            {/* Metric Toggle */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-medium self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setChartMetric('revenue')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  chartMetric === 'revenue'
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Revenue ($)
              </button>
              <button
                type="button"
                onClick={() => setChartMetric('orders')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  chartMetric === 'orders'
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Orders Volume
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(v) => (chartMetric === 'revenue' ? `$${v / 1000}k` : v)}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-800">
                          <p className="font-bold text-slate-200 mb-1">{label} Overview</p>
                          <p className="text-blue-400 font-semibold">
                            Revenue: {formatCurrency(data.revenue)}
                          </p>
                          <p className="text-indigo-300">
                            Orders: {data.orders} shipments
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={chartMetric === 'revenue' ? 'revenue' : 'orders'}
                  stroke={chartMetric === 'revenue' ? '#2563eb' : '#7c3aed'}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={chartMetric === 'revenue' ? 'url(#colorRevenue)' : 'url(#colorOrders)'}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Category Breakdown Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">Category Breakdown</h2>
            <p className="text-xs text-slate-500">Sales volume distribution</p>
          </div>

          <div className="h-60 w-full flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value}% share`, name]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-slate-900">100%</span>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Categories</span>
            </div>
          </div>

          {/* Custom Legend */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 mt-2">
            {categoryBreakdownData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-slate-600 truncate">{cat.name}</span>
                <span className="text-slate-400 font-semibold ml-auto">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table (Last 5 Orders) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Orders</h2>
            <p className="text-xs text-slate-500">Summary of the 5 most recent customer purchases</p>
          </div>
          <button
            type="button"
            id="btn-view-all-orders"
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
          >
            <span>View All Orders</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 text-xs">
                    {order.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{order.customerName}</div>
                    <div className="text-xs text-slate-400">{order.customerEmail}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">{order.date}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    ${Number(order.totalAmount).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(order.status)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onViewOrderDetails && onViewOrderDetails(order)}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
