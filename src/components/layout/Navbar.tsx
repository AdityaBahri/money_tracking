'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import {
  WalletCards,
  Sun,
  Moon,
  User,
  LogOut,
  ChevronDown,
} from 'lucide-react';

export function Navbar() {
  const {
    user,
    theme,
    toggleTheme,
    setIsAuthOpen,
    logout,
  } = useFinance();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-[#131B2A]/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <WalletCards className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                SakuRapi
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-medium rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Keuangan Pribadi
              </span>
            </div>
            <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400">
              Pelacak Saldo Multi-Dompet & Scan Struk
            </p>
          </div>
        </div>

        {/* Right Actions: Theme Toggle, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle (R-21 & R-34) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="tap-target p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
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
                  className="tap-target px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-2"
                  aria-expanded={isUserMenuOpen}
                  aria-label="Menu akun pengguna"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold uppercase">
                    {user.username.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-semibold max-w-[90px] sm:max-w-[130px] truncate">
                    {user.full_name || user.username}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg py-2 z-50 text-xs"
                    role="menu"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/60">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">
                        {user.full_name || user.username}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 truncate">
                        {user.email || user.username}
                      </p>
                      <div className="mt-1 inline-block px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        Pemilik Akun Tunggal
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-2"
                      role="menuitem"
                    >
                      <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Keluar dari Akun</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="tap-target px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm"
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
