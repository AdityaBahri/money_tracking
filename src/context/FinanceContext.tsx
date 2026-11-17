'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  Wallet,
  Transaction,
  UserProfile,
  WalletType,
  TransactionType,
  Debt,
  DebtType,
} from '@/types/finance';
import {
  loadStoredWallets,
  saveStoredWallets,
  loadStoredTransactions,
  saveStoredTransactions,
  loadStoredDebts,
  saveStoredDebts,
  loadStoredUser,
  saveStoredUser,
} from '@/lib/storage';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface FinanceContextType {
  wallets: Wallet[];
  transactions: Transaction[];
  debts: Debt[];
  user: UserProfile | null;
  theme: 'light' | 'dark';
  isLoading: boolean;
  isSupabase: boolean;
  activeTab: 'dashboard' | 'wallets' | 'transactions' | 'debts' | 'scanner';
  setActiveTab: (tab: 'dashboard' | 'wallets' | 'transactions' | 'debts' | 'scanner') => void;
  toggleTheme: () => void;
  addWallet: (data: { name: string; type: WalletType; balance: number; account_number?: string; color?: string }) => Promise<void>;
  updateWallet: (id: string, data: Partial<Wallet>) => Promise<void>;
  deleteWallet: (id: string) => Promise<boolean>;
  addTransaction: (data: {
    wallet_id: string;
    type: TransactionType;
    amount: number;
    category_name: string;
    description: string;
    transaction_date: string;
    target_wallet_id?: string;
    receipt_url?: string;
    receipt_data?: { merchant?: string; raw_text?: string };
  }) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addDebt: (data: {
    type: DebtType;
    person_name: string;
    amount: number;
    due_date?: string;
    description?: string;
    wallet_id?: string;
    updateWalletBalance?: boolean;
  }) => Promise<void>;
  updateDebt: (id: string, updates: Partial<Debt>) => Promise<void>;
  deleteDebt: (id: string) => Promise<void>;
  recordDebtPayment: (debtId: string, paymentAmount: number, walletId?: string) => Promise<void>;
  login: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, pass: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  totalBalance: number;
  totalIncomeThisMonth: number;
  totalExpenseThisMonth: number;
  totalPayable: number;
  totalReceivable: number;
  isAddTxOpen: boolean;
  setIsAddTxOpen: (open: boolean) => void;
  isAddWalletOpen: boolean;
  setIsAddWalletOpen: (open: boolean) => void;
  isAddDebtOpen: boolean;
  setIsAddDebtOpen: (open: boolean) => void;
  isDebtPaymentOpen: boolean;
  setIsDebtPaymentOpen: (open: boolean) => void;
  selectedDebtForPayment: Debt | null;
  setSelectedDebtForPayment: (debt: Debt | null) => void;
  isScannerOpen: boolean;
  setIsScannerOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  isSupabaseModalOpen: boolean;
  setIsSupabaseModalOpen: (open: boolean) => void;
  editingWallet: Wallet | null;
  setEditingWallet: (wallet: Wallet | null) => void;
  editingDebt: Debt | null;
  setEditingDebt: (debt: Debt | null) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'wallets' | 'transactions' | 'debts' | 'scanner'>('dashboard');

  // Modals
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false);
  const [isDebtPaymentOpen, setIsDebtPaymentOpen] = useState(false);
  const [selectedDebtForPayment, setSelectedDebtForPayment] = useState<Debt | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedTheme = localStorage.getItem('sakurapi_theme') as 'light' | 'dark';
      if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initial = prefersDark ? 'dark' : 'light';
        setTheme(initial);
        if (initial === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('sakurapi_theme', next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function initData() {
      setIsLoading(true);

      if (isSupabaseConfigured && supabase) {
        try {
          const { data: authData } = await supabase.auth.getSession();
          if (authData?.session?.user) {
            const currentUserId = authData.session.user.id;
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentUserId)
              .single();

            if (profile && isMounted) {
              setUser({
                id: profile.id,
                username: profile.username,
                email: profile.email || authData.session.user.email || '',
                full_name: profile.full_name,
                currency: profile.currency || 'IDR',
              });
            }

            const { data: dbWallets } = await supabase
              .from('wallets')
              .select('*')
              .eq('user_id', currentUserId)
              .order('created_at', { ascending: true });

            if (dbWallets && isMounted) {
              setWallets(dbWallets);
            }

            const { data: dbTx } = await supabase
              .from('transactions')
              .select('*')
              .eq('user_id', currentUserId)
              .order('transaction_date', { ascending: false });

            if (dbTx && isMounted) {
              setTransactions(dbTx);
            }

            const { data: dbDebts } = await supabase
              .from('debts')
              .select('*')
              .eq('user_id', currentUserId)
              .order('created_at', { ascending: false });

            if (dbDebts && isMounted) {
              setDebts(dbDebts);
            }
          } else {
            loadLocal();
          }
        } catch (e) {
          console.warn('Gagal memuat data Supabase, beralih ke penyimpanan lokal:', e);
          loadLocal();
        }
      } else {
        loadLocal();
      }

      if (isMounted) {
        setIsLoading(false);
      }
    }

    function loadLocal() {
      const storedWallets = loadStoredWallets();
      const storedTx = loadStoredTransactions();
      const storedDebts = loadStoredDebts();
      const storedUser = loadStoredUser();
      if (isMounted) {
        setWallets(storedWallets);
        setTransactions(storedTx);
        setDebts(storedDebts);
        setUser(storedUser);
      }
    }

    initData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Simpan otomatis ke LocalStorage jika tidak dalam mode Supabase auth aktif
  useEffect(() => {
    if (!isLoading && (!isSupabaseConfigured || !user?.id?.startsWith('usr-supabase-'))) {
      saveStoredWallets(wallets);
    }
  }, [wallets, isLoading, user]);

  useEffect(() => {
    if (!isLoading && (!isSupabaseConfigured || !user?.id?.startsWith('usr-supabase-'))) {
      saveStoredTransactions(transactions);
    }
  }, [transactions, isLoading, user]);

  useEffect(() => {
    if (!isLoading && (!isSupabaseConfigured || !user?.id?.startsWith('usr-supabase-'))) {
      saveStoredDebts(debts);
    }
  }, [debts, isLoading, user]);

  const [currentDateInfo, setCurrentDateInfo] = useState<{ month: number; year: number } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const d = new Date();
      setCurrentDateInfo({ month: d.getMonth(), year: d.getFullYear() });
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const totalBalance = useMemo(() => {
    return wallets.reduce((sum, w) => sum + (Number(w.balance) || 0), 0);
  }, [wallets]);

  const { totalIncomeThisMonth, totalExpenseThisMonth } = useMemo(() => {
    let inc = 0;
    let exp = 0;

    for (const t of transactions) {
      if (currentDateInfo) {
        const tDate = new Date(t.transaction_date);
        if (tDate.getMonth() === currentDateInfo.month && tDate.getFullYear() === currentDateInfo.year) {
          if (t.type === 'income') {
            inc += Number(t.amount) || 0;
          } else if (t.type === 'expense') {
            exp += Number(t.amount) || 0;
          }
        }
      } else {
        if (t.type === 'income') {
          inc += Number(t.amount) || 0;
        } else if (t.type === 'expense') {
          exp += Number(t.amount) || 0;
        }
      }
    }

    return { totalIncomeThisMonth: inc, totalExpenseThisMonth: exp };
  }, [transactions, currentDateInfo]);

  const { totalPayable, totalReceivable } = useMemo(() => {
    let payable = 0;
    let receivable = 0;

    for (const d of debts) {
      if (d.status !== 'paid') {
        const remaining = Math.max(0, Number(d.amount) - (Number(d.paid_amount) || 0));
        if (d.type === 'payable') {
          payable += remaining;
        } else {
          receivable += remaining;
        }
      }
    }

    return { totalPayable: payable, totalReceivable: receivable };
  }, [debts]);

  const addWallet = async (data: {
    name: string;
    type: WalletType;
    balance: number;
    account_number?: string;
    color?: string;
  }) => {
    const newWallet: Wallet = {
      id: `wallet-${Date.now()}`,
      name: data.name,
      type: data.type,
      balance: data.balance,
      account_number: data.account_number || '',
      color: data.color || 'emerald',
      is_primary: wallets.length === 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase && user && !user.id.startsWith('usr-default-')) {
      try {
        const { data: inserted, error } = await supabase
          .from('wallets')
          .insert({
            user_id: user.id,
            name: data.name,
            type: data.type,
            balance: data.balance,
            account_number: data.account_number,
            color: data.color || 'emerald',
            is_primary: wallets.length === 0,
          })
          .select()
          .single();

        if (error) throw error;
        if (inserted) {
          setWallets((prev) => [...prev, inserted]);
          return;
        }
      } catch (err) {
        console.error('Gagal menambahkan dompet ke Supabase:', err);
      }
    }

    setWallets((prev) => [...prev, newWallet]);
  };

  // Update Dompet
  const updateWallet = async (id: string, updates: Partial<Wallet>) => {
    if (isSupabaseConfigured && supabase && user && !user.id.startsWith('usr-default-')) {
      try {
        await supabase
          .from('wallets')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);
      } catch (err) {
        console.error('Gagal memperbarui dompet di Supabase:', err);
      }
    }

    setWallets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates, updated_at: new Date().toISOString() } : w))
    );
  };

  const deleteWallet = async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase && user && !user.id.startsWith('usr-default-')) {
      try {
        await supabase.from('wallets').delete().eq('id', id);
      } catch (err) {
        console.error('Gagal menghapus dompet dari Supabase:', err);
      }
    }

    setWallets((prev) => prev.filter((w) => w.id !== id));
    setTransactions((prev) => prev.filter((t) => t.wallet_id !== id && t.target_wallet_id !== id));
    return true;
  };

  // Tambah Transaksi
  const addTransaction = async (data: {
    wallet_id: string;
    type: TransactionType;
    amount: number;
    category_name: string;
    description: string;
    transaction_date: string;
    target_wallet_id?: string;
    receipt_url?: string;
    receipt_data?: { merchant?: string; raw_text?: string };
  }) => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      wallet_id: data.wallet_id,
      type: data.type,
      amount: data.amount,
      category_name: data.category_name,
      description: data.description,
      transaction_date: data.transaction_date,
      target_wallet_id: data.target_wallet_id,
      receipt_url: data.receipt_url,
      receipt_data: data.receipt_data,
      created_at: new Date().toISOString(),
    };

    // Update saldo dompet lokal
    setWallets((prev) =>
      prev.map((w) => {
        if (data.type === 'expense' && w.id === data.wallet_id) {
          return { ...w, balance: Number(w.balance) - data.amount };
        }
        if (data.type === 'income' && w.id === data.wallet_id) {
          return { ...w, balance: Number(w.balance) + data.amount };
        }
        if (data.type === 'transfer') {
          if (w.id === data.wallet_id) {
            return { ...w, balance: Number(w.balance) - data.amount };
          }
          if (w.id === data.target_wallet_id) {
            return { ...w, balance: Number(w.balance) + data.amount };
          }
        }
        return w;
      })
    );

    setTransactions((prev) => [newTx, ...prev]);

    if (isSupabaseConfigured && supabase && user && !user.id.startsWith('usr-default-')) {
      try {
        await supabase.from('transactions').insert({
          user_id: user.id,
          wallet_id: data.wallet_id,
          type: data.type,
          amount: data.amount,
          category_name: data.category_name,
          description: data.description,
          transaction_date: data.transaction_date,
          target_wallet_id: data.target_wallet_id,
          receipt_url: data.receipt_url,
          receipt_data: data.receipt_data,
        });

        if (data.type === 'expense' || data.type === 'income') {
          const targetW = wallets.find((w) => w.id === data.wallet_id);
          if (targetW) {
            const nextBal =
              data.type === 'expense'
                ? Number(targetW.balance) - data.amount
                : Number(targetW.balance) + data.amount;
            await supabase.from('wallets').update({ balance: nextBal }).eq('id', data.wallet_id);
          }
        }
      } catch (err) {
        console.error('Gagal menyimpan transaksi ke Supabase:', err);
      }
    }
  };

  const deleteTransaction = async (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;

    setWallets((prev) =>
      prev.map((w) => {
        if (tx.type === 'expense' && w.id === tx.wallet_id) {
          return { ...w, balance: Number(w.balance) + tx.amount };
        }
        if (tx.type === 'income' && w.id === tx.wallet_id) {
          return { ...w, balance: Number(w.balance) - tx.amount };
        }
        if (tx.type === 'transfer') {
          if (w.id === tx.wallet_id) {
            return { ...w, balance: Number(w.balance) + tx.amount };
          }
          if (w.id === tx.target_wallet_id) {
            return { ...w, balance: Number(w.balance) - tx.amount };
          }
        }
        return w;
      })
    );

    setTransactions((prev) => prev.filter((t) => t.id !== id));

    if (isSupabaseConfigured && supabase && user && !user.id.startsWith('usr-default-')) {
      try {
        await supabase.from('transactions').delete().eq('id', id);
      } catch (err) {
        console.error('Gagal menghapus transaksi dari Supabase:', err);
      }
    }
  };

  const addDebt = async (data: {
    type: DebtType;
    person_name: string;
    amount: number;
    due_date?: string;
    description?: string;
    wallet_id?: string;
    updateWalletBalance?: boolean;
  }) => {
    const newDebt: Debt = {
      id: `debt-${Date.now()}`,
      type: data.type,
      person_name: data.person_name,
      amount: data.amount,
      paid_amount: 0,
      due_date: data.due_date,
      description: data.description,
      status: 'unpaid',
      wallet_id: data.wallet_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setDebts((prev) => [newDebt, ...prev]);

    // Jika pengguna memilih untuk langsung mempengaruhi saldo dompet saat meminjam / meminjamkan
    if (data.updateWalletBalance && data.wallet_id) {
      if (data.type === 'payable') {
        // Saya berutang / meminjam uang: dana masuk ke dompet saya (Pemasukan)
        await addTransaction({
          wallet_id: data.wallet_id,
          type: 'income',
          amount: data.amount,
          category_name: 'Pinjaman Diterima',
          description: `Penerimaan pinjaman dari ${data.person_name}`,
          transaction_date: new Date().toISOString().split('T')[0],
        });
      } else {
        // Piutang / saya meminjamkan uang ke orang lain: dana keluar dari dompet saya (Pengeluaran)
        await addTransaction({
          wallet_id: data.wallet_id,
          type: 'expense',
          amount: data.amount,
          category_name: 'Pinjaman Diberikan',
          description: `Meminjamkan uang kepada ${data.person_name}`,
          transaction_date: new Date().toISOString().split('T')[0],
        });
      }
    }

    if (isSupabaseConfigured && supabase && user && !user.id.startsWith('usr-default-')) {
      try {
        await supabase.from('debts').insert({
          user_id: user.id,
          type: data.type,
          person_name: data.person_name,
          amount: data.amount,
          paid_amount: 0,
          due_date: data.due_date || null,
          description: data.description || null,
          status: 'unpaid',
          wallet_id: data.wallet_id || null,
        });
      } catch (err) {
        console.error('Gagal menyimpan data utang ke Supabase:', err);
      }
    }
  };

  const updateDebt = async (id: string, updates: Partial<Debt>) => {
    setDebts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates, updated_at: new Date().toISOString() } : d))
    );

    if (isSupabaseConfigured && supabase && user && !user.id.startsWith('usr-default-')) {
      try {
        await supabase
          .from('debts')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);
      } catch (err) {
        console.error('Gagal memperbarui data utang di Supabase:', err);
      }
    }
  };

  const deleteDebt = async (id: string) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));

    if (isSupabaseConfigured && supabase && user && !user.id.startsWith('usr-default-')) {
      try {
        await supabase.from('debts').delete().eq('id', id);
      } catch (err) {
        console.error('Gagal menghapus data utang dari Supabase:', err);
      }
    }
  };

  const recordDebtPayment = async (debtId: string, paymentAmount: number, walletId?: string) => {
    const debt = debts.find((d) => d.id === debtId);
    if (!debt || paymentAmount <= 0) return;

    const newPaidAmount = Math.min(debt.amount, Number(debt.paid_amount) + paymentAmount);
    const newStatus = newPaidAmount >= debt.amount ? 'paid' : 'partial';

    await updateDebt(debtId, {
      paid_amount: newPaidAmount,
      status: newStatus,
    });

    // Catat mutasi kas dompet jika dompet dipilih
    if (walletId) {
      if (debt.type === 'payable') {
        // Membayar utang saya: Pengeluaran dari dompet
        await addTransaction({
          wallet_id: walletId,
          type: 'expense',
          amount: paymentAmount,
          category_name: 'Pembayaran Utang',
          description: `Bayar cicilan/pelunasan utang ke ${debt.person_name}`,
          transaction_date: new Date().toISOString().split('T')[0],
        });
      } else {
        // Menerima pembayaran piutang: Pemasukan ke dompet
        await addTransaction({
          wallet_id: walletId,
          type: 'income',
          amount: paymentAmount,
          category_name: 'Pelunasan Piutang',
          description: `Terima pembayaran piutang dari ${debt.person_name}`,
          transaction_date: new Date().toISOString().split('T')[0],
        });
      }
    }
  };

  // Autentikasi Pengguna
  const login = async (identifier: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const emailToUse = identifier.includes('@') ? identifier : `${identifier}@sakurapi.local`;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailToUse,
          password: pass,
        });

        if (error) return { success: false, error: error.message };

        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const newUser: UserProfile = {
            id: data.user.id,
            username: profile?.username || identifier,
            email: data.user.email || emailToUse,
            full_name: profile?.full_name || identifier,
            currency: profile?.currency || 'IDR',
          };

          setUser(newUser);
          saveStoredUser(newUser);

          const { data: dbWallets } = await supabase
            .from('wallets')
            .select('*')
            .eq('user_id', data.user.id);
          if (dbWallets) setWallets(dbWallets);

          const { data: dbDebts } = await supabase
            .from('debts')
            .select('*')
            .eq('user_id', data.user.id);
          if (dbDebts) setDebts(dbDebts);

          return { success: true };
        }
      } catch (err: unknown) {
        return { success: false, error: (err as Error).message || 'Terjadi kesalahan saat masuk' };
      }
    }

    const localUser: UserProfile = {
      id: `usr-${Date.now()}`,
      username: identifier.replace(/@.*/, ''),
      email: emailToUse,
      full_name: identifier.replace(/@.*/, ''),
      currency: 'IDR',
    };
    setUser(localUser);
    saveStoredUser(localUser);
    return { success: true };
  };

  const register = async (
    username: string,
    email: string,
    pass: string,
    fullName: string
  ): Promise<{ success: boolean; error?: string }> => {
    const emailToUse = email.trim() ? email : `${username.trim()}@sakurapi.local`;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: emailToUse,
          password: pass,
          options: {
            data: {
              username: username.trim(),
              full_name: fullName.trim(),
            },
          },
        });

        if (error) return { success: false, error: error.message };

        if (data.user) {
          const newUser: UserProfile = {
            id: data.user.id,
            username: username.trim(),
            email: emailToUse,
            full_name: fullName.trim(),
            currency: 'IDR',
          };
          setUser(newUser);
          saveStoredUser(newUser);
          return { success: true };
        }
      } catch (err: unknown) {
        return { success: false, error: (err as Error).message || 'Gagal mendaftar' };
      }
    }

    const localUser: UserProfile = {
      id: `usr-${Date.now()}`,
      username: username.trim(),
      email: emailToUse,
      full_name: fullName.trim() || username.trim(),
      currency: 'IDR',
    };
    setUser(localUser);
    saveStoredUser(localUser);
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Logout error:', e);
      }
    }
    setUser(null);
    saveStoredUser(null);
  };

  return (
    <FinanceContext.Provider
      value={{
        wallets,
        transactions,
        debts,
        user,
        theme,
        isLoading,
        isSupabase: isSupabaseConfigured,
        activeTab,
        setActiveTab,
        toggleTheme,
        addWallet,
        updateWallet,
        deleteWallet,
        addTransaction,
        deleteTransaction,
        addDebt,
        updateDebt,
        deleteDebt,
        recordDebtPayment,
        login,
        register,
        logout,
        totalBalance,
        totalIncomeThisMonth,
        totalExpenseThisMonth,
        totalPayable,
        totalReceivable,
        isAddTxOpen,
        setIsAddTxOpen,
        isAddWalletOpen,
        setIsAddWalletOpen,
        isAddDebtOpen,
        setIsAddDebtOpen,
        isDebtPaymentOpen,
        setIsDebtPaymentOpen,
        selectedDebtForPayment,
        setSelectedDebtForPayment,
        isScannerOpen,
        setIsScannerOpen,
        isAuthOpen,
        setIsAuthOpen,
        isSupabaseModalOpen,
        setIsSupabaseModalOpen,
        editingWallet,
        setEditingWallet,
        editingDebt,
        setEditingDebt,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance harus digunakan di dalam FinanceProvider');
  }
  return context;
}
