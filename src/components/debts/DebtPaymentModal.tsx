'use client';

import React, { useState, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { formatRupiah, parseNumericInput } from '@/lib/formatters';
import { X, CheckCircle, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export function DebtPaymentModal() {
  const {
    isDebtPaymentOpen,
    setIsDebtPaymentOpen,
    selectedDebtForPayment,
    setSelectedDebtForPayment,
    recordDebtPayment,
    wallets,
  } = useFinance();

  const [paymentInput, setPaymentInput] = useState('');
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = React.useCallback(() => {
    setIsDebtPaymentOpen(false);
    setSelectedDebtForPayment(null);
    setPaymentInput('');
  }, [setIsDebtPaymentOpen, setSelectedDebtForPayment]);

  // Handle ESC key (R-32)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDebtPaymentOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDebtPaymentOpen, handleClose]);

  if (!isDebtPaymentOpen || !selectedDebtForPayment) return null;

  const debt = selectedDebtForPayment;
  const isPayable = debt.type === 'payable';
  const remaining = Math.max(0, Number(debt.amount) - (Number(debt.paid_amount) || 0));
  const numericPayment = parseNumericInput(paymentInput);

  const handleFullRepayment = () => {
    setPaymentInput(remaining.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (numericPayment <= 0 || numericPayment > remaining) return;

    setIsSubmitting(true);
    try {
      await recordDebtPayment(debt.id, numericPayment, walletId || undefined);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div className="w-full max-w-md bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 id="payment-modal-title" className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {isPayable ? (
                <>
                  <ArrowDownLeft className="w-5 h-5 text-rose-600 dark:text-rose-400" aria-hidden="true" />
                  <span>Bayar / Cicil Utang</span>
                </>
              ) : (
                <>
                  <ArrowUpRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span>Catat Pelunasan Piutang</span>
                </>
              )}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isPayable
                ? `Pembayaran kepada ${debt.person_name}`
                : `Penerimaan uang dari ${debt.person_name}`}
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

        {/* Ringkasan Utang */}
        <div className="p-5 pb-0">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Total Pinjaman:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {formatRupiah(debt.amount)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Sudah Terbayar:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {formatRupiah(debt.paid_amount || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-700 font-bold">
              <span className="text-slate-900 dark:text-white">Sisa Yang Harus Dibayar:</span>
              <span className={isPayable ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                {formatRupiah(remaining)}
              </span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Nominal Pembayaran */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="pay-amount" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nominal Yang Dibayarkan
              </label>
              <button
                type="button"
                onClick={handleFullRepayment}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Lunasi Penuh ({formatRupiah(remaining)})
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                Rp
              </span>
              <input
                id="pay-amount"
                type="text"
                required
                inputMode="numeric"
                autoFocus
                placeholder="0"
                value={paymentInput}
                onChange={(e) => setPaymentInput(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-base font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Dompet Terkait */}
          {wallets.length > 0 && (
            <div>
              <label htmlFor="pay-wallet" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isPayable ? 'Potong Dari Dompet' : 'Masuk Ke Dompet'}
              </label>
              <select
                id="pay-wallet"
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({formatRupiah(w.balance)})
                  </option>
                ))}
              </select>
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
              disabled={isSubmitting || numericPayment <= 0 || numericPayment > remaining}
              className="tap-target px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" aria-hidden="true" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Konfirmasi Pembayaran'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

