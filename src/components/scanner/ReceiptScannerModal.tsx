'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { scanReceiptImage } from '@/lib/ocr';
import { formatRupiah, parseNumericInput } from '@/lib/formatters';
import {
  X,
  Camera,
  Upload,
  ScanLine,
  CheckCircle2,
  AlertCircle,
  FileImage,
  RefreshCw,
} from 'lucide-react';

const EXPENSE_CATEGORIES = [
  'Makanan & Minuman',
  'Belanja Harian',
  'Transportasi',
  'Tagihan & Utilitas',
  'Hiburan',
  'Kesehatan',
  'Pendidikan',
  'Lainnya',
];

export function ReceiptScannerModal() {
  const { isScannerOpen, setIsScannerOpen, setIsAddWalletOpen, wallets, addTransaction } = useFinance();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  const [scanProgress, setScanProgress] = useState(0);

  const [merchant, setMerchant] = useState('');
  const [date, setDate] = useState('2024-11-18');
  const [totalInput, setTotalInput] = useState('');
  const [category, setCategory] = useState('Belanja Harian');
  const [selectedWalletId, setSelectedWalletId] = useState('');
  const walletId = selectedWalletId || wallets[0]?.id || '';
  const [rawText, setRawText] = useState('');
  const [showRawText, setShowRawText] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const resetState = React.useCallback(() => {
    setImagePreview(null);
    setIsScanning(false);
    setScanStatus('');
    setScanProgress(0);
    setMerchant('');
    setTotalInput('');
    setRawText('');
    setHasScanned(false);
    setErrorMsg('');
  }, []);

  const handleClose = React.useCallback(() => {
    setIsScannerOpen(false);
    resetState();
  }, [setIsScannerOpen, resetState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isScannerOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isScannerOpen, handleClose]);

  if (!isScannerOpen) return null;

  if (wallets.length === 0) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
        aria-labelledby="no-wallet-scanner-title"
      >
        <div className="w-full max-w-md bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-3">
            <ScanLine className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 id="no-wallet-scanner-title" className="text-base font-bold text-slate-900 dark:text-white">
            Belum Ada Dompet
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-6 leading-relaxed">
            Tambahkan dompet terlebih dahulu agar nominal belanja pada struk dapat langsung dipotongkan dari saldo dompet Anda.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="tap-target px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => {
                handleClose();
                setIsAddWalletOpen(true);
              }}
              className="tap-target px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              Tambah Dompet Baru
            </button>
          </div>
        </div>
      </div>
    );
  }

  const processFile = async (file: File) => {
    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      await runOcr(file);
    };
    reader.readAsDataURL(file);
  };

  const runOcr = async (source: File | string) => {
    setIsScanning(true);
    setHasScanned(false);
    setErrorMsg('');

    try {
      const result = await scanReceiptImage(source, (status, pct) => {
        setScanStatus(status);
        setScanProgress(pct);
      });

      setMerchant(result.merchant);
      setDate(result.date);
      setTotalInput(result.total > 0 ? result.total.toString() : '');
      setCategory(result.categorySuggested || 'Belanja Harian');
      setRawText(result.rawText);
      setHasScanned(true);
    } catch (err: unknown) {
      console.error('OCR Error:', err);
      setErrorMsg('Gagal memproses struk. Anda tetap dapat memasukkan nominal secara manual.');
      setHasScanned(true);
    } finally {
      setIsScanning(false);
    }
  };

  // Demo Sample Receipt Generator (memudahkan pengujian langsung)
  const handleUseSampleReceipt = () => {
    // Buat canvas struk contoh
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 400, 500);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('INDOMARET POINT', 200, 40);

    ctx.font = '12px monospace';
    ctx.fillText('JL. SUDIRMAN NO. 45 JAKARTA', 200, 65);
    ctx.fillText('TANGGAL: 18/11/2024  14:32', 200, 85);
    ctx.fillText('================================', 200, 110);

    ctx.textAlign = 'left';
    ctx.fillText('ROTI TAWAR GANDUM     1x  22.500', 40, 140);
    ctx.fillText('SUSU UHT FULL CREAM   2x  36.000', 40, 170);
    ctx.fillText('AIR MINERAL 600ML     2x   8.000', 40, 200);
    ctx.fillText('KOPI BOTOL LATTE      1x  11.500', 40, 230);

    ctx.textAlign = 'center';
    ctx.fillText('--------------------------------', 200, 260);

    ctx.textAlign = 'left';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('TOTAL BELANJA : Rp 78.000', 40, 300);
    ctx.fillText('TUNAI         : Rp 100.000', 40, 330);
    ctx.fillText('KEMBALI       : Rp 22.000', 40, 360);

    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('TERIMA KASIH ATAS KUNJUNGAN ANDA', 200, 420);

    const dataUrl = canvas.toDataURL('image/png');
    setImagePreview(dataUrl);

    // Langsung set hasil ekstraksi terverifikasi
    setMerchant('INDOMARET POINT');
    setDate('2024-11-18');
    setTotalInput('78000');
    setCategory('Belanja Harian');
    setRawText('INDOMARET POINT\nJL. SUDIRMAN NO. 45\nTOTAL BELANJA : Rp 78.000\nTUNAI: Rp 100.000');
    setHasScanned(true);
  };

  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseNumericInput(totalInput);
    if (amount <= 0 || !walletId) return;

    await addTransaction({
      wallet_id: walletId,
      type: 'expense',
      amount,
      category_name: category,
      description: merchant ? `Belanja di ${merchant}` : 'Pengeluaran dari Struk',
      transaction_date: date,
      receipt_data: {
        merchant,
        raw_text: rawText,
      },
    });

    handleClose();
  };

  const numericTotal = parseNumericInput(totalInput);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scanner-modal-title"
    >
      <div className="w-full max-w-xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 id="scanner-modal-title" className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ScanLine className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span>Pindai Struk Belanja (OCR)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ambil foto atau unggah struk belanja untuk deteksi nominal otomatis
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="tap-target p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Tutup dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                processFile(e.target.files[0]);
              }
            }}
          />
          <input
            type="file"
            ref={cameraInputRef}
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                processFile(e.target.files[0]);
              }
            }}
          />

          {/* Area Unggah / Foto Struk jika belum ada gambar */}
          {!imagePreview && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Kamera */}
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="tap-target p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-500 flex flex-col items-center justify-center text-center transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Camera className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Buka Kamera Ponsel
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Foto struk fisik langsung
                  </span>
                </button>

                {/* Unggah File */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="tap-target p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-500 flex flex-col items-center justify-center text-center transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Upload className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Unggah Gambar Struk
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Pilih file PNG atau JPG
                  </span>
                </button>
              </div>

              {/* Tombol Coba Sampel */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleUseSampleReceipt}
                  className="tap-target text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1.5"
                >
                  <FileImage className="w-4 h-4" aria-hidden="true" />
                  <span>Coba dengan Contoh Struk Indomaret</span>
                </button>
              </div>
            </div>
          )}

          {/* Progress Bar Scanning */}
          {isScanning && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" aria-hidden="true" />
                  <span>{scanStatus || 'Memproses OCR...'}</span>
                </span>
                <span>{scanProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Form Konfirmasi Ekstraksi jika struk sudah dianalisis */}
          {hasScanned && (
            <form onSubmit={handleSaveTransaction} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/70 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Preview Thumbnail Struk & Ganti Foto */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  {imagePreview && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={imagePreview}
                      alt="Pratinjau struk belanja"
                      width={56}
                      height={56}
                      className="w-14 h-14 object-cover rounded-lg border border-slate-300 dark:border-slate-600"
                    />
                  )}
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      <span>Struk Berhasil Dianalisis</span>
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      Periksa data dan pilih dompet pembayaran
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={resetState}
                  className="tap-target px-2.5 py-1 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Ulangi
                </button>
              </div>

              {/* Total Belanja */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="scan-total" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Total Belanja Terdeteksi
                  </label>
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                    {formatRupiah(numericTotal)}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    Rp
                  </span>
                  <input
                    id="scan-total"
                    type="text"
                    required
                    inputMode="numeric"
                    placeholder="0"
                    value={totalInput}
                    onChange={(e) => setTotalInput(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-base font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Toko / Merchant & Tanggal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="scan-merchant" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Toko / Tempat
                  </label>
                  <input
                    id="scan-merchant"
                    type="text"
                    required
                    placeholder="Contoh: Indomaret, Superindo"
                    value={merchant}
                    onChange={(e) => setMerchant(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label htmlFor="scan-date" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Transaksi
                  </label>
                  <input
                    id="scan-date"
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Dompet Pembayar & Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="scan-wallet" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Potong Dari Dompet
                  </label>
                  <select
                    id="scan-wallet"
                    value={walletId}
                    onChange={(e) => setSelectedWalletId(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {wallets.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({formatRupiah(w.balance)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="scan-cat" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Pengeluaran
                  </label>
                  <select
                    id="scan-cat"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {EXPENSE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Teks Mentah OCR Toggle */}
              {rawText && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowRawText(!showRawText)}
                    className="tap-target text-[11px] font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline"
                  >
                    {showRawText ? 'Sembunyikan Hasil Teks Mentah OCR' : 'Lihat Teks Mentah OCR'}
                  </button>
                  {showRawText && (
                    <pre className="mt-2 p-3 text-[10px] font-mono rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 overflow-x-auto max-h-32 border border-slate-200 dark:border-slate-800">
                      {rawText}
                    </pre>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleClose}
                  className="tap-target px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={numericTotal <= 0 || !walletId}
                  className="tap-target px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  Simpan Pengeluaran dari Struk
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
