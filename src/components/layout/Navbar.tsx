'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useFinance } from '@/context/FinanceContext';
import {
  Sun,
  Moon,
  User,
  LogOut,
  ChevronDown,
  Download,
} from 'lucide-react';

export function Navbar() {
  const {
    user,
    theme,
    toggleTheme,
    setIsAuthOpen,
    logout,
    setIsExportOpen,
  } = useFinance();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-[#F2F2F7]/85 dark:bg-black/85 border-b border-black/[0.06] dark:border-white/[0.08] backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
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
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                SakuRapi
              </span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-[#007AFF]/10 dark:bg-[#0A84FF]/15 text-[#007AFF] dark:text-[#0A84FF] border border-[#007AFF]/20 dark:border-[#0A84FF]/25">
                Keuangan Pribadi
              </span>
            </div>
            <p className="hidden md:block text-xs text-[#6C6C70] dark:text-[#8E8E93]">
              Pelacak Saldo Multi-Dompet &amp; Scan Struk
            </p>
          </div>
        </div>

        {/* Right Actions: Theme Toggle, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
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

          {/* User Account / Profile */}
          <div className="relative">
            {user ? (
              <div>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="apple-button tap-target px-3 py-1.5 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-white/80 dark:bg-[#1C1C1E] hover:bg-black/[0.04] dark:hover:bg-[#2C2C2E] text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-2 shadow-xs"
                  aria-expanded={isUserMenuOpen}
                  aria-label="Menu akun pengguna"
                >
                  <div className="w-6 h-6 rounded-full bg-[#007AFF]/15 dark:bg-[#0A84FF]/20 text-[#007AFF] dark:text-[#0A84FF] flex items-center justify-center text-xs font-bold uppercase">
                    {user.username.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-semibold max-w-[90px] sm:max-w-[130px] truncate">
                    {user.full_name || user.username}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#8E8E93]" aria-hidden="true" />
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#1C1C1E] shadow-xl py-2 z-50 text-xs backdrop-blur-xl"
                    role="menu"
                  >
                    <div className="px-3.5 py-2.5 border-b border-black/[0.05] dark:border-white/[0.08]">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">
                        {user.full_name || user.username}
                      </p>
                      <p className="text-[#6C6C70] dark:text-[#8E8E93] truncate">
                        {user.email || user.username}
                      </p>
                      <div className="mt-1.5 inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/[0.05] dark:bg-[#2C2C2E] text-slate-600 dark:text-slate-300">
                        Pemilik Akun Tunggal
                      </div>
                    </div>
                    <div className="p-1 space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsExportOpen(true);
                        }}
                        className="apple-button w-full text-left px-3 py-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-[#2C2C2E] text-slate-800 dark:text-slate-200 flex items-center gap-2 font-medium"
                        role="menuitem"
                      >
                        <Download className="w-3.5 h-3.5 text-[#007AFF] dark:text-[#0A84FF]" aria-hidden="true" />
                        <span>Ekspor Catatan Keuangan</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="apple-button w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-2 font-medium"
                        role="menuitem"
                      >
                        <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Keluar dari Akun</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="apple-button tap-target px-3.5 py-1.5 rounded-2xl bg-[#007AFF] hover:bg-[#0071E3] dark:bg-[#0A84FF] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <User className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Masuk / Daftar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
