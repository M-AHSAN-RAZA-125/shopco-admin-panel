import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, AlertCircle, Loader2, Upload } from 'lucide-react';
import { adminApi, getAdminImageUrl } from '../api/adminApi';

const CATEGORIES = ["T-shirts", "Shirts", "Shorts", "Jeans", "Hoodie", "Casual", "Formal", "Party", "Gym"];
const AVAILABLE_SIZES = ["Small", "Medium", "Large", "X-Large"];
const COMMON_COLORS = ["Black", "White", "Navy", "Olive", "Teal", "Red", "Grey", "Beige"];

export default function ProductModal({ isOpen, onClose, onSave, productToEdit, loading }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('T-shirts');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [stock, setStock] = useState('50');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState(['Small', 'Medium', 'Large', 'X-Large']);
  const [selectedColors, setSelectedColors] = useState(['Black', 'Navy']);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP, etc.).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file size must be less than 10MB.');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      setImage(base64Data);

      try {
        setUploading(true);
        const res = await adminApi.uploadImage(base64Data, file.name);
        if (res && res.success && res.url) {
          setImage(res.url);
        }
      } catch (uploadErr) {
        // Fallback to base64 if backend upload fails
        console.warn('Backend upload endpoint offline, using base64 image data');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || '');
      setCategory(productToEdit.category || 'T-shirts');
      setPrice(productToEdit.price ? String(productToEdit.price) : '');
      setOldPrice(productToEdit.oldPrice ? String(productToEdit.oldPrice) : '');
      setDiscount(productToEdit.discount || '');
      setStock(productToEdit.stock !== undefined ? String(productToEdit.stock) : '50');
      setImage(productToEdit.image || '');
      setDescription(productToEdit.description || '');
      setIsFeatured(Boolean(productToEdit.isFeatured));
      setSelectedSizes(Array.isArray(productToEdit.sizes) && productToEdit.sizes.length ? productToEdit.sizes : ['Small', 'Medium', 'Large']);
      setSelectedColors(Array.isArray(productToEdit.colors) && productToEdit.colors.length ? productToEdit.colors : ['Black']);
    } else {
      setName('');
      setCategory('T-shirts');
      setPrice('');
      setOldPrice('');
      setDiscount('');
      setStock('50');
      setImage('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80');
      setDescription('');
      setIsFeatured(false);
      setSelectedSizes(['Small', 'Medium', 'Large', 'X-Large']);
      setSelectedColors(['Black', 'Navy']);
    }
    setError('');
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setError('Please enter a valid price greater than 0.');
      return;
    }
    if (stock === '' || isNaN(Number(stock)) || Number(stock) < 0) {
      setError('Please enter a valid stock quantity (0 or greater).');
      return;
    }
    if (!image.trim()) {
      setError('Product image URL is required.');
      return;
    }

    const payload = {
      name: name.trim(),
      category: category.trim(),
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      discount: discount.trim() || (oldPrice && Number(oldPrice) > Number(price) ? `-${Math.round(((Number(oldPrice) - Number(price)) / Number(oldPrice)) * 100)}%` : ''),
      stock: Number(stock),
      image: image.trim(),
      description: description.trim() || `${name.trim()} - Shop.Co premium collection`,
      sizes: selectedSizes,
      colors: selectedColors,
      isFeatured,
    };

    onSave(payload, productToEdit?._id || productToEdit?.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              {productToEdit ? 'Edit Product' : 'Add New Product'}
            </h3>
            <p className="text-xs text-slate-500">
              Configure product details, pricing, inventory and variations.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Product Title *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Slim Fit Denim Jacket"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-black"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-black cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Stock Inventory *
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-black"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Selling Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="120"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-black"
                required
              />
            </div>

            {/* Old Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Original / Old Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                placeholder="150"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Product Image Upload & URL */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Product Image *
              </label>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-black hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors shadow-sm">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span>{uploading ? 'Processing Image...' : '📁 Choose Image from PC'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  <span className="text-xs text-slate-400 font-medium text-center sm:text-left">
                    OR paste direct image link below:
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://... (direct image link ending with .jpg, .png, etc.) or /images/..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-black"
                    required
                  />
                  {image && (
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="px-2.5 py-2 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg border border-slate-200"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Real-time Preview */}
                {image && (
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0">
                      <img
                        src={getAdminImageUrl(image)}
                        alt="Product Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/100?text=Preview+Error';
                        }}
                      />
                    </div>
                    <div className="text-xs text-slate-600 min-w-0 flex-1">
                      <p className="font-semibold text-emerald-600 flex items-center gap-1">
                        ✓ Image Selected
                      </p>
                      <p className="truncate text-[11px] font-mono text-slate-400">
                        {image.length > 50 ? `${image.slice(0, 47)}...` : image}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sizes */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SIZES.map((size) => {
                  const isChecked = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-black text-white border-black'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Available Colors
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_COLORS.map((color) => {
                  const isChecked = selectedColors.includes(color);
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => toggleColor(color)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-black text-white border-black'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product description and highlights..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Is Featured checkbox */}
            <div className="md:col-span-2 flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium text-slate-700 cursor-pointer">
                Feature on Homepage (Top Selling / New Arrivals)
              </label>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-black hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{productToEdit ? 'Save Changes' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
