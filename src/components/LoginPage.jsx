import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Store, AlertCircle, Loader2 } from 'lucide-react';
import { adminApi } from '../api/adminApi';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('admin@shopco.com');
  const [password, setPassword] = useState('admin12345');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await adminApi.login(email.trim(), password);
      if (res.success && res.user) {
        if (res.user.role !== 'admin') {
          setError('Access denied: Your account does not have Admin privileges.');
          setLoading(false);
          return;
        }

        onLogin({
          id: res.user.id || res.user._id,
          name: res.user.name,
          email: res.user.email,
          role: 'Admin',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        });
      } else {
        setError(res.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Unable to connect to backend API.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setEmail('admin@shopco.com');
    setPassword('admin12345');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle decorative background shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative z-10">
        {/* Card Header */}
        <div className="bg-slate-950 px-8 pt-8 pb-7 text-white border-b border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-black border border-slate-700 flex items-center justify-center shadow-lg shadow-black/40">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white font-integral">SHOP.CO</h1>
              <p className="text-xs text-slate-400 font-medium">Administrator Control Portal</p>
            </div>
          </div>
          <p className="text-sm text-slate-300">
            Sign in with administrative credentials to manage catalog, orders, and users.
          </p>
        </div>

        {/* Card Body */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shopco.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 bg-black hover:bg-slate-800 text-white font-semibold rounded-xl text-sm shadow-lg shadow-black/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying Credentials...
                </>
              ) : (
                <>
                  <span>Sign In as Administrator</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Helper */}
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-xs text-slate-500">
            <div className="flex items-center justify-between">
              <span>Default Admin Seed:</span>
              <button
                type="button"
                onClick={handleQuickDemo}
                className="text-black font-semibold hover:underline cursor-pointer flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                admin@shopco.com
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onLogin({
                  id: 'demo-admin',
                  name: 'ShopCo Admin (Local)',
                  email: 'admin@shopco.com',
                  role: 'Admin',
                  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
                });
              }}
              className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Instant Preview Mode (Bypass Auth)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
