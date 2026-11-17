'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import {
  LayoutDashboard,
  Wallet,
  ReceiptText,
  ScanLine,
  PlusCircle,
  ShieldCheck,
  HandCoins,
} from 'lucide-react';
import { formatRupiah } from '@/lib/formatters';

export function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    wallets,
    transactions,
    debts,
    totalBalance,
    setIsAddTxOpen,
    setIsScannerOpen,
  } = useFinance();

  return (
    <aside
      className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2A] p-4 flex-shrink-0 min-h-[calc(100vh-4rem)]"
      aria-label="Navigasi Utama Desktop"
    >
      {/* Saldo Ringkas di Sidebar */}
      <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70">
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Total Saldo Terkumpul
        </span>
        <div className="text-xl font-bold text-slate-900 dark:text-white mt-1 truncate" suppressHydrationWarning>
          {formatRupiah(totalBalance)}
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium" suppressHydrationWarning>
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{wallets.length} dompet aktif</span>
        </div>
      </div>

      {/* Aksi Cepat */}
      <div className="space-y-2 mb-6">
        <button
          type="button"
          onClick={() => setIsAddTxOpen(true)}
          className="tap-target w-full px-3.5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <PlusCircle className="w-4 h-4" aria-hidden="true" />
          <span>Tambah Transaksi</span>
        </button>
        <button
          type="button"
          onClick={() => setIsScannerOpen(true)}
          className="tap-target w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/70 text-slate-700 dark:text-slate-200 font-medium text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <ScanLine className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <span>Pindai Struk Belanja</span>
        </button>
      </div>

      {/* Navigasi Menu */}
      <nav className="space-y-1 flex-1" aria-label="Menu Aplikasi">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`tap-target w-full px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
            activeTab === 'dashboard'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-l-4 border-emerald-600'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          aria-current={activeTab === 'dashboard' ? 'page' : undefined}
        >
          <div className="flex items-center gap-2.5">
            <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
            <span>Dashboard</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('wallets')}
          className={`tap-target w-full px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
            activeTab === 'wallets'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-l-4 border-emerald-600'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          aria-current={activeTab === 'wallets' ? 'page' : undefined}
        >
          <div className="flex items-center gap-2.5">
            <Wallet className="w-4 h-4" aria-hidden="true" />
            <span>Kelola Dompet</span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {wallets.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transactions')}
          className={`tap-target w-full px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
            activeTab === 'transactions'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-l-4 border-emerald-600'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          aria-current={activeTab === 'transactions' ? 'page' : undefined}
        >
          <div className="flex items-center gap-2.5">
            <ReceiptText className="w-4 h-4" aria-hidden="true" />
            <span>Riwayat Transaksi</span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {transactions.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('debts')}
          className={`tap-target w-full px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
            activeTab === 'debts'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-l-4 border-emerald-600'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          aria-current={activeTab === 'debts' ? 'page' : undefined}
        >
          <div className="flex items-center gap-2.5">
            <HandCoins className="w-4 h-4" aria-hidden="true" />
            <span>Catat Utang</span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {debts.length}
          </span>
        </button>
      </nav>
    </aside>
  );
}

