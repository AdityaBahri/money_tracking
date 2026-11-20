import { Transaction, Wallet, Debt, UserProfile } from '@/types/finance';
import { formatRupiah, formatTanggalIndo, getDeviceLocalDate } from '@/lib/formatters';

/**
 * Mengonversi teks ke format kolom CSV yang aman (escape kutip ganda dan karakter khusus)
 */
function escapeCSV(text: string | number | undefined | null): string {
  if (text === undefined || text === null) return '""';
  const str = String(text);
  // Gandakan tanda kutip untuk standar RFC 4180
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Ekspor daftar transaksi keuangan ke format CSV (Excel / Google Sheets / Numbers)
 * Menggunakan UTF-8 BOM agar terbaca sempurna tanpa distorsi karakter di Excel Windows/Mac
 */
export function exportTransactionsToCSV(
  transactions: Transaction[],
  wallets: Wallet[],
  filenamePrefix = 'SakuRapi_Catatan_Keuangan'
): boolean {
  if (typeof window === 'undefined') return false;

  const getWalletName = (id?: string) => {
    if (!id) return '-';
    const w = wallets.find((item) => item.id === id);
    return w ? w.name : 'Dompet';
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'income':
        return 'Pemasukan';
      case 'expense':
        return 'Pengeluaran';
      case 'transfer':
        return 'Transfer Saldo';
      default:
        return type;
    }
  };

  // Header kolom laporan
  const headers = [
    'No',
    'Tanggal',
    'Tipe Transaksi',
    'Kategori',
    'Dompet Sumber',
    'Dompet Tujuan',
    'Keterangan',
    'Nominal (IDR)',
    'Merchant Struk',
  ];

  const rows: string[] = [];
  rows.push(headers.map((h) => escapeCSV(h)).join(','));

  transactions.forEach((tx, idx) => {
    const row = [
      idx + 1,
      tx.transaction_date,
      getTypeName(tx.type),
      tx.category_name,
      getWalletName(tx.wallet_id),
      tx.target_wallet_id ? getWalletName(tx.target_wallet_id) : '-',
      tx.description,
      Math.round(tx.amount),
      tx.receipt_data?.merchant || '-',
    ];
    rows.push(row.map((val) => escapeCSV(val)).join(','));
  });

  const csvContent = rows.join('\r\n');
  // Tambahkan UTF-8 BOM (\uFEFF)
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const today = getDeviceLocalDate();
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filenamePrefix}_${today}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
}

/**
 * Ekspor seluruh data keuangan (Dompet, Transaksi, Utang Piutang) ke format JSON
 * Berguna untuk pencadangan (backup) data lengkap pengguna
 */
