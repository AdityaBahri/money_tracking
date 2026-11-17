'use client';

import React, { useState, useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Debt, DebtType } from '@/types/finance';
import { formatRupiah, formatTanggalIndo } from '@/lib/formatters';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  HandCoins,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Search,
  Calendar,
  CheckCircle2,
  Pencil,
  Trash2,
  DollarSign,
} from 'lucide-react';

export function DebtList() {
  const {
    debts,
    totalPayable,
    totalReceivable,
    setIsAddDebtOpen,
    setIsDebtPaymentOpen,
    setSelectedDebtForPayment,
    setEditingDebt,
    deleteDebt,
  } = useFinance();

  const [filterType, setFilterType] = useState<'all' | DebtType | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDebts = useMemo(() => {
    return debts.filter((d) => {
      if (filterType === 'paid' && d.status !== 'paid') return false;
      if (filterType === 'payable' && (d.type !== 'payable' || d.status === 'paid')) return false;
      if (filterType === 'receivable' && (d.type !== 'receivable' || d.status === 'paid')) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = d.person_name.toLowerCase().includes(query);
        const matchDesc = d.description?.toLowerCase().includes(query);
        if (!matchName && !matchDesc) return false;
      }
      return true;
    });
  }, [debts, filterType, searchQuery]);

  const handleOpenPayment = (debt: Debt) => {
    setSelectedDebtForPayment(debt);
    setIsDebtPaymentOpen(true);
  };

  const handleEdit = (debt: Debt) => {
    setEditingDebt(debt);
    setIsAddDebtOpen(true);
  };

  const handleDelete = async (debt: Debt) => {
    if (confirm(`Hapus catatan pinjaman dengan "${debt.person_name}"?`)) {
      await deleteDebt(debt.id);
    }
  };

  return (
    <section aria-label="Daftar Utang dan Piutang">
      {/* Header & Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HandCoins className="w-5 h-5 text-amber-500" aria-hidden="true" />
            <span>Catatan Utang & Piutang</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pantau kewajiban pinjaman yang harus Anda bayar dan piutang yang perlu ditagih
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingDebt(null);
            setIsAddDebtOpen(true);
          }}
          className="tap-target px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
          <span>Tambah Pinjaman</span>
        </button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Utang Saya */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2A] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
              <ArrowDownLeft className="w-4 h-4" aria-hidden="true" />
              <span>Total Utang Saya (Kewajiban)</span>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              Perlu Dibayar
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {formatRupiah(totalPayable)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Uang yang Anda pinjam dari orang lain dan belum lunas
          </p>
        </div>

        {/* Piutang Saya */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2A] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              <span>Total Piutang Saya (Aset Tagihan)</span>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Perlu Ditagih
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {formatRupiah(totalReceivable)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Uang yang dipinjam orang lain dari Anda dan belum dikembalikan
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2A] mb-5 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Cari nama orang atau catatan pinjaman..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={filterType === 'all'}
            onClick={() => setFilterType('all')}
            className={`tap-target px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterType === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Semua ({debts.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filterType === 'payable'}
            onClick={() => setFilterType('payable')}
            className={`tap-target px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
              filterType === 'payable'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Utang Saya</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filterType === 'receivable'}
            onClick={() => setFilterType('receivable')}
            className={`tap-target px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
              filterType === 'receivable'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Piutang Saya</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filterType === 'paid'}
            onClick={() => setFilterType('paid')}
            className={`tap-target px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
              filterType === 'paid'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Sudah Lunas</span>
          </button>
        </div>
      </div>

      {/* Debt Cards List */}
      {filteredDebts.length === 0 ? (
        <EmptyState
          icon={HandCoins}
          title="Belum Ada Catatan Pinjaman"
          description={
            searchQuery || filterType !== 'all'
              ? 'Tidak ada data utang/piutang yang sesuai dengan filter pencarian Anda.'
              : 'Catat utang yang perlu Anda bayar atau piutang yang Anda pinjamkan ke kerabat.'
          }
          actionText="Tambah Catatan Pinjaman"
          onAction={() => {
            setEditingDebt(null);
            setIsAddDebtOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDebts.map((debt) => {
            const isPayable = debt.type === 'payable';
            const isPaid = debt.status === 'paid';
            const remaining = Math.max(0, Number(debt.amount) - (Number(debt.paid_amount) || 0));
            const progressPercent = Math.min(
              100,
              Math.round(((Number(debt.paid_amount) || 0) / Number(debt.amount)) * 100)
            );

            return (
              <div
                key={debt.id}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2A] shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Type & Status Badges */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                          isPayable
                            ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                            : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        }`}
                      >
                        {isPayable ? (
                          <>
                            <ArrowDownLeft className="w-3 h-3" aria-hidden="true" />
                            <span>Utang Saya</span>
                          </>
                        ) : (
                          <>
                            <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                            <span>Piutang Saya</span>
                          </>
                        )}
                      </span>

                      {isPaid ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          Lunas
                        </span>
                      ) : debt.status === 'partial' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                          Sebagian ({progressPercent}%)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                          Belum Dibayar
                        </span>
                      )}
                    </div>

                    {/* Actions: Edit & Delete */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(debt)}
                        className="tap-target p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit catatan pinjaman"
                        aria-label={`Edit pinjaman dengan ${debt.person_name}`}
                      >
                        <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(debt)}
                        className="tap-target p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Hapus catatan pinjaman"
                        aria-label={`Hapus pinjaman dengan ${debt.person_name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {/* Person Name & Description */}
                  <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
                    {debt.person_name}
                  </h3>
                  {debt.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                      {debt.description}
                    </p>
                  )}

                  {/* Due Date Indicator */}
                  {debt.due_date && (
                    <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                      <span>Jatuh tempo: {formatTanggalIndo(debt.due_date)}</span>
                    </div>
                  )}

                  {/* Progress Bar & Amount Summary */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-500 dark:text-slate-400">
                        {isPaid ? 'Total Terlunasi' : 'Sisa Tagihan / Pembayaran'}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {isPaid ? formatRupiah(debt.amount) : formatRupiah(remaining)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          isPaid
                            ? 'bg-slate-400 dark:bg-slate-600'
                            : isPayable
                            ? 'bg-rose-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
                      <span>Terbayar: {formatRupiah(debt.paid_amount || 0)}</span>
                      <span>Total: {formatRupiah(debt.amount)}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action: Bayar / Catat Pelunasan */}
                {!isPaid && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => handleOpenPayment(debt)}
                      className={`tap-target px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                        isPayable
                          ? 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      <DollarSign className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{isPayable ? 'Bayar / Cicil Utang' : 'Catat Pelunasan'}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
