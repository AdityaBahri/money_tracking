'use client';

import React, { useState, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { TransactionType } from '@/types/finance';
import { formatRupiah, parseNumericInput } from '@/lib/formatters';
import { X, ArrowUpRight, ArrowDownLeft, ArrowRightLeft } from 'lucide-react';

const EXPENSE_CATEGORIES = [
  'Makanan & Minuman',
  'Belanja Harian',
  'Transportasi',
  'Tagihan & Utilitas',
  'Hiburan',
  'Kesehatan',
  'Pendidikan',
  'Keluarga',
  'Lainnya',
];

const INCOME_CATEGORIES = [
  'Gaji Bulanan',
  'Bonus & Tunjangan',
  'Freelance / Proyek',
  'Hasil Investasi',
  'Hadiah / Hibah',
  'Penjualan Barang',
  'Lainnya',
];

export function TransactionModal() {
  const { isAddTxOpen, setIsAddTxOpen, wallets, addTransaction } = useFinance();

  const [type, setType] = useState<TransactionType>('expense');
  const [amountInput, setAmountInput] = useState('');
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');
  const [targetWalletId, setTargetWalletId] = useState(wallets[1]?.id || '');
  const [categoryName, setCategoryName] = useState('Makanan & Minuman');
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState('2024-11-18');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = React.useCallback(() => {
    setIsAddTxOpen(false);
    setAmountInput('');
    setDescription('');
  }, [setIsAddTxOpen]);

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'expense') {
      setCategoryName('Makanan & Minuman');
    } else if (newType === 'income') {
      setCategoryName('Gaji Bulanan');
    } else {
      setCategoryName('Transfer Saldo');
    }
  };

  // Handle ESC key (R-32)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAddTxOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddTxOpen, handleClose]);

  if (!isAddTxOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseNumericInput(amountInput);
    if (amount <= 0 || !walletId) return;

    if (type === 'transfer' && walletId === targetWalletId) {
      alert('Dompet asal dan dompet tujuan tidak boleh sama.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addTransaction({
        wallet_id: walletId,
        type,
        amount,
        category_name: type === 'transfer' ? 'Transfer Saldo' : categoryName,
        description: description.trim() || (type === 'transfer' ? 'Transfer dana antar dompet' : categoryName),
        transaction_date: transactionDate,
        target_wallet_id: type === 'transfer' ? targetWalletId : undefined,
      });
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const numericAmount = parseNumericInput(amountInput);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tx-modal-title"
    >
      <div className="w-full max-w-lg bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 id="tx-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
              Tambah Transaksi Manual
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Catat pemasukan, pengeluaran harian, atau mutasi saldo antar dompet
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="tap-target p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Tutup dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Transaction Type Segmented Control */}
        <div className="p-5 pb-0">
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={type === 'expense'}
              onClick={() => handleTypeChange('expense')}
              className={`tap-target py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                type === 'expense'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              <span>Pengeluaran</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={type === 'income'}
              onClick={() => handleTypeChange('income')}
              className={`tap-target py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" aria-hidden="true" />
              <span>Pemasukan</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={type === 'transfer'}
              onClick={() => handleTypeChange('transfer')}
              className={`tap-target py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                type === 'transfer'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" aria-hidden="true" />
              <span>Transfer</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Nominal Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="tx-amount" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nominal Transaksi
              </label>
              <span
                className={`text-xs font-bold ${
                  type === 'expense'
                    ? 'text-rose-600 dark:text-rose-400'
                    : type === 'income'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-indigo-600 dark:text-indigo-400'
                }`}
              >
                {formatRupiah(numericAmount)}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                Rp
              </span>
              <input
                id="tx-amount"
                type="text"
                required
                inputMode="numeric"
                autoFocus
                placeholder="0"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 text-base sm:text-lg font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Wallet Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="tx-wallet" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {type === 'transfer' ? 'Dompet Asal' : type === 'expense' ? 'Potong Dari Dompet' : 'Masuk Ke Dompet'}
              </label>
              <select
                id="tx-wallet"
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({formatRupiah(w.balance)})
                  </option>
                ))}
              </select>
            </div>

            {/* Target Wallet if Transfer */}
            {type === 'transfer' ? (
              <div>
                <label htmlFor="tx-target-wallet" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dompet Tujuan
                </label>
                <select
                  id="tx-target-wallet"
                  value={targetWalletId}
                  onChange={(e) => setTargetWalletId(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({formatRupiah(w.balance)})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              /* Kategori */
              <div>
                <label htmlFor="tx-category" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kategori
                </label>
                <select
                  id="tx-category"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {(type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Deskripsi / Catatan */}
          <div>
            <label htmlFor="tx-desc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Catatan / Deskripsi
            </label>
            <input
              id="tx-desc"
              type="text"
              placeholder={
                type === 'expense'
                  ? 'Contoh: Nasi padang siang, Belanja mingguan Indomaret'
                  : type === 'income'
                  ? 'Contoh: Transfer gaji kantor, Hasil freelance website'
                  : 'Contoh: Top up GoPay dari BCA'
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Tanggal Transaksi */}
          <div>
            <label htmlFor="tx-date" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tanggal Transaksi
            </label>
            <input
              id="tx-date"
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleClose}
              className="tap-target px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || numericAmount <= 0}
              className={`tap-target px-5 py-2 text-xs font-semibold text-white rounded-lg transition-colors disabled:opacity-50 ${
                type === 'expense'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : type === 'income'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isSubmitting
                ? 'Menyimpan...'
                : type === 'expense'
                ? 'Simpan Pengeluaran'
                : type === 'income'
                ? 'Simpan Pemasukan'
                : 'Lakukan Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
