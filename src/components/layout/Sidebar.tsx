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
      className="hidden md:flex flex-col w-64 border-r border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#161618] p-4 flex-shrink-0 min-h-[calc(100vh-4rem)] transition-colors"
      aria-label="Navigasi Utama Desktop"
    >
      <div className="mb-6 p-4 rounded-2xl bg-[#F2F2F7] dark:bg-[#1C1C1E] border border-black/[0.04] dark:border-white/[0.06]">
        <span className="text-[11px] font-medium uppercase tracking-wider text-[#6C6C70] dark:text-[#8E8E93]">
          Total Saldo Terkumpul
        </span>
        <div className="text-xl font-bold text-slate-900 dark:text-white mt-1 truncate" suppressHydrationWarning>
          {formatRupiah(totalBalance)}
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-[#007AFF] dark:text-[#0A84FF] font-medium" suppressHydrationWarning>
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{wallets.length > 0 ? `${wallets.length} dompet aktif` : 'Belum ada dompet'}</span>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <button
          type="button"
          onClick={() => setIsAddTxOpen(true)}
          className="apple-button tap-target w-full px-3.5 py-2.5 rounded-2xl bg-[#007AFF] hover:bg-[#0071E3] dark:bg-[#0A84FF] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <PlusCircle className="w-4 h-4" aria-hidden="true" />
          <span>Tambah Transaksi</span>
        </button>
        <button
          type="button"
          onClick={() => setIsScannerOpen(true)}
          className="apple-button tap-target w-full px-3.5 py-2.5 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.04] dark:bg-[#2C2C2E] hover:bg-black/[0.07] dark:hover:bg-[#3A3A3C] text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <ScanLine className="w-4 h-4 text-[#007AFF] dark:text-[#0A84FF]" aria-hidden="true" />
          <span>Pindai Struk Belanja</span>
        </button>
      </div>

      <nav className="space-y-1 flex-1" aria-label="Menu Aplikasi">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`apple-button tap-target w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
            activeTab === 'dashboard'
              ? 'bg-[#007AFF]/10 dark:bg-[#0A84FF]/15 text-[#007AFF] dark:text-[#0A84FF]'
              : 'text-[#6C6C70] dark:text-[#8E8E93] hover:bg-black/[0.04] dark:hover:bg-[#2C2C2E] hover:text-slate-900 dark:hover:text-white'
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
          className={`apple-button tap-target w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
            activeTab === 'wallets'
              ? 'bg-[#007AFF]/10 dark:bg-[#0A84FF]/15 text-[#007AFF] dark:text-[#0A84FF]'
              : 'text-[#6C6C70] dark:text-[#8E8E93] hover:bg-black/[0.04] dark:hover:bg-[#2C2C2E] hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-current={activeTab === 'wallets' ? 'page' : undefined}
        >
          <div className="flex items-center gap-2.5">
            <Wallet className="w-4 h-4" aria-hidden="true" />
            <span>Kelola Dompet</span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-black/[0.06] dark:bg-[#2C2C2E] text-slate-700 dark:text-slate-300 font-mono">
            {wallets.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transactions')}
          className={`apple-button tap-target w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
            activeTab === 'transactions'
              ? 'bg-[#007AFF]/10 dark:bg-[#0A84FF]/15 text-[#007AFF] dark:text-[#0A84FF]'
              : 'text-[#6C6C70] dark:text-[#8E8E93] hover:bg-black/[0.04] dark:hover:bg-[#2C2C2E] hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-current={activeTab === 'transactions' ? 'page' : undefined}
        >
          <div className="flex items-center gap-2.5">
            <ReceiptText className="w-4 h-4" aria-hidden="true" />
            <span>Riwayat Transaksi</span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-black/[0.06] dark:bg-[#2C2C2E] text-slate-700 dark:text-slate-300 font-mono">
            {transactions.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('debts')}
          className={`apple-button tap-target w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
            activeTab === 'debts'
              ? 'bg-[#007AFF]/10 dark:bg-[#0A84FF]/15 text-[#007AFF] dark:text-[#0A84FF]'
              : 'text-[#6C6C70] dark:text-[#8E8E93] hover:bg-black/[0.04] dark:hover:bg-[#2C2C2E] hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-current={activeTab === 'debts' ? 'page' : undefined}
        >
          <div className="flex items-center gap-2.5">
            <HandCoins className="w-4 h-4" aria-hidden="true" />
            <span>Catat Utang</span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-black/[0.06] dark:bg-[#2C2C2E] text-slate-700 dark:text-slate-300 font-mono">
            {debts.length}
          </span>
        </button>
      </nav>
    </aside>
  );
}
