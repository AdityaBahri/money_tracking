'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { formatRupiah } from '@/lib/formatters';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PlusCircle,
  ScanLine,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';

export function BalanceOverview() {
  const {
    totalBalance,
    totalIncomeThisMonth,
    totalExpenseThisMonth,
    totalPayable,
    totalReceivable,
    wallets,
    setIsAddTxOpen,
    setIsScannerOpen,
    setIsAddWalletOpen,
    setActiveTab,
  } = useFinance();

  const netCashflow = totalIncomeThisMonth - totalExpenseThisMonth;

  return (
    <section className="mb-8" aria-label="Ringkasan Total Saldo dan Keuangan">
      {/* Kartu Utama: Total Saldo Semua Dompet */}
      <div className="rounded-2xl p-6 sm:p-8 bg-slate-900 text-white dark:bg-[#131B2A] border border-slate-800 shadow-md relative overflow-hidden">
        {/* Subtle geometric pattern accent */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Wallet className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              <span>Total Uang Dari Semua Dompet</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">
              {formatRupiah(totalBalance)}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Akumulasi saldo riil dari {wallets.length} dompet (rekening bank, e-wallet, dan uang tunai)
            </p>
          </div>

          {/* Quick Actions Desktop & Mobile */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddTxOpen(true)}
              className="tap-target px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4" aria-hidden="true" />
              <span>Catat Transaksi</span>
            </button>
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="tap-target px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <ScanLine className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              <span>Scan Struk</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddWalletOpen(true)}
              className="tap-target px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors"
              title="Tambah akun dompet baru"
            >
              + Dompet
            </button>
          </div>
        </div>

        {/* Breakdown Row: Pemasukan & Pengeluaran Bulan Ini */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          {/* Pemasukan */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 flex items-center justify-center flex-shrink-0">
              <ArrowDownLeft className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 block">
                Pemasukan Bulan Ini
              </span>
              <span className="text-sm sm:text-base font-bold text-emerald-400">
                {formatRupiah(totalIncomeThisMonth)}
              </span>
            </div>
          </div>

          {/* Pengeluaran */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-950/80 text-rose-400 border border-rose-800/60 flex items-center justify-center flex-shrink-0">
              <ArrowUpRight className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 block">
                Pengeluaran Bulan Ini
              </span>
              <span className="text-sm sm:text-base font-bold text-rose-400">
                {formatRupiah(totalExpenseThisMonth)}
              </span>
            </div>
          </div>

          {/* Arus Kas Bersih */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${
              netCashflow >= 0
                ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800/60'
                : 'bg-rose-950/50 text-rose-400 border-rose-800/60'
            }`}>
              {netCashflow >= 0 ? (
                <TrendingUp className="w-5 h-5" aria-hidden="true" />
              ) : (
                <TrendingDown className="w-5 h-5" aria-hidden="true" />
              )}
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 block">
                Arus Kas Bersih
              </span>
              <span className={`text-sm sm:text-base font-bold ${
                netCashflow >= 0 ? 'text-slate-100' : 'text-rose-400'
              }`}>
                {netCashflow >= 0 ? `+${formatRupiah(netCashflow)}` : formatRupiah(netCashflow)}
              </span>
            </div>
          </div>
        </div>

        {/* Utang & Piutang Quick Info Bar */}
        {(totalPayable > 0 || totalReceivable > 0) && (
          <div className="mt-5 pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4 text-slate-300">
              {totalPayable > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" aria-hidden="true" />
                  <span className="text-slate-400">Utang yang harus dibayar:</span>
                  <span className="font-bold text-rose-400">{formatRupiah(totalPayable)}</span>
                </div>
              )}
              {totalReceivable > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                  <span className="text-slate-400">Piutang yang harus ditagih:</span>
                  <span className="font-bold text-emerald-400">{formatRupiah(totalReceivable)}</span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('debts')}
              className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 underline"
            >
              Kelola Utang &amp; Piutang
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

