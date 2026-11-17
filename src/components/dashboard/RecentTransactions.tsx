'use client';

import React, { useState, useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { TransactionType } from '@/types/finance';
import { formatRupiah, formatTanggalIndo } from '@/lib/formatters';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  ScanLine,
  Trash2,
  Receipt,
  Tag,
} from 'lucide-react';

export function RecentTransactions({ limit }: { limit?: number }) {
  const { transactions, wallets, deleteTransaction, setIsAddTxOpen, setIsScannerOpen } = useFinance();

  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [walletFilter, setWalletFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (typeFilter !== 'all' && t.type !== typeFilter) {
        return false;
      }
      if (walletFilter !== 'all' && t.wallet_id !== walletFilter && t.target_wallet_id !== walletFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchDesc = t.description.toLowerCase().includes(query);
        const matchCat = t.category_name.toLowerCase().includes(query);
        const matchMerchant = t.receipt_data?.merchant?.toLowerCase().includes(query);
        if (!matchDesc && !matchCat && !matchMerchant) {
          return false;
        }
      }
      return true;
    });
  }, [transactions, typeFilter, walletFilter, searchQuery]);

  const displayedTransactions = limit ? filtered.slice(0, limit) : filtered;

  const getWalletName = (id: string) => {
    const w = wallets.find((item) => item.id === id);
    return w ? w.name : 'Dompet';
  };

  return (
    <section aria-label="Riwayat Transaksi">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Riwayat Pemasukan & Pengeluaran
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Daftar seluruh mutasi keuangan yang tercatat
          </p>
        </div>

        {/* Action button if empty */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="tap-target px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <ScanLine className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>Pindai Struk</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2A] mb-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Cari transaksi, merchant, atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Wallet Selector Filter */}
          <div className="sm:w-48">
            <select
              value={walletFilter}
              onChange={(e) => setWalletFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Filter berdasarkan dompet"
            >
              <option value="all">Semua Dompet</option>
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tipe Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter jenis transaksi">
          <button
            type="button"
            role="tab"
            aria-selected={typeFilter === 'all'}
            onClick={() => setTypeFilter('all')}
            className={`tap-target px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              typeFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Semua ({transactions.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={typeFilter === 'expense'}
            onClick={() => setTypeFilter('expense')}
            className={`tap-target px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              typeFilter === 'expense'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Pengeluaran</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={typeFilter === 'income'}
            onClick={() => setTypeFilter('income')}
            className={`tap-target px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              typeFilter === 'income'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Pemasukan</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={typeFilter === 'transfer'}
            onClick={() => setTypeFilter('transfer')}
            className={`tap-target px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              typeFilter === 'transfer'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Transfer Antar Dompet</span>
          </button>
        </div>
      </div>

      {/* Transaction List */}
      {displayedTransactions.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Belum Ada Transaksi"
          description={
            searchQuery || typeFilter !== 'all' || walletFilter !== 'all'
              ? 'Tidak ada transaksi yang cocok dengan filter yang Anda pilih.'
              : 'Mulai dengan mencatat pemasukan, pengeluaran, atau memindai struk belanja fisik Anda.'
          }
          actionText="Tambah Transaksi Sekarang"
          onAction={() => setIsAddTxOpen(true)}
        />
      ) : (
        <div className="space-y-2">
          {displayedTransactions.map((tx) => {
            const isExpense = tx.type === 'expense';
            const isIncome = tx.type === 'income';
            const isTransfer = tx.type === 'transfer';

            return (
              <div
                key={tx.id}
                className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2A] hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex items-center justify-between gap-3"
              >
                {/* Left: Icon & Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isIncome
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                        : isExpense
                        ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60'
                        : 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60'
                    }`}
                  >
                    {isIncome && <ArrowDownLeft className="w-5 h-5" aria-hidden="true" />}
                    {isExpense && <ArrowUpRight className="w-5 h-5" aria-hidden="true" />}
                    {isTransfer && <ArrowRightLeft className="w-5 h-5" aria-hidden="true" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {tx.description}
                      </span>
                      {tx.receipt_data && (
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 flex items-center gap-1 flex-shrink-0"
                          title="Transaksi dideteksi dari hasil pindai struk"
                        >
                          <ScanLine className="w-3 h-3" aria-hidden="true" />
                          <span>Scan</span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3 text-slate-400" aria-hidden="true" />
                        <span>{tx.category_name}</span>
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" aria-hidden="true" />
                      <span className="font-medium text-slate-600 dark:text-slate-300">
                        {isTransfer
                          ? `${getWalletName(tx.wallet_id)} -> ${getWalletName(tx.target_wallet_id || '')}`
                          : getWalletName(tx.wallet_id)}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" aria-hidden="true" />
                      <span>{formatTanggalIndo(tx.transaction_date)}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Delete Action */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <div
                      className={`text-xs sm:text-sm font-bold ${
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : isExpense
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-indigo-600 dark:text-indigo-400'
                      }`}
                    >
                      {isIncome && `+ ${formatRupiah(tx.amount)}`}
                      {isExpense && `- ${formatRupiah(tx.amount)}`}
                      {isTransfer && formatRupiah(tx.amount)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Hapus catatan transaksi "${tx.description}"? Saldo dompet akan disesuaikan kembali.`)) {
                        deleteTransaction(tx.id);
                      }
                    }}
                    className="tap-target p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                    title="Hapus transaksi"
                    aria-label={`Hapus transaksi ${tx.description}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
