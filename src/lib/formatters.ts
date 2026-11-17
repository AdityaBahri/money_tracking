import { WalletType } from '@/types/finance';

/**
 * Format angka ke format mata uang Rupiah Indonesia
 * Contoh: 1500000 -> "Rp 1.500.000"
 */
export function formatRupiah(amount: number, options?: { showSign?: boolean; isExpense?: boolean }): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absAmount);

  if (options?.showSign) {
    if (options.isExpense || isNegative) {
      return `- ${formatted}`;
    }
    return `+ ${formatted}`;
  }

  return isNegative ? `- ${formatted}` : formatted;
}

/**
 * Format tanggal ke format bahasa Indonesia
 * Contoh: "2024-11-18" -> "18 Nov 2024"
 */
export function formatTanggalIndo(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) {
      return 'Hari ini';
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isYesterday) {
      return 'Kemarin';
    }

    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Mengubah input teks pengguna menjadi angka murni
 */
export function parseNumericInput(value: string): number {
  if (!value) return 0;
  // Hapus semua karakter non-digit kecuali tanda minus
  const cleaned = value.replace(/[^\d]/g, '');
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Terjemahan nama tipe dompet
 */
export function formatWalletTypeName(type: WalletType): string {
  switch (type) {
    case 'bank':
      return 'Bank';
    case 'ewallet':
      return 'E-Wallet';
    case 'cash':
      return 'Uang Tunai';
    case 'investment':
      return 'Investasi';
    default:
      return 'Lainnya';
  }
}

