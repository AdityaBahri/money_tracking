import { Wallet, Transaction, UserProfile, Debt } from '@/types/finance';

const WALLETS_KEY = 'sakurapi_wallets_v1';
const TRANSACTIONS_KEY = 'sakurapi_transactions_v1';
const DEBTS_KEY = 'sakurapi_debts_v1';
const USER_KEY = 'sakurapi_user_v1';

export const DEFAULT_DEBTS: Debt[] = [
  {
    id: 'debt-1',
    type: 'payable',
    person_name: 'Budi Santoso',
    amount: 500000,
    paid_amount: 0,
    due_date: '2024-12-01',
    description: 'Pinjaman talangan servis laptop',
    status: 'unpaid',
    wallet_id: 'wallet-bca',
    created_at: '2024-11-10T10:00:00.000Z',
    updated_at: '2024-11-10T10:00:00.000Z',
  },
  {
    id: 'debt-2',
    type: 'receivable',
    person_name: 'Andi Wijaya',
    amount: 300000,
    paid_amount: 150000,
    due_date: '2024-11-25',
    description: 'Pinjam uang makan siang dan bensin',
    status: 'partial',
    wallet_id: 'wallet-gopay',
    created_at: '2024-11-05T10:00:00.000Z',
    updated_at: '2024-11-12T10:00:00.000Z',
  },
];

export const DEFAULT_WALLETS: Wallet[] = [
  {
    id: 'wallet-bca',
    name: 'BCA Prioritas',
    type: 'bank',
    balance: 4250000,
    account_number: '8830192831',
    color: 'blue',
    is_primary: true,
    created_at: '2024-10-18T10:00:00.000Z',
    updated_at: '2024-11-18T10:00:00.000Z',
  },
  {
    id: 'wallet-gopay',
    name: 'GoPay',
    type: 'ewallet',
    balance: 380000,
    account_number: '081234567890',
    color: 'sky',
    is_primary: false,
    created_at: '2024-10-25T10:00:00.000Z',
    updated_at: '2024-11-18T10:00:00.000Z',
  },
  {
    id: 'wallet-cash',
    name: 'Uang Tunai (Dompet Fisik)',
    type: 'cash',
    balance: 175000,
    color: 'emerald',
    is_primary: false,
    created_at: '2024-11-01T10:00:00.000Z',
    updated_at: '2024-11-18T10:00:00.000Z',
  },
];

export const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    wallet_id: 'wallet-bca',
    type: 'income',
    amount: 7500000,
    category_name: 'Gaji Bulanan',
    description: 'Penerimaan gaji bulanan',
    transaction_date: '2024-11-13',
    created_at: '2024-11-13T10:00:00.000Z',
  },
  {
    id: 'tx-2',
    wallet_id: 'wallet-gopay',
    type: 'expense',
    amount: 48000,
    category_name: 'Makanan & Minuman',
    description: 'Kopi Kenangan Mantan + Roti',
    transaction_date: '2024-11-16',
    created_at: '2024-11-16T10:00:00.000Z',
  },
  {
    id: 'tx-3',
    wallet_id: 'wallet-bca',
    type: 'expense',
    amount: 175000,
    category_name: 'Belanja Harian',
    description: 'Belanja mingguan Superindo',
    transaction_date: '2024-11-17',
    created_at: '2024-11-17T10:00:00.000Z',
  },
];

export const DEFAULT_USER: UserProfile = {
  id: 'usr-default-owner',
  username: 'pemilik_saku',
  email: 'pemilik@sakurapi.local',
  full_name: 'Pemilik Akun',
  currency: 'IDR',
};

export function loadStoredWallets(): Wallet[] {
  if (typeof window === 'undefined') return DEFAULT_WALLETS;
  try {
    const raw = localStorage.getItem(WALLETS_KEY);
    if (!raw) {
      localStorage.setItem(WALLETS_KEY, JSON.stringify(DEFAULT_WALLETS));
      return DEFAULT_WALLETS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_WALLETS;
  }
}

export function saveStoredWallets(wallets: Wallet[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WALLETS_KEY, JSON.stringify(wallets));
  } catch (e) {
    console.error('Gagal menyimpan dompet:', e);
  }
}

export function loadStoredTransactions(): Transaction[] {
  if (typeof window === 'undefined') return DEFAULT_TRANSACTIONS;
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    if (!raw) {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(DEFAULT_TRANSACTIONS));
      return DEFAULT_TRANSACTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_TRANSACTIONS;
  }
}

export function saveStoredTransactions(transactions: Transaction[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (e) {
    console.error('Gagal menyimpan transaksi:', e);
  }
}

export function loadStoredDebts(): Debt[] {
  if (typeof window === 'undefined') return DEFAULT_DEBTS;
  try {
    const raw = localStorage.getItem(DEBTS_KEY);
    if (!raw) {
      localStorage.setItem(DEBTS_KEY, JSON.stringify(DEFAULT_DEBTS));
      return DEFAULT_DEBTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_DEBTS;
  }
}

export function saveStoredDebts(debts: Debt[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DEBTS_KEY, JSON.stringify(debts));
  } catch (e) {
    console.error('Gagal menyimpan data utang piutang:', e);
  }
}

export function loadStoredUser(): UserProfile | null {
  if (typeof window === 'undefined') return DEFAULT_USER;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      localStorage.setItem(USER_KEY, JSON.stringify(DEFAULT_USER));
      return DEFAULT_USER;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USER;
  }
}

export function saveStoredUser(user: UserProfile | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (e) {
    console.error('Gagal menyimpan profil pengguna:', e);
  }
}
