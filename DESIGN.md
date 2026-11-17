# DESIGN.md - SakuRapi Money Tracking Design System

## 1. Identity & Personality
- **Product Name**: SakuRapi (Sistem Manajemen Keuangan Pribadi)
- **Concept**: Aplikasi pelacak keuangan pribadi (single-user personal finance tracker) yang mengutamakan kecepatan pencatatan, kejelasan visual terhadap seluruh aset dompet, dan kemudahan pencatatan struk fisik.
- **Archetype**: Editorial Financial Craft. Tenang, akurat, profesional, bebas dari elemen dekoratif berlebihan atau gradien AI generik.
- **Tone of Voice**: Bersahabat, langsung pada inti data, transparan, tanpa istilah bertele-tele.

## 2. Dials (Antislop Part 3)
- **ENERGY: 2 (Balanced)**. Antarmuka yang tenang namun jelas hierarkinya; menyajikan status keuangan dengan bobot data yang tegas tanpa efek neon atau ornamen berlebihan.
- **RHYTHM: 2 (Consistent with structured breaks)**. Menggabungkan ringkasan total saldo di bagian atas, kartu dompet modular, aksi cepat (catat manual / pindai struk), dan stream transaksi kronologis yang mudah dibaca.
- **MOTION: 1 (Hover states & smooth transitions only)**. Animasi fungsional untuk perpindahan tab, pembukaan modal, dan drawer navigasi mobile. Tanpa efek bouncing atau looping tanpa henti.

## 3. Color Palette (R-29: 2-3 Core + 1 Accent)
- **Neutral Base (Slate)**:
  - Light mode:
    - Background: `#F8FAFC` (Slate 50)
    - Card/Surface: `#FFFFFF` (White)
    - Border: `#E2E8F0` (Slate 200)
    - Text Primary: `#0F172A` (Slate 900)
    - Text Secondary: `#475569` (Slate 600)
  - Dark mode:
    - Background: `#0B0F17` (Deep Ink)
    - Card/Surface: `#131B2A` (Dark Slate)
    - Border: `#23324A` (Muted Blue Slate)
    - Text Primary: `#F8FAFC` (Slate 50)
    - Text Secondary: `#94A3B8` (Slate 400)
- **Primary / Growth Accent**: Emerald (`#059669` / `#10B981` in dark)
  - Digunakan khusus untuk total tabungan, pemasukan, dan konfirmasi aksi utama.
- **Expense Accent**: Rose (`#E11D48` / `#F43F5E` in dark)
  - Digunakan khusus untuk pengeluaran dan status debet.
- **Contrast Guarantee**: Seluruh teks telah memenuhi rasio kontras WCAG AA (minimal 4.5:1 untuk teks standar dan 3:1 untuk teks besar).

## 4. Typography (R-06)
- **Primary Typeface**: Plus Jakarta Sans, didukung fallback `system-ui, -apple-system, sans-serif`.
- **Alasan Pemilihan**: Dirancang khusus untuk keterbacaan angka dan teks pada aplikasi fintech modern. Sangat jelas saat menampilkan nominal Rupiah dengan format desimal nol (contoh: `Rp 1.500.000`).
- **Skala Ukuran**:
  - H1 / Saldo Utama: 32px (2rem) bold
  - H2 / Sub-judul: 20px (1.25rem) semibold
  - H3 / Judul Kartu: 16px (1rem) semibold
  - Body: 14px (0.875rem) regular
  - Caption / Metadata: 12px (0.75rem) medium

## 5. Layout & Breakpoints (R-03, R-05)
- **Mobile (< 768px)**:
  - Header ramping dengan profil user, nama aplikasi, dan tombol tema.
  - Kartu ringkasan total saldo semua dompet.
  - Horizontal swipe / list vertikal untuk kartu dompet.
  - Bottom navigation bar yang mudah dijangkau satu tangan dengan 4 menu utama: Dashboard, Dompet, Transaksi, dan Pindai Struk.
  - Tombol aksi cepat tambah transaksi dengan tap target minimal 44px.
- **Desktop (>= 768px)**:
  - Sidebar ergonomis di sebelah kiri yang mencakup navigasi, ringkasan singkat profil, dan status koneksi Supabase.
  - Main content responsif terstruktur (Dashboard overview, grid kartu dompet, tabel/daftar transaksi dengan filter lengkap).

## 6. Functional & Craftsmanship Commitments (C-1 s/d C-5)
- Tanpa karakter em dash (R-02 dipatuhi).
- Tanpa data palsu atau angka bohongan (R-17 & R-38). Empty state jelas mengarahkan user untuk membuat dompet atau transaksi pertama.
- Semua elemen interaktif (filter, modal, form input, hapus, edit, upload/kamera struk, tema) berfungsi penuh (R-26).
- State lengkap tersedia: Loading skeleton, Empty state, dan Error state (R-27).

