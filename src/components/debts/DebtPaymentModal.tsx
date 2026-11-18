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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div className="w-full max-w-md bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-black/[0.05] dark:border-white/[0.08]">
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
            <p className="text-xs text-[#6C6C70] dark:text-[#8E8E93] mt-0.5">
              {isPayable
                ? `Pembayaran kepada ${debt.person_name}`
                : `Penerimaan uang dari ${debt.person_name}`}
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

        {/* Ringkasan Utang */}
        <div className="p-5 pb-0">
          <div className="p-4 rounded-2xl bg-[#F2F2F7] dark:bg-[#2C2C2E]/60 border border-black/[0.04] dark:border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6C6C70] dark:text-[#8E8E93]">Total Pinjaman:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {formatRupiah(debt.amount)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6C6C70] dark:text-[#8E8E93]">Sudah Terbayar:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {formatRupiah(debt.paid_amount || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-black/[0.06] dark:border-white/[0.08] font-bold">
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
                className="text-[11px] font-bold text-[#007AFF] dark:text-[#0A84FF] hover:underline"
              >
                Lunasi Penuh ({formatRupiah(remaining)})
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#8E8E93]">
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
                className="w-full pl-10 pr-3.5 py-2.5 text-base font-bold rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-[#2C2C2E]/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] font-mono"
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
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-[#2C2C2E]/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF]"
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
              disabled={isSubmitting || numericPayment <= 0 || numericPayment > remaining}
              className="apple-button tap-target px-5 py-2 text-xs font-semibold text-white bg-[#007AFF] hover:bg-[#0071E3] dark:bg-[#0A84FF] rounded-2xl transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
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

