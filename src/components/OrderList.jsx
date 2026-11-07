import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';
import OrderDetailsModal from './OrderDetailsModal.jsx';

export default function OrderList({
  orders = [],
  currentUser,
  onUpdateOrderStatus,
  searchQuery = '',
  setSearchQuery = () => {},
}) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected order for view details modal
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState(null);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const id = String(order._id || order.id || '').toLowerCase();
      const name = (
        order.shippingAddress?.fullName ||
        order.user?.name ||
        order.customerName ||
        ''
      ).toLowerCase();
      const email = (
        order.user?.email ||
        order.customerEmail ||
        ''
      ).toLowerCase();

      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || id.includes(q) || name.includes(q) || email.includes(q);

      const status = (order.status || '').toLowerCase();
      let matchesStatus = true;
      if (statusFilter !== 'All') {
        matchesStatus = status === statusFilter.toLowerCase();
      }

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const getStatusBadge = (status = '') => {
    const s = status.toLowerCase();
    switch (s) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Delivered</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            <span>Shipped</span>
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Processing</span>
          </span>
        );
      case 'placed':
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Placed</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
            {status}
          </span>
        );
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    await onUpdateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Orders Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track customer orders, review shipments, and update delivery statuses in real-time.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by customer name, email or ID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="placed">Placed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Change Status</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((ord) => {
                  const id = ord._id || ord.id;
                  const customerName =
                    ord.shippingAddress?.fullName ||
                    ord.user?.name ||
                    ord.customerName ||
                    'Customer';
                  const customerEmail =
                    ord.user?.email || ord.customerEmail || '—';
                  const itemsCount = ord.items?.length || 0;
                  const total = ord.total || ord.totalAmount || 0;

                  return (
                    <tr key={id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-xs text-slate-900">
                        #{String(id).slice(-6).toUpperCase()}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{customerName}</div>
                        <div className="text-xs text-slate-400">{customerEmail}</div>
                      </td>

                      <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                        {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ${Number(total).toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4">{getStatusBadge(ord.status)}</td>

                      <td className="py-3.5 px-4">
                        <select
                          value={ord.status || 'placed'}
                          onChange={(e) => handleStatusChange(id, e.target.value)}
                          className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 hover:bg-white text-slate-700 cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-black"
                        >
                          <option value="placed">Placed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrderForDetails(ord)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-black transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <ShoppingBag className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">No orders found</p>
                    <p className="text-xs text-slate-400 mt-1">Orders placed by customers will appear here</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing {Math.min(filteredOrders.length, (currentPage - 1) * itemsPerPage + 1)} to{' '}
              {Math.min(filteredOrders.length, currentPage * itemsPerPage)} of {filteredOrders.length} orders
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 font-semibold text-slate-700">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      <OrderDetailsModal
        isOpen={Boolean(selectedOrderForDetails)}
        onClose={() => setSelectedOrderForDetails(null)}
        order={selectedOrderForDetails}
      />
    </div>
  );
}
