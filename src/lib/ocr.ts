import { createWorker } from 'tesseract.js';
import { ReceiptScanResult } from '@/types/finance';

export interface ScanProgressCallback {
  (status: string, progress: number): void;
}

/**
 * Membaca struk belanja / transaksi menggunakan Tesseract.js OCR
 * dan mengekstrak informasi: Toko/Merchant, Tanggal, dan Total Nominal.
 */
export async function scanReceiptImage(
  imageSource: string | File,
  onProgress?: ScanProgressCallback
): Promise<ReceiptScanResult> {
  onProgress?.('Inisialisasi modul OCR...', 10);

  const worker = await createWorker('ind', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        const pct = Math.round(20 + (m.progress || 0) * 70);
        onProgress?.('Membaca teks dari struk...', pct);
      }
    },
  });

  try {
    onProgress?.('Memproses gambar struk...', 20);
    const ret = await worker.recognize(imageSource);
    const rawText = ret.data.text || '';

    onProgress?.('Menganalisis data transaksi...', 95);

    const parsed = parseReceiptText(rawText);
    onProgress?.('Selesai', 100);

    return {
      ...parsed,
      rawText,
    };
  } finally {
    await worker.terminate();
  }
}

/**
 * Parsing cerdas untuk struktur struk belanja di Indonesia
 */
export function parseReceiptText(text: string): {
  merchant: string;
  date: string;
  total: number;
  categorySuggested: string;
} {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // 1. Ekstrak Merchant (biasanya ada di 4 baris pertama yang bermakna)
  let merchant = '';
  const ignoredWords = ['selamat datang', 'terima kasih', 'struk', 'nota', 'salinan', 'receipt', 'npwp', 'pos', 'kasir'];
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i];
    const lower = line.toLowerCase();
    const isIgnored = ignoredWords.some((w) => lower.includes(w));
    if (!isIgnored && line.length >= 3 && !/^\d+$/.test(line)) {
      merchant = cleanMerchantName(line);
      break;
    }
  }

  if (!merchant && lines.length > 0) {
    merchant = cleanMerchantName(lines[0]);
  }

  // 2. Ekstrak Tanggal
  let detectedDate = new Date().toISOString().split('T')[0];
  const dateRegex = /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/;
  for (const line of lines) {
    const match = line.match(dateRegex);
    if (match) {
      let day = parseInt(match[1], 10);
      let month = parseInt(match[2], 10);
      let year = parseInt(match[3], 10);

      if (year < 100) {
        year += 2000;
      }

      // Validasi logika hari dan bulan
      if (month > 12 && day <= 12) {
        const temp = day;
        day = month;
        month = temp;
      }

      if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 2020 && year <= 2030) {
        const pad = (n: number) => n.toString().padStart(2, '0');
        detectedDate = `${year}-${pad(month)}-${pad(day)}`;
        break;
      }
    }
  }

  // 3. Ekstrak Total Belanja
  let detectedTotal = 0;
  const totalKeywords = [
    'grand total',
    'total bayar',
    'total belanja',
    'total akhir',
    'total tagihan',
    'total',
    'jumlah',
    'subtotal',
    'tunai',
    'debit',
    'cash',
    'netto',
  ];

  // Cari baris yang mengandung kata kunci Total terlebih dahulu
  for (const keyword of totalKeywords) {
    for (let i = 0; i < lines.length; i++) {
      const lineLower = lines[i].toLowerCase();
      if (lineLower.includes(keyword)) {
        // Cari angka di baris ini
        const nums = extractNumbersFromLine(lines[i]);
        if (nums.length > 0) {
          detectedTotal = Math.max(...nums);
          break;
        }
        // Jika tidak ada di baris yang sama, periksa baris tepat berikutnya
        if (i + 1 < lines.length) {
          const nextNums = extractNumbersFromLine(lines[i + 1]);
          if (nextNums.length > 0) {
            detectedTotal = Math.max(...nextNums);
            break;
          }
        }
      }
    }
    if (detectedTotal > 0) break;
  }

  // Fallback: jika keyword tidak tertangkap, cari angka wajar terbesar
  if (detectedTotal === 0) {
    const allNumbers: number[] = [];
    for (const line of lines) {
      const nums = extractNumbersFromLine(line);
      allNumbers.push(...nums);
    }
    if (allNumbers.length > 0) {
      // Ambil angka terbesar yang bukan nomor telepon/barcode/NPWP (misal < 50.000.000)
      const plausibleAmounts = allNumbers.filter((n) => n >= 1000 && n <= 50000000);
      if (plausibleAmounts.length > 0) {
        detectedTotal = Math.max(...plausibleAmounts);
      }
    }
  }

  // 4. Rekomendasi Kategori berdasarkan teks & merchant
  const categorySuggested = suggestCategory(merchant, text);

  return {
    merchant: merchant || 'Struk Belanja',
    date: detectedDate,
    total: detectedTotal,
    categorySuggested,
  };
}

