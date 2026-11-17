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
  Plus,
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

  if (wallets.length === 0) {
    return (
      <section className="mb-8" aria-label="Panduan Awal Menambahkan Dompet">
        <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 text-xs font-semibold mb-3">
              <Wallet className="w-4 h-4" aria-hidden="true" />
              <span>Mulai Dari Nol</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Belum Ada Dompet Terdaftar
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Tambahkan akun dompet pertama Anda (misalnya rekening BCA, Mandiri, e-wallet GoPay, atau kas uang tunai) beserta saldo awalnya untuk mulai mencatat keuangan secara mandiri.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAddWalletOpen(true)}
                className="tap-target px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Tambah Dompet Pertama</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8" aria-label="Ringkasan Total Saldo dan Keuangan">
      <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Wallet className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span>Total Uang Dari Semua Dompet</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1" suppressHydrationWarning>
              {formatRupiah(totalBalance)}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2" suppressHydrationWarning>
              Akumulasi saldo riil dari {wallets.length} dompet aktif
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddTxOpen(true)}
              className="tap-target px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" aria-hidden="true" />
              <span>Catat Transaksi</span>
            </button>
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="tap-target px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <ScanLine className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span>Scan Struk</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddWalletOpen(true)}
              className="tap-target px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors"
              title="Tambah akun dompet baru"
            >
              + Dompet
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center flex-shrink-0">
              <ArrowDownLeft className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                Pemasukan Bulan Ini
              </span>
              <span className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">
                {formatRupiah(totalIncomeThisMonth)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 flex items-center justify-center flex-shrink-0">
              <ArrowUpRight className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                Pengeluaran Bulan Ini
              </span>
              <span className="text-sm sm:text-base font-bold text-rose-600 dark:text-rose-400">
                {formatRupiah(totalExpenseThisMonth)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${
              netCashflow >= 0
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
                : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60'
            }`}>
              {netCashflow >= 0 ? (
                <TrendingUp className="w-5 h-5" aria-hidden="true" />
              ) : (
                <TrendingDown className="w-5 h-5" aria-hidden="true" />
              )}
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                Arus Kas Bersih
              </span>
              <span className={`text-sm sm:text-base font-bold ${
                netCashflow >= 0 ? 'text-slate-900 dark:text-slate-100' : 'text-rose-600 dark:text-rose-400'
              }`}>
                {netCashflow >= 0 ? `+${formatRupiah(netCashflow)}` : formatRupiah(netCashflow)}
              </span>
            </div>
          </div>
        </div>

        {(totalPayable > 0 || totalReceivable > 0) && (
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-300">
              {totalPayable > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" aria-hidden="true" />
                  <span className="text-slate-500 dark:text-slate-400">Utang yang harus dibayar:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">{formatRupiah(totalPayable)}</span>
                </div>
              )}
              {totalReceivable > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                  <span className="text-slate-500 dark:text-slate-400">Piutang yang harus ditagih:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatRupiah(totalReceivable)}</span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('debts')}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Kelola Utang &amp; Piutang
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
