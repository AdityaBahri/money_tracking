'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { LayoutDashboard, Wallet, ReceiptText, HandCoins, Plus } from 'lucide-react';

export function BottomNav() {
  const { activeTab, setActiveTab, setIsAddTxOpen } = useFinance();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#131B2A]/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-md pb-safe"
      aria-label="Navigasi Bawah Mobile"
    >
      <div className="flex items-center justify-around h-16 px-2">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`tap-target flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'dashboard'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          aria-current={activeTab === 'dashboard' ? 'page' : undefined}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" aria-hidden="true" />
          <span className="text-[11px]">Beranda</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('wallets')}
          className={`tap-target flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'wallets'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          aria-current={activeTab === 'wallets' ? 'page' : undefined}
        >
          <Wallet className="w-5 h-5 mb-0.5" aria-hidden="true" />
          <span className="text-[11px]">Dompet</span>
        </button>

        <div className="flex-1 flex justify-center -mt-4">
          <button
            type="button"
            onClick={() => setIsAddTxOpen(true)}
            className="w-11 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center border border-blue-500/20 active:scale-95 transition-transform"
            aria-label="Tambah transaksi baru"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('debts')}
          className={`tap-target flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'debts'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          aria-current={activeTab === 'debts' ? 'page' : undefined}
        >
          <HandCoins className="w-5 h-5 mb-0.5" aria-hidden="true" />
          <span className="text-[11px]">Utang</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transactions')}
          className={`tap-target flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'transactions'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          aria-current={activeTab === 'transactions' ? 'page' : undefined}
        >
          <ReceiptText className="w-5 h-5 mb-0.5" aria-hidden="true" />
          <span className="text-[11px]">Riwayat</span>
        </button>
      </div>
    </nav>
  );
}
