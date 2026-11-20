'use client';

import React, { useState, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { TransactionType } from '@/types/finance';
import { formatRupiah, parseNumericInput, getDeviceLocalDate } from '@/lib/formatters';
import { X, ArrowUpRight, ArrowDownLeft, ArrowRightLeft, Wallet, AlertCircle } from 'lucide-react';

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
  const { isAddTxOpen, setIsAddTxOpen, setIsAddWalletOpen, wallets, addTransaction } = useFinance();

  const [type, setType] = useState<TransactionType>('expense');
  const [amountInput, setAmountInput] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState('');
  const [selectedTargetWalletId, setSelectedTargetWalletId] = useState('');
  const walletId = selectedWalletId || wallets[0]?.id || '';
  const targetWalletId = selectedTargetWalletId || wallets[1]?.id || '';
  const [categoryName, setCategoryName] = useState('Makanan & Minuman');
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState(getDeviceLocalDate);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = React.useCallback(() => {
    setIsAddTxOpen(false);
    setAmountInput('');
    setDescription('');
    setTransactionDate(getDeviceLocalDate());
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

  if (wallets.length === 0) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="no-wallet-dialog-title"
      >
        <div className="w-full max-w-md bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-6 text-center shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-3">
            <Wallet className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 id="no-wallet-dialog-title" className="text-base font-bold text-slate-900 dark:text-white">
            Belum Ada Dompet
          </h2>
          <p className="text-xs text-[#6C6C70] dark:text-[#8E8E93] mt-1 mb-6 leading-relaxed">
            Anda harus menambahkan setidaknya satu dompet terlebih dahulu sebelum mencatat pemasukan atau pengeluaran.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="apple-button tap-target px-4 py-2 text-xs font-semibold rounded-2xl border border-black/[0.08] dark:border-white/[0.1] text-slate-700 dark:text-slate-300 hover:bg-black/[0.04] dark:hover:bg-[#2C2C2E] transition-colors"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => {
                handleClose();
                setIsAddWalletOpen(true);
              }}
              className="apple-button tap-target px-4 py-2 text-xs font-semibold rounded-2xl bg-[#007AFF] hover:bg-[#0071E3] dark:bg-[#0A84FF] text-white transition-colors shadow-xs"
            >
              Tambah Dompet Baru
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseNumericInput(amountInput);
    if (amount <= 0 || !walletId) return;

    if (type === 'transfer') {
      if (wallets.length < 2) {
        alert('Fitur transfer memerlukan minimal dua dompet terdaftar.');
        return;
      }
      if (walletId === targetWalletId) {
        alert('Dompet asal dan dompet tujuan tidak boleh sama.');
        return;
      }
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tx-modal-title"
    >
      <div className="w-full max-w-lg bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between p-5 border-b border-black/[0.05] dark:border-white/[0.08]">
          <div>
            <h2 id="tx-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
              Tambah Transaksi Manual
            </h2>
            <p className="text-xs text-[#6C6C70] dark:text-[#8E8E93] mt-0.5">
              Catat pemasukan, pengeluaran, atau mutasi saldo antar dompet
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="apple-button tap-target p-2 rounded-2xl text-[#8E8E93] hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-[#2C2C2E] transition-colors"
            aria-label="Tutup dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-5 pb-0">
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-black/[0.05] dark:bg-[#2C2C2E]" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={type === 'expense'}
              onClick={() => handleTypeChange('expense')}
              className={`apple-button tap-target py-2 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                type === 'expense'
                  ? 'bg-[#FF3B30] dark:bg-[#FF453A] text-white shadow-xs'
                  : 'text-[#6C6C70] dark:text-[#8E8E93] hover:text-slate-900 dark:hover:text-white'
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
              className={`apple-button tap-target py-2 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-[#6C6C70] dark:text-[#8E8E93] hover:text-slate-900 dark:hover:text-white'
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
              className={`apple-button tap-target py-2 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                type === 'transfer'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-[#6C6C70] dark:text-[#8E8E93] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" aria-hidden="true" />
              <span>Transfer</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
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
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#8E8E93]">
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
                className="w-full pl-10 pr-3.5 py-2.5 text-base sm:text-lg font-bold rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-[#2C2C2E]/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] font-mono"
              />
            </div>
          </div>

          {type === 'transfer' && wallets.length < 2 && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span>Transfer saldo memerlukan minimal dua dompet. Tambahkan dompet tujuan terlebih dahulu.</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="tx-wallet" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {type === 'transfer' ? 'Dompet Asal' : type === 'expense' ? 'Potong Dari Dompet' : 'Masuk Ke Dompet'}
              </label>
              <select
                id="tx-wallet"
                value={walletId}
                onChange={(e) => setSelectedWalletId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-[#2C2C2E]/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF]"
              >
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({formatRupiah(w.balance)})
                  </option>
                ))}
              </select>
            </div>

            {type === 'transfer' ? (
              <div>
                <label htmlFor="tx-target-wallet" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dompet Tujuan
                </label>
                <select
                  id="tx-target-wallet"
                  value={targetWalletId}
                  onChange={(e) => setSelectedTargetWalletId(e.target.value)}
                  disabled={wallets.length < 2}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-[#2C2C2E]/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] disabled:opacity-50"
                >
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({formatRupiah(w.balance)})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label htmlFor="tx-category" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kategori
                </label>
                <select
                  id="tx-category"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-[#2C2C2E]/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF]"
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

          <div>
            <label htmlFor="tx-desc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Catatan / Keterangan
            </label>
            <input
              id="tx-desc"
              type="text"
              placeholder={
                type === 'expense'
                  ? 'Contoh: Makan siang, Belanja kebutuhan harian'
                  : type === 'income'
                  ? 'Contoh: Gaji bulanan, Pendapatan proyek lepas'
                  : 'Contoh: Transfer dana antar rekening'
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-[#2C2C2E]/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="tx-date" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Tanggal Transaksi
              </label>
              <span className="text-[11px] text-[#007AFF] dark:text-[#0A84FF] font-medium">
                Otomatis Tanggal Device
              </span>
            </div>
            <input
              id="tx-date"
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-[#2C2C2E]/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-black/[0.05] dark:border-white/[0.08]">
            <button
              type="button"
              onClick={handleClose}
              className="apple-button tap-target px-4 py-2 text-xs font-semibold text-[#6C6C70] dark:text-[#8E8E93] hover:bg-black/[0.04] dark:hover:bg-[#2C2C2E] rounded-2xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || numericAmount <= 0 || (type === 'transfer' && wallets.length < 2)}
              className={`apple-button tap-target px-5 py-2 text-xs font-semibold text-white rounded-2xl transition-all disabled:opacity-50 shadow-xs ${
                type === 'expense'
                  ? 'bg-[#FF3B30] hover:bg-[#D70015] dark:bg-[#FF453A]'
                  : type === 'income'
                  ? 'bg-emerald-600 hover:bg-emerald-500'
                  : 'bg-indigo-600 hover:bg-indigo-500'
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
