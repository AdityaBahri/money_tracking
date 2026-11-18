'use client';

import React, { useState, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { X, Database, Check, Copy, ShieldCheck } from 'lucide-react';

export function SupabaseConfigModal() {
  const { isSupabaseModalOpen, setIsSupabaseModalOpen, isSupabase } = useFinance();
  const [copied, setCopied] = useState(false);

  // Handle ESC key (R-32)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSupabaseModalOpen) {
        setIsSupabaseModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSupabaseModalOpen, setIsSupabaseModalOpen]);

  if (!isSupabaseModalOpen) return null;

  const copyEnvSnippet = () => {
    const text = `NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="supabase-modal-title"
    >
      <div className="w-full max-w-lg bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-black/[0.05] dark:border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#007AFF]/15 text-[#007AFF] dark:text-[#0A84FF] flex items-center justify-center">
              <Database className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="supabase-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                Konfigurasi Database Supabase
              </h2>
              <p className="text-xs text-[#6C6C70] dark:text-[#8E8E93]">
                Panduan menghubungkan aplikasi ke Supabase &amp; Vercel
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsSupabaseModalOpen(false)}
            className="apple-button tap-target p-2 rounded-2xl text-[#8E8E93] hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-[#2C2C2E] transition-colors"
            aria-label="Tutup dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Current Status Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
              isSupabase
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${isSupabase ? 'bg-emerald-500' : 'bg-amber-500'}`}
                aria-hidden="true"
              />
              <span className="font-semibold">
                Status Saat Ini: {isSupabase ? 'Supabase Terhubung' : 'Penyimpanan Lokal Aktif (Offline Ready)'}
              </span>
            </div>
            {isSupabase && <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />}
          </div>

          <p className="text-[#6C6C70] dark:text-[#8E8E93] leading-relaxed">
            Aplikasi SakuRapi telah dirancang siap produksi untuk di-hosting di Vercel dan menggunakan Supabase sebagai database PostgreSQL serta otentikasi.
          </p>

          {/* Steps */}
          <div className="space-y-3 pt-1">
            <h3 className="font-bold text-slate-900 dark:text-white">
              Langkah Menghubungkan Supabase:
            </h3>

            <div className="space-y-2.5">
              <div className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-[#2C2C2E]/60 border border-black/[0.04] dark:border-white/[0.06]">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  1. Buat Proyek di Supabase
                </span>
                <span className="text-[#6C6C70] dark:text-[#8E8E93] block">
                  Buka dashboard Supabase Anda lalu buat proyek baru (free tier didukung penuh).
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-[#2C2C2E]/60 border border-black/[0.04] dark:border-white/[0.06]">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  2. Eksekusi Skrip SQL Skema
                </span>
                <span className="text-[#6C6C70] dark:text-[#8E8E93] block">
                  Buka menu <strong>SQL Editor</strong> di Supabase dan jalankan seluruh isi file{' '}
                  <code className="px-1.5 py-0.5 rounded bg-black/[0.06] dark:bg-[#3A3A3C] font-mono text-[11px]">
                    supabase/schema.sql
                  </code>{' '}
                  yang sudah disediakan di dalam repositori ini.
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-[#2C2C2E]/60 border border-black/[0.04] dark:border-white/[0.06]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    3. Masukkan Environment Variables
                  </span>
                  <button
                    type="button"
                    onClick={copyEnvSnippet}
                    className="apple-button tap-target px-2.5 py-1 rounded-xl bg-white dark:bg-[#3A3A3C] border border-black/[0.08] dark:border-white/[0.1] text-slate-700 dark:text-slate-200 hover:bg-black/[0.04] flex items-center gap-1 font-semibold text-[10px]"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                        <span>Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" aria-hidden="true" />
                        <span>Salin Format</span>
                      </>
                    )}
                  </button>
                </div>
                <span className="text-[#6C6C70] dark:text-[#8E8E93] block mb-2">
                  Salin Project URL dan Anon Key dari Project Settings &gt; API, lalu tambahkan ke{' '}
                  <code className="font-mono text-[11px]">.env.local</code> (untuk pengujian lokal) atau menu Environment Variables di Vercel Dashboard.
                </span>
                <pre className="p-2.5 rounded-xl bg-black/90 text-slate-200 text-[10px] font-mono overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...`}
                </pre>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsSupabaseModalOpen(false)}
              className="apple-button tap-target w-full py-3 px-4 text-xs font-semibold text-white bg-[#007AFF] hover:bg-[#0071E3] dark:bg-[#0A84FF] rounded-2xl transition-all shadow-xs"
            >
              Tutup Panduan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
