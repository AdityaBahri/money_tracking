import { Wallet, Transaction, UserProfile, Debt } from '@/types/finance';

const WALLETS_KEY = 'sakurapi_wallets_v2';
const TRANSACTIONS_KEY = 'sakurapi_transactions_v2';
const DEBTS_KEY = 'sakurapi_debts_v2';
const USER_KEY = 'sakurapi_user_v2';

export const DEFAULT_DEBTS: Debt[] = [];
export const DEFAULT_WALLETS: Wallet[] = [];
export const DEFAULT_TRANSACTIONS: Transaction[] = [];

export function loadStoredWallets(): Wallet[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WALLETS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
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
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
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
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DEBTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
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
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
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
