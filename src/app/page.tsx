'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { BalanceOverview } from '@/components/dashboard/BalanceOverview';
import { WalletList } from '@/components/dashboard/WalletList';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { DebtList } from '@/components/debts/DebtList';
import { TransactionModal } from '@/components/transactions/TransactionModal';
import { WalletModal } from '@/components/wallets/WalletModal';
import { DebtModal } from '@/components/debts/DebtModal';
import { DebtPaymentModal } from '@/components/debts/DebtPaymentModal';
import { ReceiptScannerModal } from '@/components/scanner/ReceiptScannerModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { SupabaseConfigModal } from '@/components/settings/SupabaseConfigModal';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { activeTab, isLoading, editingWallet, isAddWalletOpen, editingDebt, isAddDebtOpen } = useFinance();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F17] transition-colors">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Left Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 max-w-5xl mx-auto w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-3" aria-hidden="true" />
              <p className="text-sm font-medium">Memuat data dompet, transaksi, dan utang...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div>
                  <BalanceOverview />
                  <WalletList />
                  <div className="mt-8">
                    <RecentTransactions limit={6} />
                  </div>
                </div>
              )}

              {activeTab === 'wallets' && (
                <div>
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Semua Dompet & Rekening
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Pantau dan sesuaikan saldo pada setiap rekening bank, e-wallet, atau kas fisik Anda.
                    </p>
                  </div>
                  <WalletList />
                </div>
              )}

              {activeTab === 'transactions' && (
                <div>
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Riwayat Seluruh Transaksi
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Filter berdasarkan dompet, kategori, atau cari nota belanja Anda.
                    </p>
                  </div>
                  <RecentTransactions />
                </div>
              )}

              {activeTab === 'debts' && (
                <div>
                  <DebtList />
                </div>
              )}

              {activeTab === 'scanner' && (
                <div>
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Pindai Struk Belanja
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Deteksi otomatis total nominal dari struk fisik.
                    </p>
                  </div>
                  <ReceiptScannerModal />
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Modals */}
      <TransactionModal />
      <WalletModal key={editingWallet?.id || (isAddWalletOpen ? 'wallet-open' : 'wallet-closed')} />
      <DebtModal key={editingDebt?.id || (isAddDebtOpen ? 'debt-open' : 'debt-closed')} />
      <DebtPaymentModal />
      <ReceiptScannerModal />
      <AuthModal />
      <SupabaseConfigModal />
    </div>
  );
}
