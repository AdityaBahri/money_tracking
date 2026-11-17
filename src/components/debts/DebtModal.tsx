'use client';

import React, { useState, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { DebtType } from '@/types/finance';
import { formatRupiah, parseNumericInput } from '@/lib/formatters';
import { X, HandCoins, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export function DebtModal() {
  const {
    isAddDebtOpen,
    setIsAddDebtOpen,
    editingDebt,
    setEditingDebt,
    addDebt,
    updateDebt,
    wallets,
  } = useFinance();

  const [type, setType] = useState<DebtType>(editingDebt?.type || 'payable');
  const [personName, setPersonName] = useState(editingDebt?.person_name || '');
  const [amountInput, setAmountInput] = useState(editingDebt ? editingDebt.amount.toString() : '');
  const [dueDate, setDueDate] = useState(editingDebt?.due_date || '');
  const [description, setDescription] = useState(editingDebt?.description || '');
  const [walletId, setWalletId] = useState(editingDebt?.wallet_id || wallets[0]?.id || '');
  const [updateWalletBalance, setUpdateWalletBalance] = useState(!editingDebt);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = React.useCallback(() => {
    setIsAddDebtOpen(false);
    setEditingDebt(null);
  }, [setIsAddDebtOpen, setEditingDebt]);

  // Handle ESC key (R-32)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAddDebtOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddDebtOpen, handleClose]);

  if (!isAddDebtOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseNumericInput(amountInput);
    if (!personName.trim() || amount <= 0) return;

    setIsSubmitting(true);
    try {
      if (editingDebt) {
        await updateDebt(editingDebt.id, {
          type,
          person_name: personName.trim(),
          amount,
          due_date: dueDate || undefined,
          description: description.trim() || undefined,
          wallet_id: walletId || undefined,
        });
      } else {
        await addDebt({
          type,
          person_name: personName.trim(),
          amount,
          due_date: dueDate || undefined,
          description: description.trim() || undefined,
          wallet_id: walletId || undefined,
          updateWalletBalance,
        });
      }
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
      aria-labelledby="debt-modal-title"
    >
      <div className="w-full max-w-lg bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <HandCoins className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="debt-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                {editingDebt ? 'Edit Catatan Utang / Piutang' : 'Catat Utang / Piutang Baru'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kelola kewajiban utang atau piutang yang perlu ditagih
              </p>
            </div>
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

        {/* Tipe Selector: Utang Saya vs Piutang */}
        <div className="p-5 pb-0">
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={type === 'payable'}
              onClick={() => setType('payable')}
              className={`tap-target py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                type === 'payable'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" aria-hidden="true" />
              <span>Utang Saya (Perlu Dibayar)</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={type === 'receivable'}
              onClick={() => setType('receivable')}
              className={`tap-target py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                type === 'receivable'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              <span>Piutang Saya (Perlu Ditagih)</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Nama Pihak / Peminjam */}
          <div>
            <label htmlFor="debt-person" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {type === 'payable' ? 'Nama Pemberi Pinjaman / Kreditur' : 'Nama Peminjam / Kontak'}
            </label>
            <input
              id="debt-person"
              type="text"
              required
              placeholder="Contoh: Budi Santoso, Toko Sumber Makmur"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Nominal Pinjaman */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="debt-amount" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nominal Pinjaman
              </label>
              <span className={`text-xs font-bold ${type === 'payable' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {formatRupiah(numericAmount)}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                Rp
              </span>
              <input
                id="debt-amount"
                type="text"
                required
                inputMode="numeric"
                placeholder="0"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-base font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Tanggal Jatuh Tempo */}
          <div>
            <label htmlFor="debt-due" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tanggal Jatuh Tempo (Opsional)
            </label>
            <input
              id="debt-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Catatan / Keterangan */}
          <div>
            <label htmlFor="debt-desc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Catatan / Keperluan Pinjaman
            </label>
            <input
              id="debt-desc"
              type="text"
              placeholder="Contoh: Talangan servis kendaraan, Belanja modal kerja"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Opsi Sinkronisasi Saldo Dompet (hanya untuk penambahan baru) */}
          {!editingDebt && wallets.length > 0 && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2.5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={updateWalletBalance}
                  onChange={(e) => setUpdateWalletBalance(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300">
                  {type === 'payable'
                    ? 'Tambahkan uang pinjaman ini ke saldo dompet sekarang (sebagai pemasukan kas)'
                    : 'Potongkan uang pinjaman ini dari saldo dompet sekarang (sebagai pengeluaran kas)'}
                </span>
              </label>

              {updateWalletBalance && (
                <div>
                  <label htmlFor="debt-wallet" className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Pilih Dompet Rekening
                  </label>
                  <select
                    id="debt-wallet"
                    value={walletId}
                    onChange={(e) => setWalletId(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {wallets.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({formatRupiah(w.balance)})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

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
              disabled={isSubmitting || numericAmount <= 0 || !personName.trim()}
              className="tap-target px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : editingDebt ? 'Simpan Perubahan' : 'Catat Pinjaman'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