function cleanMerchantName(raw: string): string {
  return raw
    .replace(/[^a-zA-Z0-9\s\.\-]/g, '')
    .trim()
    .slice(0, 40);
}

function extractNumbersFromLine(line: string): number[] {
  // Tangkap pola mata uang seperti "Rp 45.000", "125.000", "45,000", "15000"
  const tokens = line.split(/\s+/);
  const found: number[] = [];

  for (const token of tokens) {
    // Bersihkan karakter non-digit selain pemisah ribuan
    const cleanToken = token.replace(/^(rp|rp\.)/i, '').trim();
    // Ganti pemisah ribuan titik atau koma
    const normalized = cleanToken.replace(/[.,]/g, '');
    if (/^\d{3,9}$/.test(normalized)) {
      const num = parseInt(normalized, 10);
      // Hindari tahun (2020-2030) jika berdiri sendiri
      if (num >= 2020 && num <= 2030 && token.length === 4) {
        continue;
      }
      if (num >= 500) {
        found.push(num);
      }
    }
  }

  return found;
}

function suggestCategory(merchant: string, fullText: string): string {
  const combined = `${merchant} ${fullText}`.toLowerCase();

  if (
    combined.includes('kopi') ||
    combined.includes('cafe') ||
    combined.includes('resto') ||
    combined.includes('makan') ||
    combined.includes('bakso') ||
    combined.includes('kfc') ||
    combined.includes('mcd') ||
    combined.includes('starbucks') ||
    combined.includes('roti') ||
    combined.includes('warung') ||
    combined.includes('dapur')
  ) {
    return 'Makanan & Minuman';
  }

  if (
    combined.includes('indomaret') ||
    combined.includes('alfamart') ||
    combined.includes('superindo') ||
    combined.includes('hypermart') ||
    combined.includes('transmart') ||
    combined.includes('minimarket') ||
    combined.includes('pasar') ||
    combined.includes('toko')
  ) {
    return 'Belanja Harian';
  }

  if (
    combined.includes('spbu') ||
    combined.includes('pertamina') ||
    combined.includes('shell') ||
    combined.includes('gojek') ||
    combined.includes('grab') ||
    combined.includes('parkir') ||
    combined.includes('tol') ||
    combined.includes('bensin')
  ) {
    return 'Transportasi';
  }

  if (
    combined.includes('pln') ||
    combined.includes('listrik') ||
    combined.includes('pdam') ||
    combined.includes('wifi') ||
    combined.includes('indihome') ||
    combined.includes('pulsa') ||
    combined.includes('telkom')
  ) {
    return 'Tagihan & Utilitas';
  }

  if (
    combined.includes('apotek') ||
    combined.includes('kimia farma') ||
    combined.includes('klinik') ||
    combined.includes('dokter') ||
    combined.includes('obat') ||
    combined.includes('rs')
  ) {
    return 'Kesehatan';
  }

  return 'Lainnya';
}

