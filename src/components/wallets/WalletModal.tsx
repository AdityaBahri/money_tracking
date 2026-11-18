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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wallet-modal-title"
    >
      <div className="w-full max-w-md bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-black/[0.05] dark:border-white/[0.08]">
          <div>
            <h2 id="wallet-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
              {editingWallet ? 'Edit Dompet' : 'Tambah Dompet Baru'}
            </h2>
            <p className="text-xs text-[#6C6C70] dark:text-[#8E8E93] mt-0.5">
              Hubungkan rekening bank, e-wallet, atau pos uang tunai
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="apple-button tap-target p-2 rounded-2xl text-[#8E8E93] hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-[#2C2C2E] transition-colors"
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
                    className="apple-button tap-target px-3 py-1 text-[11px] font-medium rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.03] dark:bg-[#2C2C2E] hover:bg-[#007AFF]/10 hover:border-[#007AFF] text-slate-700 dark:text-slate-300 transition-colors"
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
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-[#2C2C2E]/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF]"
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
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-[#2C2C2E]/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF]"
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
              <span className="text-xs font-bold text-[#007AFF] dark:text-[#0A84FF]">
                {formatRupiah(numericValue)}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8E8E93]">
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
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-[#2C2C2E]/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] font-mono"
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
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-[#2C2C2E]/60 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] font-mono"
            />
          </div>

          {/* Buttons */}
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
              disabled={isSubmitting || !name.trim()}
              className="apple-button tap-target px-5 py-2 text-xs font-semibold text-white bg-[#007AFF] hover:bg-[#0071E3] dark:bg-[#0A84FF] rounded-2xl transition-all disabled:opacity-50 shadow-xs"
            >
              {isSubmitting ? 'Menyimpan...' : editingWallet ? 'Simpan Perubahan' : 'Tambah Dompet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
