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
      className="md:hidden fixed inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[440px] z-40 pointer-events-none transition-all"
      aria-label="Navigasi Bawah Mobile"
      style={{
        bottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))',
      }}
    >
      <div className="liquid-glass-bar rounded-full p-1.5 flex items-center justify-between gap-1 pointer-events-auto">
        {/* Navigation Tabs */}
        <div className="flex items-center flex-1 justify-around gap-1 min-w-0" role="tablist">
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
                    ? 'liquid-glass-pill-active text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5 shrink-0 transition-transform group-active:scale-95" aria-hidden="true" />
                <span className="text-[10px] truncate max-w-full leading-none">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Vertical Specular Glass Divider */}
        <div className="w-px h-6 bg-slate-300/50 dark:bg-white/15 my-auto shrink-0" aria-hidden="true" />

        {/* Plus (+) Action Button at the far right */}
        <button
          type="button"
          onClick={() => setIsAddTxOpen(true)}
          className="tap-target w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-90 text-white flex items-center justify-center shrink-0 shadow-[0_4px_14px_rgba(37,99,235,0.4),inset_0_1px_1px_rgba(255,255,255,0.35)] border border-blue-400/30 transition-transform ml-0.5"
          aria-label="Catat transaksi baru"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
