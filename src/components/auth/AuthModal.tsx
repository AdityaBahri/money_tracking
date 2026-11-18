'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useFinance } from '@/context/FinanceContext';
import { X, User, Lock, Mail, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function AuthModal() {
  const { isAuthOpen, setIsAuthOpen, login, register, isSupabase } = useFinance();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle ESC key (R-32)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthOpen) {
        setIsAuthOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthOpen, setIsAuthOpen]);

  if (!isAuthOpen) return null;

  const handleClose = () => {
    setIsAuthOpen(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        if (!identifier.trim() || !password) {
          setErrorMessage('Harap isi username atau email dan kata sandi.');
          return;
        }
        const res = await login(identifier.trim(), password);
        if (!res.success) {
          setErrorMessage(res.error || 'Gagal masuk akun. Periksa kembali username/email dan kata sandi.');
        } else {
          setSuccessMessage('Berhasil masuk.');
          setTimeout(() => handleClose(), 600);
        }
      } else {
        if (!username.trim() || !password) {
          setErrorMessage('Username dan kata sandi wajib diisi.');
          return;
        }
        const res = await register(username.trim(), email.trim(), password, fullName.trim());
        if (!res.success) {
          setErrorMessage(res.error || 'Gagal mendaftar akun baru.');
        } else {
          setSuccessMessage('Pendaftaran berhasil! Akun Anda aktif.');
          setTimeout(() => handleClose(), 600);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="w-full max-w-md bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-black/[0.05] dark:border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-2xl overflow-hidden shrink-0 shadow-xs border border-black/[0.06] dark:border-white/[0.1]">
              <Image
                src="/logo.png"
                alt="Logo SakuRapi"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 id="auth-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                {mode === 'login' ? 'Masuk ke SakuRapi' : 'Daftar Akun Pengguna'}
              </h2>
              <p className="text-xs text-[#6C6C70] dark:text-[#8E8E93] mt-0.5">
                {isSupabase
                  ? 'Terhubung dengan database Supabase Auth'
                  : 'Mode mandiri akun tunggal (Penyimpanan Aman)'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="apple-button tap-target p-2 rounded-2xl text-[#8E8E93] hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-[#2C2C2E] transition-colors"
            aria-label="Tutup dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="p-5 pb-0">
          <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-black/[0.06] dark:bg-[#2C2C2E]" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`apple-button tap-target py-2 text-xs font-semibold rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-[#3A3A3C] text-slate-900 dark:text-white shadow-xs'
                  : 'text-[#6C6C70] dark:text-[#8E8E93] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              onClick={() => {
                setMode('register');
                setErrorMessage('');
              }}
              className={`apple-button tap-target py-2 text-xs font-semibold rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-white dark:bg-[#3A3A3C] text-slate-900 dark:text-white shadow-xs'
                  : 'text-[#6C6C70] dark:text-[#8E8E93] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Daftar Baru
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span>{successMessage}</span>
            </div>
          )}

          {mode === 'login' ? (
            <>
              {/* Login identifier */}
              <div>
                <label htmlFor="auth-identifier" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Username atau Email
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" aria-hidden="true" />
                  <input
                    id="auth-identifier"
                    type="text"
                    required
                    placeholder="nama_pengguna atau email@domain.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-[#2C2C2E]/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="auth-password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" aria-hidden="true" />
                  <input
                    id="auth-password"
                    type="password"
                    required
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-[#2C2C2E]/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF]"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Register: Username */}
              <div>
                <label htmlFor="reg-username" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" aria-hidden="true" />
                  <input
                    id="reg-username"
                    type="text"
                    required
                    placeholder="nama_pengguna"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-[#2C2C2E]/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF]"
                  />
                </div>
              </div>

              {/* Register: Email */}
              <div>
                <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Alamat Email (Opsional jika memakai username)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" aria-hidden="true" />
                  <input
                    id="reg-email"
                    type="email"
                    placeholder="email@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-[#2C2C2E]/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF]"
                  />
                </div>
              </div>

              {/* Register: Full Name */}
              <div>
                <label htmlFor="reg-fullname" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap
                </label>
                <input
                  id="reg-fullname"
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-[#2C2C2E]/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF]"
                />
              </div>

              {/* Register: Password */}
              <div>
                <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" aria-hidden="true" />
                  <input
                    id="reg-password"
                    type="password"
                    required
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-[#2C2C2E]/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF]"
                  />
                </div>
              </div>
            </>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="apple-button tap-target w-full py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold text-white bg-[#007AFF] hover:bg-[#0071E3] dark:bg-[#0A84FF] transition-all disabled:opacity-50 shadow-xs"
            >
              {isSubmitting
                ? 'Memproses...'
                : mode === 'login'
                ? 'Masuk ke Akun'
                : 'Selesaikan Pendaftaran'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