export function exportFullDataToJSON(data: {
  user: UserProfile | null;
  wallets: Wallet[];
  transactions: Transaction[];
  debts: Debt[];
}): boolean {
  if (typeof window === 'undefined') return false;

  const today = getDeviceLocalDate();
  const backupPayload = {
    application: 'SakuRapi',
    version: '2.0',
    exported_at: new Date().toISOString(),
    export_date: today,
    user: data.user,
    summary: {
      total_wallets: data.wallets.length,
      total_transactions: data.transactions.length,
      total_debts: data.debts.length,
    },
    wallets: data.wallets,
    transactions: data.transactions,
    debts: data.debts,
  };

  const jsonStr = JSON.stringify(backupPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `SakuRapi_Cadangan_Data_${today}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
}

/**
 * Membuka jendela pratinjau laporan keuangan siap cetak / simpan ke PDF
 */
export function printFinancialReport(data: {
  transactions: Transaction[];
  wallets: Wallet[];
  user: UserProfile | null;
  periodLabel: string;
}): void {
  if (typeof window === 'undefined') return;

  const today = getDeviceLocalDate();
  const getWalletName = (id?: string) => {
    if (!id) return '-';
    const w = data.wallets.find((item) => item.id === id);
    return w ? w.name : 'Dompet';
  };

  let totalIncome = 0;
  let totalExpense = 0;
  data.transactions.forEach((tx) => {
    if (tx.type === 'income') totalIncome += Number(tx.amount) || 0;
    if (tx.type === 'expense') totalExpense += Number(tx.amount) || 0;
  });
  const netCashflow = totalIncome - totalExpense;

  const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Laporan Keuangan SakuRapi - ${today}</title>
  <style>
    @page {
      size: A4;
      margin: 1.5cm;
    }
    * {
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    body {
      background-color: #ffffff;
      color: #1c1c1e;
      margin: 0;
      padding: 24px;
      font-size: 12px;
      line-height: 1.5;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #007aff;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .brand h1 {
      margin: 0;
      font-size: 22px;
      font-weight: 800;
      color: #007aff;
      letter-spacing: -0.5px;
    }
    .brand p {
      margin: 2px 0 0;
      font-size: 11px;
      color: #6c6c70;
    }
    .meta {
      text-align: right;
      font-size: 11px;
      color: #3a3a3c;
    }
    .meta strong {
      display: block;
      color: #000000;
      font-size: 12px;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }
    .card {
      background: #f2f2f7;
      border-radius: 12px;
      padding: 12px 14px;
      border: 1px solid #e5e5ea;
    }
    .card .title {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6c6c70;
      margin-bottom: 4px;
    }
    .card .value {
      font-size: 16px;
      font-weight: 700;
    }
    .val-income { color: #34c759; }
    .val-expense { color: #ff3b30; }
    .val-net { color: #007aff; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      font-size: 11px;
    }
    th {
      background-color: #f2f2f7;
      color: #48484a;
      font-weight: 600;
      text-align: left;
      padding: 8px 10px;
      border-bottom: 1px solid #d1d1d6;
    }
    td {
      padding: 8px 10px;
      border-bottom: 1px solid #e5e5ea;
      vertical-align: middle;
    }
    tr:nth-child(even) td {
      background-color: #fafafa;
    }
    .type-badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 6px;
      font-size: 9px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge-income { background-color: #e8f8ec; color: #1e824c; }
    .badge-expense { background-color: #feebe9; color: #d70015; }
    .badge-transfer { background-color: #eef2ff; color: #4338ca; }
    .footer {
      border-top: 1px solid #e5e5ea;
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      color: #8e8e93;
      font-size: 10px;
    }
    .actions-bar {
      margin-bottom: 20px;
      display: flex;
      gap: 8px;
    }
    .btn {
      background-color: #007aff;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-secondary {
      background-color: #e5e5ea;
      color: #1c1c1e;
    }
    @media print {
      .actions-bar { display: none; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="actions-bar">
    <button class="btn" onclick="window.print()">Cetak / Simpan sebagai PDF</button>
    <button class="btn btn-secondary" onclick="window.close()">Tutup</button>
  </div>

  <div class="header">
    <div class="brand">
      <h1>SakuRapi</h1>
      <p>Laporan Resmi Rekapitulasi Catatan Keuangan Pribadi</p>
    </div>
    <div class="meta">
      <strong>${data.user?.full_name || data.user?.username || 'Pengguna SakuRapi'}</strong>
      <span>Periode: ${data.periodLabel}</span><br>
      <span>Dicetak pada: ${formatTanggalIndo(today)}</span>
    </div>
  </div>

  <div class="cards-grid">
    <div class="card">
      <div class="title">Total Pemasukan</div>
      <div class="value val-income">+ ${formatRupiah(totalIncome)}</div>
    </div>
    <div class="card">
      <div class="title">Total Pengeluaran</div>
      <div class="value val-expense">- ${formatRupiah(totalExpense)}</div>
    </div>
    <div class="card">
      <div class="title">Arus Kas Bersih (Selisih)</div>
      <div class="value val-net">${netCashflow >= 0 ? '+ ' : ''}${formatRupiah(netCashflow)}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 35px;">No</th>
        <th style="width: 90px;">Tanggal</th>
        <th style="width: 90px;">Tipe</th>
        <th>Keterangan / Kategori</th>
        <th style="width: 110px;">Dompet</th>
        <th style="width: 120px; text-align: right;">Nominal</th>
      </tr>
    </thead>
    <tbody>
      ${
        data.transactions.length === 0
          ? `<tr><td colspan="6" style="text-align: center; padding: 24px; color: #8e8e93;">Tidak ada transaksi pada periode ini</td></tr>`
          : data.transactions
              .map((tx, idx) => {
                const isIncome = tx.type === 'income';
                const isExpense = tx.type === 'expense';
                const typeClass = isIncome ? 'badge-income' : isExpense ? 'badge-expense' : 'badge-transfer';
                const typeText = isIncome ? 'Pemasukan' : isExpense ? 'Pengeluaran' : 'Transfer';
                const amountSign = isIncome ? '+ ' : isExpense ? '- ' : '';
                const amountColor = isIncome ? '#34c759' : isExpense ? '#ff3b30' : '#4338ca';

                return `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${formatTanggalIndo(tx.transaction_date)}</td>
                  <td><span class="type-badge ${typeClass}">${typeText}</span></td>
                  <td>
                    <strong>${tx.description || '-'}</strong>
                    <div style="font-size: 10px; color: #8e8e93;">${tx.category_name}${tx.receipt_data?.merchant ? ` &bull; Struk: ${tx.receipt_data.merchant}` : ''}</div>
                  </td>
                  <td>
                    ${getWalletName(tx.wallet_id)}
                    ${tx.target_wallet_id ? `<span style="color:#8e8e93;"> &rarr; ${getWalletName(tx.target_wallet_id)}</span>` : ''}
                  </td>
                  <td style="text-align: right; font-weight: 700; color: ${amountColor};">
                    ${amountSign}${formatRupiah(tx.amount)}
                  </td>
                </tr>
              `;
              })
              .join('')
      }
    </tbody>
  </table>

  <div class="footer">
    <span>Dicetak secara otomatis dari aplikasi SakuRapi</span>
    <span>Halaman 1 dari 1</span>
  </div>
</body>
</html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}
