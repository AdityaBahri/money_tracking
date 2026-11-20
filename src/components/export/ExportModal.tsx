'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { TransactionType } from '@/types/finance';
import {
  exportTransactionsToCSV,
  exportFullDataToJSON,
  printFinancialReport,
} from '@/lib/export';
import { formatRupiah, getDeviceLocalDate } from '@/lib/formatters';
import {
  X,
  FileSpreadsheet,
  FileText,
  Database,
  Calendar,
  Filter,
  Download,
  Printer,
  CheckCircle2,
  Wallet as WalletIcon,
} from 'lucide-react';

type DatePreset = 'all' | 'this_month' | 'last_30_days' | 'custom';

export function ExportModal() {
  const {
    isExportOpen,
    setIsExportOpen,
    transactions,
    wallets,
    debts,
    user,
  } = useFinance();

  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [startDate, setStartDate] = useState(getDeviceLocalDate);
  const [endDate, setEndDate] = useState(getDeviceLocalDate);
  const [selectedWalletId, setSelectedWalletId] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | TransactionType>('all');
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingJSON, setIsExportingJSON] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState('');

  const handleClose = React.useCallback(() => {
    setIsExportOpen(false);
    setExportSuccessMessage('');
  }, [setIsExportOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExportOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExportOpen, handleClose]);

  // Filter transaksi berdasarkan kriteria ekspor
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions.filter((t) => {
      // Filter Jenis Transaksi
      if (selectedType !== 'all' && t.type !== selectedType) {
        return false;
      }

      // Filter Dompet
      if (selectedWalletId !== 'all') {
        if (t.wallet_id !== selectedWalletId && t.target_wallet_id !== selectedWalletId) {
          return false;
        }
      }

      // Filter Rentang Tanggal
      if (datePreset === 'this_month') {
        const txDate = new Date(t.transaction_date);
        if (txDate.getMonth() !== currentMonth || txDate.getFullYear() !== currentYear) {
          return false;
        }
      } else if (datePreset === 'last_30_days') {
        const txDate = new Date(t.transaction_date).getTime();
        const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;
        if (txDate < thirtyDaysAgo) {
          return false;
        }
      } else if (datePreset === 'custom') {
        if (startDate && t.transaction_date < startDate) return false;
        if (endDate && t.transaction_date > endDate) return false;
      }

      return true;
    });
  }, [transactions, selectedType, selectedWalletId, datePreset, startDate, endDate]);

  // Ringkasan nominal
  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;
    filteredTransactions.forEach((t) => {
      if (t.type === 'income') income += Number(t.amount) || 0;
      if (t.type === 'expense') expense += Number(t.amount) || 0;
    });
    return {
      count: filteredTransactions.length,
      income,
      expense,
      net: income - expense,
    };
  }, [filteredTransactions]);

  // Label periode untuk laporan
  const periodLabel = useMemo(() => {
    switch (datePreset) {
      case 'this_month':
        return 'Bulan Ini';
      case 'last_30_days':
        return '30 Hari Terakhir';
      case 'custom':
        return `${startDate} s/d ${endDate}`;
      default:
        return 'Semua Waktu';
    }
  }, [datePreset, startDate, endDate]);

  if (!isExportOpen) return null;

  const handleExportCSV = () => {
    setIsExportingCSV(true);
    try {
      exportTransactionsToCSV(filteredTransactions, wallets);
      setExportSuccessMessage('File CSV berhasil diunduh ke perangkat Anda.');
      setTimeout(() => setExportSuccessMessage(''), 4000);
    } finally {
      setIsExportingCSV(false);
    }
  };

  const handlePrintPDF = () => {
    printFinancialReport({
      transactions: filteredTransactions,
      wallets,
      user,
      periodLabel,
    });
  };

  const handleExportJSON = () => {
    setIsExportingJSON(true);
    try {
      exportFullDataToJSON({
        user,
        wallets,
        transactions,
        debts,
      });
      setExportSuccessMessage('Cadangan data JSON berhasil diunduh.');
      setTimeout(() => setExportSuccessMessage(''), 4000);
    } finally {
      setIsExportingJSON(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div className="w-full max-w-xl bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden my-8 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-black/[0.05] dark:border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#007AFF]/10 dark:bg-[#0A84FF]/15 text-[#007AFF] dark:text-[#0A84FF] flex items-center justify-center">
              <Download className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="export-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                Ekspor Catatan Keuangan
              </h2>
              <p className="text-xs text-[#6C6C70] dark:text-[#8E8E93]">
                Unduh rekap transaksi ke Excel/CSV, cetak PDF, atau simpan cadangan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="apple-button tap-target p-2 rounded-2xl text-[#8E8E93] hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-[#2C2C2E] transition-colors"
            aria-label="Tutup modal ekspor"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-5 max-h-[calc(85vh-8rem)] overflow-y-auto">
          {exportSuccessMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>{exportSuccessMessage}</span>
            </div>
          )}

          {/* Filter Periode */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#007AFF] dark:text-[#0A84FF]" aria-hidden="true" />
              <span>Pilih Rentang Waktu</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'all', label: 'Semua Waktu' },
                { id: 'this_month', label: 'Bulan Ini' },
                { id: 'last_30_days', label: '30 Hari Lalu' },
                { id: 'custom', label: 'Kustom' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setDatePreset(p.id as DatePreset)}
                  className={`apple-button tap-target py-2 px-3 text-xs font-semibold rounded-2xl border transition-all text-center ${
                    datePreset === p.id
                      ? 'border-[#007AFF] dark:border-[#0A84FF] bg-[#007AFF]/10 dark:bg-[#0A84FF]/15 text-[#007AFF] dark:text-[#0A84FF]'
                      : 'border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-[#2C2C2E]/60 text-slate-700 dark:text-slate-300 hover:bg-black/[0.04]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {datePreset === 'custom' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 p-3.5 rounded-2xl bg-black/[0.02] dark:bg-[#2C2C2E]/40 border border-black/[0.05] dark:border-white/[0.06]">
                <div>
                  <label htmlFor="export-start-date" className="block text-[11px] font-semibold text-[#6C6C70] dark:text-[#8E8E93] mb-1">
                    Tanggal Mulai
                  </label>
                  <input
                    id="export-start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF]"
                  />
                </div>
                <div>
                  <label htmlFor="export-end-date" className="block text-[11px] font-semibold text-[#6C6C70] dark:text-[#8E8E93] mb-1">
                    Tanggal Akhir
                  </label>
                  <input
                    id="export-end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Filter Dompet & Tipe */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="export-wallet" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <WalletIcon className="w-3.5 h-3.5 text-[#007AFF] dark:text-[#0A84FF]" aria-hidden="true" />
                <span>Filter Dompet</span>
              </label>
              <select
                id="export-wallet"
                value={selectedWalletId}
                onChange={(e) => setSelectedWalletId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-[#2C2C2E]/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF]"
              >
                <option value="all">Semua Dompet</option>
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({formatRupiah(w.balance)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="export-type" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#007AFF] dark:text-[#0A84FF]" aria-hidden="true" />
                <span>Jenis Transaksi</span>
              </label>
              <select
                id="export-type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as 'all' | TransactionType)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-[#2C2C2E]/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF]"
              >
                <option value="all">Semua Jenis Mutasi</option>
                <option value="expense">Pengeluaran Saja</option>
                <option value="income">Pemasukan Saja</option>
                <option value="transfer">Transfer Saldo</option>
              </select>
            </div>
          </div>

          {/* Info Ringkasan Data Terpilih */}
          <div className="p-4 rounded-2xl bg-[#F2F2F7] dark:bg-[#2C2C2E]/60 border border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-xs">
            <div>
              <span className="text-[#6C6C70] dark:text-[#8E8E93] block">Data Terpilih</span>
              <strong className="text-sm font-bold text-slate-900 dark:text-white">
                {summary.count} Transaksi
              </strong>
            </div>
            <div className="text-right space-y-0.5">
              <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                + {formatRupiah(summary.income)}
              </div>
              <div className="text-rose-600 dark:text-rose-400 font-semibold">
                - {formatRupiah(summary.expense)}
              </div>
            </div>
          </div>

          {/* Pilihan Aksi Format Ekspor */}
          <div className="space-y-3 pt-2">
            <span className="block text-xs font-bold text-slate-900 dark:text-white">
              Pilih Format Berkas
            </span>

            {/* Opsi 1: CSV / Excel */}
            <div className="p-4 rounded-3xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#2C2C2E]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-black/15 dark:hover:border-white/20 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <FileSpreadsheet className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Spreadsheet Excel / CSV (.csv)
                  </h3>
                  <p className="text-[11px] text-[#6C6C70] dark:text-[#8E8E93] mt-0.5 leading-relaxed">
                    Format tabel standar UTF-8 untuk Microsoft Excel, Apple Numbers, atau Google Sheets.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleExportCSV}
                disabled={isExportingCSV || summary.count === 0}
                className="apple-button tap-target px-4 py-2 text-xs font-semibold rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 shadow-xs flex-shrink-0"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isExportingCSV ? 'Mengunduh...' : 'Unduh CSV'}</span>
              </button>
            </div>

            {/* Opsi 2: Cetak / Simpan PDF */}
            <div className="p-4 rounded-3xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#2C2C2E]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-black/15 dark:hover:border-white/20 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#007AFF]/10 dark:bg-[#0A84FF]/15 text-[#007AFF] dark:text-[#0A84FF] flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Laporan Cetak &amp; Dokumen PDF
                  </h3>
                  <p className="text-[11px] text-[#6C6C70] dark:text-[#8E8E93] mt-0.5 leading-relaxed">
                    Dokumen rekapitulasi resmi siap cetak atau disimpan langsung sebagai file PDF.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handlePrintPDF}
                disabled={summary.count === 0}
                className="apple-button tap-target px-4 py-2 text-xs font-semibold rounded-2xl bg-[#007AFF] hover:bg-[#0071E3] dark:bg-[#0A84FF] text-white flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 shadow-xs flex-shrink-0"
              >
                <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Cetak / PDF</span>
              </button>
            </div>

            {/* Opsi 3: Backup JSON Lengkap */}
            <div className="p-4 rounded-3xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#2C2C2E]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-black/15 dark:hover:border-white/20 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <Database className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Cadangan Data Lengkap (.json)
                  </h3>
                  <p className="text-[11px] text-[#6C6C70] dark:text-[#8E8E93] mt-0.5 leading-relaxed">
                    Mencadangkan seluruh saldo dompet, transaksi, dan data utang piutang untuk arsip.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleExportJSON}
                disabled={isExportingJSON}
                className="apple-button tap-target px-4 py-2 text-xs font-semibold rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.03] dark:bg-[#2C2C2E] hover:bg-black/[0.06] text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 flex-shrink-0"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isExportingJSON ? 'Menyiapkan...' : 'Cadangkan JSON'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-black/[0.05] dark:border-white/[0.08] flex items-center justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="apple-button tap-target px-5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-black/[0.04] dark:hover:bg-[#2C2C2E] rounded-2xl transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
