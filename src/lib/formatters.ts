import { WalletType } from '@/types/finance';

/**
 * Format angka ke format mata uang Rupiah Indonesia secara deterministik
 * Menghindari perbedaan spasi/tanda mata uang antara SSR (Node.js) dan Browser (Client)
 * Contoh: 1500000 -> "Rp 1.500.000"
 */
export function formatRupiah(amount: number, options?: { showSign?: boolean; isExpense?: boolean }): string {
  const isNegative = amount < 0;
  const absAmount = Math.round(Math.abs(amount) || 0);

  // Format pemisah ribuan titik (.) khas standar Indonesia
  const formattedNumber = absAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const formatted = `Rp ${formattedNumber}`;

  if (options?.showSign) {
    if (options.isExpense || isNegative) {
      return `- ${formatted}`;
    }
    return `+ ${formatted}`;
  }

  return isNegative ? `- ${formatted}` : formatted;
}

/**
 * Format tanggal ke format bahasa Indonesia secara deterministik
 * Contoh: "2024-11-18" -> "18 Nov 2024"
 */
export function formatTanggalIndo(dateString: string): string {
  if (!dateString) return '';

  const MONTHS_INDO = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];

  try {
    // Tangani format "YYYY-MM-DD" atau ISO string
    const datePart = dateString.split('T')[0];
    const parts = datePart.split('-');

    if (parts.length === 3) {
      const year = parts[0];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);

      if (monthIdx >= 0 && monthIdx < 12 && !isNaN(day)) {
        return `${day} ${MONTHS_INDO[monthIdx]} ${year}`;
      }
    }

    const d = new Date(dateString);
    if (!isNaN(d.getTime())) {
      const day = d.getDate();
      const monthIdx = d.getMonth();
      const year = d.getFullYear();
      return `${day} ${MONTHS_INDO[monthIdx]} ${year}`;
    }

    return dateString;
  } catch {
    return dateString;
  }
}

/**
 * Mendapatkan tanggal perangkat lokal pengguna saat ini dalam format YYYY-MM-DD.
 * Menggunakan getFullYear(), getMonth(), dan getDate() untuk memastikan zona waktu perangkat lokal pengguna.
 */
export function getDeviceLocalDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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

