import React from 'react';
import {
  X,
  Printer,
  Package,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  User,
  Mail,
  Phone
} from 'lucide-react';

export default function OrderDetailsModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  const getStatusBadge = (status = '') => {
    const s = status.toLowerCase();
    switch (s) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <Truck className="w-3.5 h-3.5" />
            Shipped
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
            <Clock className="w-3.5 h-3.5" />
            Processing
          </span>
        );
      case 'placed':
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" />
            Placed / Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
            {status}
          </span>
        );
    }
  };

  const customerName = order.shippingAddress?.fullName || order.user?.name || order.customerName || 'Guest Customer';
  const customerEmail = order.user?.email || order.customerEmail || 'No email provided';
  const customerPhone = order.shippingAddress?.phone || order.phone || '';
  const fullAddress = order.shippingAddress
    ? typeof order.shippingAddress === 'string'
      ? order.shippingAddress
      : `${order.shippingAddress.address || ''}, ${order.shippingAddress.city || ''} ${order.shippingAddress.postalCode || ''}, ${order.shippingAddress.country || 'Pakistan'}`
    : 'No address provided';

  const orderId = order._id || order.id;
  const items = order.items || [];
  const subtotal = order.subtotal ?? (order.total || 0);
  const discountAmount = order.discountAmount || 0;
  const deliveryFee = order.deliveryFee || 0;
  const total = order.total || order.totalAmount || 0;
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : order.date || 'Today';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-mono font-bold text-sm">
              #{String(orderId).slice(-4).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg">Order Details</h3>
                {getStatusBadge(order.status)}
              </div>
              <p className="text-xs text-slate-500 font-mono">ID: {orderId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Customer & Shipping summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer</div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <User className="w-4 h-4 text-slate-400" />
                <span>{customerName}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{customerEmail}</span>
              </div>
              {customerPhone && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{customerPhone}</span>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Delivery Address</div>
              <div className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{fullAddress}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Placed on: {orderDate}</span>
              </div>
            </div>
          </div>

          {/* Ordered Line Items */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Items Ordered ({items.length})
            </div>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
              {items.map((it, idx) => (
                <div key={idx} className="p-3 bg-white flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={it.image || 'https://placehold.co/60'}
                      alt={it.name}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-100 shrink-0 bg-slate-50"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/60?text=Item';
                      }}
                    />
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{it.name || it.productName}</div>
                      <div className="text-xs text-slate-500">
                        Qty: {it.quantity || 1} {it.size ? `• Size: ${it.size}` : ''} {it.color ? `• Color: ${it.color}` : ''}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    ${(Number(it.price || 0) * Number(it.quantity || 1)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Totals */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>${Number(subtotal).toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount Applied</span>
                <span>-${Number(discountAmount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee</span>
              <span>${Number(deliveryFee).toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-bold text-slate-900">
              <span>Total Amount</span>
              <span>${Number(total).toFixed(2)}</span>
            </div>
            <div className="text-xs text-slate-400 pt-1">
              Payment Method: <span className="font-semibold text-slate-700 capitalize">{order.paymentMethod ? order.paymentMethod.replace(/_/g, ' ') : 'Cash on Delivery'}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-black hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
