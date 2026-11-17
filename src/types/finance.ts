export type WalletType = 'bank' | 'ewallet' | 'cash' | 'investment' | 'other';

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Wallet {
  id: string;
  user_id?: string;
  name: string;
  type: WalletType;
  balance: number;
  account_number?: string;
  color: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id?: string;
  wallet_id: string;
  type: TransactionType;
  amount: number;
  category_name: string;
  description: string;
  transaction_date: string;
  receipt_url?: string;
  receipt_data?: {
    merchant?: string;
    raw_text?: string;
    scanned_at?: string;
  };
  target_wallet_id?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  currency: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
}

export interface ReceiptScanResult {
  merchant: string;
  date: string;
  total: number;
  rawText: string;
  categorySuggested: string;
}
