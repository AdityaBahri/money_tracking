'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Wallet, WalletType } from '@/types/finance';
import { formatRupiah, formatWalletTypeName } from '@/lib/formatters';
import {
  Building2,
  Smartphone,
  Banknote,
  Plus,
  Pencil,
  Trash2,
  CreditCard,
  Wallet as WalletIcon,
} from 'lucide-react';

function getWalletIcon(type: WalletType) {
  switch (type) {
    case 'bank':
      return Building2;
    case 'ewallet':
      return Smartphone;
    case 'cash':
      return Banknote;
    default:
      return CreditCard;
  }
}

export function WalletList() {
  const { wallets, setIsAddWalletOpen, setEditingWallet, deleteWallet } = useFinance();

  const handleEdit = (wallet: Wallet) => {
    setEditingWallet(wallet);
    setIsAddWalletOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Hapus dompet "${name}"? Seluruh riwayat transaksi terkait dompet ini juga akan terhapus.`)) {
      await deleteWallet(id);
    }
  };

  return (
    <section className="mb-8" aria-label="Daftar Dompet">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Daftar Dompet &amp; Rekening
          </h2>
          <p className="text-xs text-[#6C6C70] dark:text-[#8E8E93]">
            Kelola saldo perbankan, dompet digital, dan kas tunai Anda
          </p>
        </div>
        {wallets.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setEditingWallet(null);
              setIsAddWalletOpen(true);
            }}
            className="apple-button tap-target px-3.5 py-1.5 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#1C1C1E] hover:bg-black/[0.04] dark:hover:bg-[#2C2C2E] text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#007AFF] dark:text-[#0A84FF]" aria-hidden="true" />
            <span>Tambah Dompet</span>
          </button>
        )}
      </div>

      {wallets.length === 0 ? (
        <div className="p-8 rounded-3xl border border-dashed border-black/10 dark:border-white/10 bg-white dark:bg-[#1C1C1E] text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-black/[0.04] dark:bg-[#2C2C2E] text-[#6C6C70] dark:text-[#8E8E93] mx-auto flex items-center justify-center mb-3">
            <WalletIcon className="w-6 h-6" aria-hidden="true" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Belum Ada Dompet Terdaftar
          </h3>
          <p className="text-xs text-[#6C6C70] dark:text-[#8E8E93] leading-relaxed mb-5">
            Daftarkan rekening bank, e-wallet, atau kas tunai Anda agar seluruh mutasi dan saldo terkumpul rapi di dashboard.
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingWallet(null);
              setIsAddWalletOpen(true);
            }}
            className="apple-button tap-target px-5 py-2.5 rounded-2xl bg-[#007AFF] hover:bg-[#0071E3] dark:bg-[#0A84FF] text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Tambah Dompet Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wallets.map((wallet) => {
            const Icon = getWalletIcon(wallet.type);

            return (
              <div
                key={wallet.id}
                className="p-5 rounded-3xl border border-black/[0.04] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs hover:border-black/10 dark:hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#F2F2F7] dark:bg-[#2C2C2E] flex items-center justify-center text-slate-700 dark:text-slate-300">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate max-w-[150px]">
                          {wallet.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-black/[0.05] dark:bg-[#2C2C2E] text-slate-600 dark:text-slate-400">
                            {formatWalletTypeName(wallet.type)}
                          </span>
                          {wallet.account_number && (
                            <span className="text-[11px] text-[#6C6C70] dark:text-[#8E8E93] font-mono">
                              {wallet.account_number}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(wallet)}
                        className="apple-button tap-target p-1.5 rounded-xl text-[#8E8E93] hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-[#2C2C2E] transition-colors"
                        title="Edit dompet"
                        aria-label={`Edit dompet ${wallet.name}`}
                      >
                        <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(wallet.id, wallet.name)}
                        className="apple-button tap-target p-1.5 rounded-xl text-[#8E8E93] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Hapus dompet"
                        aria-label={`Hapus dompet ${wallet.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/[0.05] dark:border-white/[0.08]">
                    <span className="text-[11px] text-[#6C6C70] dark:text-[#8E8E93] block mb-0.5">
                      Saldo Saat Ini
                    </span>
                    <div className="text-xl font-bold text-slate-900 dark:text-white">
                      {formatRupiah(wallet.balance)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setEditingWallet(null);
              setIsAddWalletOpen(true);
            }}
            className="apple-button p-6 rounded-3xl border-2 border-dashed border-black/10 dark:border-white/10 hover:border-[#007AFF] dark:hover:border-[#0A84FF] bg-black/[0.01] dark:bg-white/[0.02] flex flex-col items-center justify-center text-center transition-all group min-h-[140px]"
          >
            <div className="w-10 h-10 rounded-full bg-black/[0.05] dark:bg-[#2C2C2E] group-hover:bg-[#007AFF]/15 text-[#6C6C70] dark:text-[#8E8E93] group-hover:text-[#007AFF] dark:group-hover:text-[#0A84FF] flex items-center justify-center transition-colors mb-2">
              <Plus className="w-5 h-5" aria-hidden="true" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-[#007AFF] dark:group-hover:text-[#0A84FF] transition-colors">
              Tambah Dompet Baru
            </span>
          </button>
        </div>
      )}
    </section>
  );
}
