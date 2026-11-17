# SakuRapi (Money Tracking Application)

Aplikasi pencatatan keuangan pribadi (single-user money tracker) modern, responsif untuk mobile dan desktop, didukung integrasi database PostgreSQL Supabase dan siap di-hosting langsung ke Vercel.

## Fitur Utama

1. **Dashboard Saldo Multi-Dompet**:
   - Menghitung dan menampilkan total akumulasi uang dari seluruh dompet aktif secara riil.
   - Ringkasan pemasukan, pengeluaran, dan arus kas bersih bulanan.
2. **Manajemen Dompet Fleksibel**:
   - Tambah, edit, dan hapus dompet bank (BCA, Mandiri, BNI, BRI, Bank Jago, Jenius), e-wallet (GoPay, OVO, Dana, ShopeePay), dan pos uang tunai (cash).
   - Menampilkan nomor rekening atau nomor ponsel terkait.
3. **Riwayat Pemasukan & Pengeluaran**:
   - Filter berdasarkan jenis (Semua, Pengeluaran, Pemasukan, Transfer).
   - Filter spesifik berdasarkan dompet dan pencarian nama merchant/kategori.
4. **Catat Utang & Piutang**:
   - Pencatatan utang saya (kewajiban bayar) dan piutang saya (uang yang dipinjam orang lain).
   - Opsi penyesuaian saldo dompet otomatis saat meminjam (pemasukan kas) atau meminjamkan (pengeluaran kas).
   - Indikator progres pembayaran persentase, tanggal jatuh tempo, dan status lunas/sebagian/belum bayar.
   - Fitur bayar cicil atau pelunasan penuh dengan pemotongan otomatis dari dompet yang dipilih.
5. **Pindai Struk Belanja Otomatis (OCR)**:
   - Ambil foto langsung melalui kamera ponsel atau unggah file struk belanja.
   - Pemrosesan OCR (Optical Character Recognition) via Tesseract.js di sisi peramban.
   - Otomatis mengekstrak nama toko, tanggal, dan total nominal tagihan dengan dukungan pratinjau dan konfirmasi sebelum disimpan.
   - Fitur pengujian cepat dengan sampel struk belanja ritel.
6. **Pencatatan Pemasukan & Transfer Manual**:
   - Form pencatatan pemasukan dengan kategori lengkap (Gaji, Bonus, Freelance, Investasi, dll.).
   - Fitur transfer saldo antar dompet (misal: top-up GoPay dari BCA) tanpa merusak metrik pendapatan riil.
7. **Autentikasi Pengguna**:
   - Pendaftaran dan masuk akun menggunakan **username** atau **alamat email** serta kata sandi.
   - Skema akun tunggal terisolasi (single-tenant) dengan Row Level Security (RLS) Supabase.
8. **Mode Dual-Storage**:
   - Jika Supabase belum dikonfigurasi, aplikasi otomatis berjalan dalam mode penyimpanan lokal (Local Storage) sehingga dapat langsung dicoba secara offline tanpa konfigurasi awal.
   - Begitu kredensial Supabase dimasukkan, data langsung tersinkronisasi ke PostgreSQL.
9. **Responsif Mobile & Desktop**:
   - Mobile: Navigasi bawah (Bottom Navigation) yang nyaman dijangkau satu tangan dengan tap target minimal 44px.
   - Desktop: Sidebar ergonomis dengan kontrol ringkas dan status koneksi database.
   - Dukungan tema Terang (Light) dan Gelap (Dark) dengan rasio kontras WCAG AA.

---

## Panduan Instalasi & Menjalankan Lokal

### 1. Clone & Install Dependensi
```bash
git clone <url-repositori-anda>
cd money_tracking
npm install
```

### 2. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser pada alamat [http://localhost:3000](http://localhost:3000).

---

## Konfigurasi Supabase Database

1. Buka [https://supabase.com](https://supabase.com) dan buat proyek baru.
2. Buka menu **SQL Editor** pada dashboard Supabase.
3. Salin dan jalankan seluruh isi file `supabase/schema.sql`.
4. Buka **Project Settings** > **API**, salin:
   - **Project URL**
   - **anon / public key**
5. Buat file `.env.local` pada direktori root proyek:
```env
NEXT_PUBLIC_SUPABASE_URL=https://proyek-anda.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...
```

---

## Panduan Hosting ke Vercel

1. Unggah kode ke repositori GitHub atau GitLab Anda.
2. Buka [https://vercel.com](https://vercel.com) dan pilih **Add New Project**.
3. Import repositori proyek `money_tracking`.
4. Pada bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL proyek Supabase Anda
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon public key Supabase Anda
5. Klik **Deploy**. Vercel akan otomatis melakukan proses build dan aplikasi Anda langsung aktif online.

---

## Lisensi
Proyek ini dibuat untuk kebutuhan manajemen keuangan pribadi.
