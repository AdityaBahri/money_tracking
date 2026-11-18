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
  title: 'SakuRapi: Pelacak Keuangan Pribadi',
  description: 'Aplikasi pencatatan keuangan pribadi dengan pelacakan saldo multi-dompet, scan struk belanja, dan riwayat transaksi.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', sizes: '1024x1024', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '1024x1024', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} h-full`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('sakurapi_theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-[#F2F2F7] dark:bg-black text-slate-900 dark:text-white min-h-full" suppressHydrationWarning>
        <FinanceProvider>
          {children}
        </FinanceProvider>
      </body>
    </html>
  );
}
