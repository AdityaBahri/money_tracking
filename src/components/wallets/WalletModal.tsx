'use client';

import React, { useState, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { WalletType } from '@/types/finance';
import { formatRupiah, parseNumericInput } from '@/lib/formatters';
import { X } from 'lucide-react';

const WALLET_PRESETS = [
  { name: 'BCA', type: 'bank' as WalletType, color: 'blue' },
  { name: 'Bank Mandiri', type: 'bank' as WalletType, color: 'amber' },
  { name: 'BNI', type: 'bank' as WalletType, color: 'orange' },
  { name: 'BRI', type: 'bank' as WalletType, color: 'blue' },
  { name: 'Bank Jago', type: 'bank' as WalletType, color: 'yellow' },
  { name: 'Jenius (BTPN)', type: 'bank' as WalletType, color: 'sky' },
  { name: 'GoPay', type: 'ewallet' as WalletType, color: 'sky' },
  { name: 'OVO', type: 'ewallet' as WalletType, color: 'purple' },
  { name: 'Dana', type: 'ewallet' as WalletType, color: 'blue' },
  { name: 'ShopeePay', type: 'ewallet' as WalletType, color: 'orange' },
  { name: 'Uang Tunai (Cash)', type: 'cash' as WalletType, color: 'emerald' },
];

export function WalletModal() {
  const { isAddWalletOpen, setIsAddWalletOpen, editingWallet, setEditingWallet, addWallet, updateWallet } = useFinance();

  const [name, setName] = useState(editingWallet?.name || '');
  const [type, setType] = useState<WalletType>(editingWallet?.type || 'bank');
  const [balanceInput, setBalanceInput] = useState(editingWallet ? editingWallet.balance.toString() : '0');
  const [accountNumber, setAccountNumber] = useState(editingWallet?.account_number || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = React.useCallback(() => {
    setIsAddWalletOpen(false);
    setEditingWallet(null);
  }, [setIsAddWalletOpen, setEditingWallet]);

  // Handle ESC key to close modal (R-32)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAddWalletOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddWalletOpen, handleClose]);

  if (!isAddWalletOpen) return null;

  const handlePresetSelect = (preset: { name: string; type: WalletType }) => {
    setName(preset.name);
    setType(preset.type);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const balance = parseNumericInput(balanceInput);

    try {
      if (editingWallet) {
        await updateWallet(editingWallet.id, {
          name: name.trim(),
          type,
          balance,
          account_number: accountNumber.trim(),
        });
      } else {
        await addWallet({
          name: name.trim(),
          type,
          balance,
          account_number: accountNumber.trim(),
        });
      }
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const numericValue = parseNumericInput(balanceInput);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wallet-modal-title"
    >
      <div className="w-full max-w-md bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 id="wallet-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
              {editingWallet ? 'Edit Dompet' : 'Tambah Dompet Baru'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Hubungkan rekening bank, e-wallet, atau pos uang tunai
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="tap-target p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Quick Presets if adding new */}
          {!editingWallet && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Pilih Preset Populer
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
                {WALLET_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handlePresetSelect(p)}
                    className="tap-target px-2.5 py-1 text-[11px] font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-500 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Wallet Name */}
          <div>
            <label htmlFor="wallet-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nama Dompet / Rekening
            </label>
            <input
              id="wallet-name"
              type="text"
              required
              placeholder="Contoh: BCA Utama, GoPay Harian"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Wallet Type */}
          <div>
            <label htmlFor="wallet-type" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tipe Dompet
            </label>
            <select
              id="wallet-type"
              value={type}
              onChange={(e) => setType(e.target.value as WalletType)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="bank">Rekening Bank</option>
              <option value="ewallet">E-Wallet / Dompet Digital</option>
              <option value="cash">Uang Tunai (Cash)</option>
              <option value="investment">Investasi / Reksadana / Saham</option>
              <option value="other">Lainnya</option>
            </select>
          </div>

          {/* Balance Input with Live Rupiah Preview */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="wallet-balance" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Saldo {editingWallet ? 'Saat Ini' : 'Awal'}
              </label>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {formatRupiah(numericValue)}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                Rp
              </span>
              <input
                id="wallet-balance"
                type="text"
                required
                inputMode="numeric"
                placeholder="0"
                value={balanceInput}
                onChange={(e) => setBalanceInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Account Number (Optional) */}
          <div>
            <label htmlFor="wallet-account" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nomor Rekening / No. Telepon (Opsional)
            </label>
            <input
              id="wallet-account"
              type="text"
              placeholder="Contoh: 1234567890 atau 0812345678"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          {/* Buttons */}
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
              disabled={isSubmitting || !name.trim()}
              className="tap-target px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : editingWallet ? 'Simpan Perubahan' : 'Tambah Dompet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
