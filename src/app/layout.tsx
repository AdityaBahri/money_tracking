import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { FinanceProvider } from '@/context/FinanceContext';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'SakuRapi - Pelacak Keuangan Pribadi',
  description: 'Aplikasi pencatatan keuangan pribadi dengan pelacakan saldo multi-dompet, scan struk belanja, dan riwayat transaksi.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} h-full`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 min-h-full">
        <FinanceProvider>
          {children}
        </FinanceProvider>
      </body>
    </html>
  );
}
