'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { LayoutDashboard, Wallet, ReceiptText, HandCoins, Plus } from 'lucide-react';

export function BottomNav() {
  const { activeTab, setActiveTab, setIsAddTxOpen } = useFinance();

  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'Beranda',
      icon: LayoutDashboard,
    },
    {
      id: 'wallets' as const,
      label: 'Dompet',
      icon: Wallet,
    },
    {
      id: 'transactions' as const,
      label: 'Riwayat',
      icon: ReceiptText,
    },
    {
      id: 'debts' as const,
      label: 'Utang',
      icon: HandCoins,
    },
  ];

  return (
    <nav
      className="md:hidden fixed inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[460px] z-40 pointer-events-none transition-all"
      aria-label="Navigasi Bawah Mobile"
      style={{
        bottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))',
      }}
    >
      <div className="flex items-center gap-2.5 sm:gap-3 w-full">
        {/* Main Liquid Glass Bar: 4 Navigasi Tabs */}
        <div
          className="liquid-glass-bar flex-1 rounded-full p-1.5 flex items-center justify-around gap-1 pointer-events-auto min-w-0"
          role="tablist"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setActiveTab(item.id)}
                className={`tap-target flex-1 min-w-0 py-1.5 px-1 rounded-full flex flex-col items-center justify-center transition-all duration-200 group ${
                  isActive
                    ? 'liquid-glass-pill-active text-[#007AFF] dark:text-[#0A84FF] font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                <Icon
                  className="w-5 h-5 mb-0.5 shrink-0 transition-transform group-active:scale-95"
                  aria-hidden="true"
                />
                <span className="text-[10px] truncate max-w-full leading-none">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tombol Terpisah (+) Mengambang di Sebelah Kanan Bottom Bar */}
        <button
          type="button"
          onClick={() => setIsAddTxOpen(true)}
          className="tap-target w-12 h-12 rounded-full bg-[#007AFF] hover:bg-[#0071E3] dark:bg-[#0A84FF] active:scale-90 text-white flex items-center justify-center shrink-0 shadow-[0_6px_20px_rgba(0,122,255,0.45),inset_0_1.5px_1px_rgba(255,255,255,0.5),inset_0_-1.5px_1px_rgba(0,0,0,0.25)] border border-[#007AFF]/50 backdrop-blur-md transition-all pointer-events-auto"
          aria-label="Catat transaksi baru"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
