'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { LayoutDashboard, Wallet, ReceiptText, ScanLine, Plus } from 'lucide-react';

export function BottomNav() {
  const { activeTab, setActiveTab, setIsAddTxOpen, setIsScannerOpen } = useFinance();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#131B2A]/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-md pb-safe"
      aria-label="Navigasi Bawah Mobile"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {/* Dashboard */}
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`tap-target flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'dashboard'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          aria-current={activeTab === 'dashboard' ? 'page' : undefined}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" aria-hidden="true" />
          <span className="text-[11px]">Beranda</span>
        </button>

        {/* Dompet */}
        <button
          type="button"
          onClick={() => setActiveTab('wallets')}
          className={`tap-target flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'wallets'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          aria-current={activeTab === 'wallets' ? 'page' : undefined}
        >
          <Wallet className="w-5 h-5 mb-0.5" aria-hidden="true" />
          <span className="text-[11px]">Dompet</span>
        </button>

        {/* Center Action: Plus Transaction */}
        <div className="flex-1 flex justify-center -mt-5">
          <button
            type="button"
            onClick={() => setIsAddTxOpen(true)}
            className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 active:scale-95 transition-transform focus:ring-4 focus:ring-emerald-500/30"
            aria-label="Tambah transaksi baru"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" aria-hidden="true" />
          </button>
        </div>

        {/* Pindai Struk */}
        <button
          type="button"
          onClick={() => setIsScannerOpen(true)}
          className={`tap-target flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'scanner'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          aria-label="Pindai struk belanja dengan kamera atau unggah foto"
        >
          <ScanLine className="w-5 h-5 mb-0.5" aria-hidden="true" />
          <span className="text-[11px]">Scan Struk</span>
        </button>

        {/* Riwayat */}
        <button
          type="button"
          onClick={() => setActiveTab('transactions')}
          className={`tap-target flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'transactions'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
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
