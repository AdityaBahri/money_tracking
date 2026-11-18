'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useFinance } from '@/context/FinanceContext';
import {
  User,
  Lock,
  Mail,
  AlertCircle,
  Sun,
  Moon,
} from 'lucide-react';

export function AuthPage() {
  const { login, register, theme, toggleTheme } = useFinance();

  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      if (mode === 'register') {
        if (!username.trim() || !password) {
          setErrorMessage('Username dan kata sandi wajib diisi.');
          return;
        }
        const res = await register(username.trim(), email.trim(), password, fullName.trim());
        if (!res.success) {
          setErrorMessage(res.error || 'Pendaftaran gagal. Silakan coba kembali.');
        }
      } else {
        if (!loginIdentifier.trim() || !password) {
          setErrorMessage('Username/email dan kata sandi wajib diisi.');
          return;
        }
        const res = await login(loginIdentifier.trim(), password);
        if (!res.success) {
          setErrorMessage(res.error || 'Username/email atau kata sandi tidak cocok.');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestDemo = async () => {
    setIsSubmitting(true);
    try {
      await login('pemilik_demo', 'demo123');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F2F2F7] dark:bg-black text-slate-900 dark:text-white transition-colors" suppressHydrationWarning>
      {/* Top Bar with Brand & Theme Toggle */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl overflow-hidden shadow-xs flex-shrink-0 border border-black/[0.06] dark:border-white/[0.1]">
            <Image
              src="/logo.png"
              alt="Logo SakuRapi"
              width={36}
              height={36}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
            SakuRapi
          </span>
        </div>

        {/* Theme Toggle (R-21 & R-34) */}
        <button
          type="button"
          onClick={toggleTheme}
          className="apple-button tap-target p-2 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-white/80 dark:bg-[#1C1C1E] text-slate-700 dark:text-slate-200 hover:bg-black/[0.04] dark:hover:bg-[#2C2C2E] transition-colors shadow-xs"
          aria-label={`Ganti ke mode ${theme === 'light' ? 'gelap' : 'terang'}`}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Sun className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </header>

      {/* Main Form Center Box */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-md bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl shadow-xl p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl overflow-hidden shadow-sm mb-3 border border-black/[0.06] dark:border-white/[0.1]">
              <Image
                src="/logo.png"
                alt="Logo SakuRapi"
                width={56}
                height={56}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {mode === 'register' ? 'Mulai Kelola Keuangan Anda' : 'Selamat Datang Kembali'}
            </h1>
            <p className="text-xs text-[#6C6C70] dark:text-[#8E8E93] mt-1.5 max-w-sm mx-auto">
              {mode === 'register'
                ? 'Daftar sebagai pemilik akun untuk melacak saldo rekening bank, e-wallet, scan struk belanja, dan utang piutang.'
                : 'Masukkan username atau alamat email Anda untuk membuka aplikasi.'}
            </p>
          </div>

          {/* Tab Switcher: Daftar vs Masuk */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-black/[0.06] dark:bg-[#2C2C2E] mb-6" role="tablist">
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
              Daftar Akun Baru
            </button>
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
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' ? (
              <>
                {/* Username */}
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

                {/* Email (Optional or for Supabase) */}
                <div>
                  <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Alamat Email (Opsional jika memakai username)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" aria-hidden="true" />
                    <input
                      id="reg-email"
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-[#2C2C2E]/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF]"
                    />
                  </div>
                </div>

                {/* Nama Lengkap */}
                <div>
                  <label htmlFor="reg-fullname" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Lengkap / Panggilan
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

                {/* Password */}
                <div>
                  <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kata Sandi
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
            ) : (
              <>
                {/* Login: Username or Email */}
                <div>
                  <label htmlFor="login-id" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Username atau Email
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" aria-hidden="true" />
                    <input
                      id="login-id"
                      type="text"
                      required
                      autoFocus
                      placeholder="nama_pengguna atau email@domain.com"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-[#2C2C2E]/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF]"
                    />
                  </div>
                </div>

                {/* Login: Password */}
                <div>
                  <label htmlFor="login-pass" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" aria-hidden="true" />
                    <input
                      id="login-pass"
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
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="apple-button tap-target w-full py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold text-white bg-[#007AFF] hover:bg-[#0071E3] dark:bg-[#0A84FF] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs"
              >
                <span>{isSubmitting ? 'Memproses...' : mode === 'register' ? 'Daftar & Buka Aplikasi' : 'Masuk ke Aplikasi'}</span>
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-black/[0.05] dark:border-white/[0.08] text-center">
            <button
              type="button"
              onClick={handleGuestDemo}
              className="apple-button tap-target text-xs font-semibold text-[#6C6C70] hover:text-[#007AFF] dark:text-[#8E8E93] dark:hover:text-[#0A84FF] transition-colors py-1 px-3 rounded-xl"
            >
              Atau coba langsung dengan mode tamu
            </button>
          </div>
        </div>
      </main>

      <footer className="w-full text-center py-4 text-xs text-[#6C6C70] dark:text-[#8E8E93]">
        SakuRapi: Manajemen Keuangan dan Pelacakan Dompet Pribadi
      </footer>
    </div>
  );
}
