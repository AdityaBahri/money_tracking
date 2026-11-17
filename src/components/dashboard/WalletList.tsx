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
            Daftar Dompet & Rekening
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola saldo perbankan, dompet digital, dan kas tunai Anda
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingWallet(null);
            setIsAddWalletOpen(true);
          }}
          className="tap-target px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <span>Tambah Dompet</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.map((wallet) => {
          const Icon = getWalletIcon(wallet.type);

          return (
            <div
              key={wallet.id}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2A] shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate max-w-[150px]">
                        {wallet.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {formatWalletTypeName(wallet.type)}
                        </span>
                        {wallet.account_number && (
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                            {wallet.account_number}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Menu buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(wallet)}
                      className="tap-target p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit dompet"
                      aria-label={`Edit dompet ${wallet.name}`}
                    >
                      <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(wallet.id, wallet.name)}
                      className="tap-target p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Hapus dompet"
                      aria-label={`Hapus dompet ${wallet.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
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

        {/* Kartu Tombol Tambah Dompet */}
        <button
          type="button"
          onClick={() => {
            setEditingWallet(null);
            setIsAddWalletOpen(true);
          }}
          className="p-6 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col items-center justify-center text-center transition-colors group min-h-[140px]"
        >
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/70 text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex items-center justify-center transition-colors mb-2">
            <Plus className="w-5 h-5" aria-hidden="true" />
          </div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            Tambah Dompet Baru
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            BCA, Mandiri, GoPay, OVO, atau Tunai
          </span>
        </button>
      </div>
    </section>
  );
}

