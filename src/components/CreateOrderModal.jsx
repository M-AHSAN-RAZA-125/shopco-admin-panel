import React, { useState, useMemo } from 'react';
import {
  X,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  ShoppingBag,
  CreditCard,
  Building,
  User,
  Mail,
  MapPin
} from 'lucide-react';

export default function CreateOrderModal({
  isOpen,
  onClose,
  products = [],
  onSubmitOrder
}) {
  // Customer Details Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  // Line Items Selection State
  const [selectedProductId, setSelectedProductId] = useState(
    products[0]?.id || ''
  );
  const [itemQuantity, setItemQuantity] = useState(1);
  const [lineItems, setLineItems] = useState([]);
  const [error, setError] = useState('');

  // Selected product lookup
  const currentSelectedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || products[0];
  }, [products, selectedProductId]);

  // Real-time calculations
  const subtotal = useMemo(() => {
    return lineItems.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );
  }, [lineItems]);

  const tax = useMemo(() => {
    return subtotal * 0.08; // 8% sales tax
  }, [subtotal]);

  const shippingFee = useMemo(() => {
    if (lineItems.length === 0) return 0;
    return subtotal >= 150 ? 0 : 15.0; // Free shipping above $150
  }, [lineItems, subtotal]);

  const grandTotal = useMemo(() => {
    return subtotal + tax + shippingFee;
  }, [subtotal, tax, shippingFee]);

  if (!isOpen) return null;

  // Add item to dynamic list
  const handleAddLineItem = () => {
    if (!currentSelectedProduct) {
      setError('Please select a product.');
      return;
    }

    if (itemQuantity <= 0) {
      setError('Quantity must be at least 1.');
      return;
    }

    // Check if product is already in line items
    const existingIndex = lineItems.findIndex(
      (item) => item.productId === currentSelectedProduct.id
    );

    if (existingIndex > -1) {
      // Update existing item quantity
      const updated = [...lineItems];
      const newQty = updated[existingIndex].quantity + itemQuantity;
      if (newQty > currentSelectedProduct.stock && currentSelectedProduct.stock > 0) {
        setError(`Cannot exceed available stock of ${currentSelectedProduct.stock} units.`);
        return;
      }
      updated[existingIndex].quantity = newQty;
      setLineItems(updated);
    } else {
      if (itemQuantity > currentSelectedProduct.stock && currentSelectedProduct.stock > 0) {
        setError(`Cannot exceed available stock of ${currentSelectedProduct.stock} units.`);
        return;
      }
      setLineItems((prev) => [
        ...prev,
        {
          productId: currentSelectedProduct.id,
          productName: currentSelectedProduct.name,
          sku: currentSelectedProduct.sku,
          price: Number(currentSelectedProduct.price),
          quantity: itemQuantity,
          image: currentSelectedProduct.image
        }
      ]);
    }

    setError('');
    setItemQuantity(1);
  };

  const handleRemoveLineItem = (index) => {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateItemQuantity = (index, delta) => {
    setLineItems((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  // Submit Order Form
  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      setError('Customer name is required.');
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setError('A valid customer email is required.');
      return;
    }
    if (!shippingAddress.trim()) {
      setError('Shipping address is required.');
      return;
    }
    if (lineItems.length === 0) {
      setError('Please add at least one line item to the order.');
      return;
    }

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      shippingAddress: shippingAddress.trim(),
      date: new Date().toISOString().split('T')[0],
      items: lineItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      shippingFee: parseFloat(shippingFee.toFixed(2)),
      totalAmount: parseFloat(grandTotal.toFixed(2)),
      paymentMethod,
      status: 'Pending'
    };

    onSubmitOrder(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden my-6 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Create New Customer Order</h3>
              <p className="text-xs text-slate-400">Configure customer info and attach catalog items</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Customer Details Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Customer Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1" htmlFor="order-cust-name">
                  Customer Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                  <input
                    id="order-cust-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1" htmlFor="order-cust-email">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                  <input
                    id="order-cust-email"
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="customer@domain.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1" htmlFor="order-cust-address">
                  Shipping Address *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                  <input
                    id="order-cust-address"
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="123 Main St, Suite 4B, City, ST 12345"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1" htmlFor="order-pay-method">
                  Payment Method
                </label>
                <select
                  id="order-pay-method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                </select>
              </div>
            </div>
          </div>

          {/* Item Selection & Dynamic Line Items */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Select Product & Attach Line Items</span>
            </h4>

            {/* Selector Bar */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-semibold uppercase text-slate-600 mb-1">
                  Product from Catalog
                </label>
                <select
                  id="order-select-product"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id} disabled={prod.stock === 0}>
                      {prod.name} (${Number(prod.price).toFixed(2)}) — {prod.stock > 0 ? `${prod.stock} in stock` : 'Out of stock'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity Selector */}
              <div className="w-32">
                <label className="block text-[11px] font-semibold uppercase text-slate-600 mb-1">
                  Quantity
                </label>
                <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setItemQuantity((q) => Math.max(1, q - 1))}
                    className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 text-sm font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full text-center text-xs font-semibold py-1.5 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setItemQuantity((q) => q + 1)}
                    className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Dynamic Add Item Button */}
              <button
                type="button"
                id="btn-add-line-item"
                onClick={handleAddLineItem}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            {/* Attached Line Items List */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100/70 px-4 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider grid grid-cols-12 gap-2">
                <span className="col-span-6">Item</span>
                <span className="col-span-2 text-right">Price</span>
                <span className="col-span-2 text-center">Qty</span>
                <span className="col-span-2 text-right">Total</span>
              </div>

              <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                {lineItems.length > 0 ? (
                  lineItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2.5 text-xs grid grid-cols-12 gap-2 items-center hover:bg-slate-50"
                    >
                      <div className="col-span-6 flex items-center gap-2 min-w-0">
                        {item.image && (
                          <img
                            src={item.image}
                            alt=""
                            className="w-7 h-7 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                        )}
                        <span className="font-medium text-slate-800 truncate">
                          {item.productName}
                        </span>
                      </div>

                      <div className="col-span-2 text-right text-slate-600 font-mono">
                        ${item.price.toFixed(2)}
                      </div>

                      <div className="col-span-2 flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQuantity(idx, -1)}
                          className="w-5 h-5 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="font-semibold px-1 text-slate-800">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQuantity(idx, 1)}
                          className="w-5 h-5 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <span className="font-bold text-slate-900 font-mono">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400 italic">
                    No items attached yet. Choose an item above and click "Add Item".
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Real-Time Order Calculation Summary */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Items Subtotal:</span>
              <span className="font-mono font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Estimated Sales Tax (8%):</span>
              <span className="font-mono font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>
                Shipping Fee{' '}
                {subtotal >= 150 && lineItems.length > 0 && (
                  <span className="text-[10px] text-emerald-600 font-semibold">(Free over $150)</span>
                )}:
              </span>
              <span className="font-mono font-medium">
                {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-bold text-slate-900">
              <span>Grand Total:</span>
              <span className="font-mono text-base text-blue-600">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-submit-create-order"
              disabled={lineItems.length === 0}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Submit & Process Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
