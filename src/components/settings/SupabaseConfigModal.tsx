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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="supabase-modal-title"
    >
      <div className="w-full max-w-lg bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Database className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="supabase-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                Konfigurasi Database Supabase
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Panduan menghubungkan aplikasi ke Supabase & Vercel
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsSupabaseModalOpen(false)}
            className="tap-target p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Tutup dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Current Status Banner */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
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

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Aplikasi SakuRapi telah dirancang siap produksi untuk di-hosting di Vercel dan menggunakan Supabase sebagai database PostgreSQL serta otentikasi.
          </p>

          {/* Steps */}
          <div className="space-y-3 pt-1">
            <h3 className="font-bold text-slate-900 dark:text-white">
              Langkah Menghubungkan Supabase:
            </h3>

            <div className="space-y-2.5">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  1. Buat Proyek di Supabase
                </span>
                <span className="text-slate-600 dark:text-slate-400 block">
                  Buka dashboard Supabase Anda lalu buat proyek baru (free tier didukung penuh).
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  2. Eksekusi Skrip SQL Skema
                </span>
                <span className="text-slate-600 dark:text-slate-400 block">
                  Buka menu <strong>SQL Editor</strong> di Supabase dan jalankan seluruh isi file{' '}
                  <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[11px]">
                    supabase/schema.sql
                  </code>{' '}
                  yang sudah disediakan di dalam repositori ini.
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    3. Masukkan Environment Variables
                  </span>
                  <button
                    type="button"
                    onClick={copyEnvSnippet}
                    className="tap-target px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center gap-1 font-semibold text-[10px]"
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
                <span className="text-slate-600 dark:text-slate-400 block mb-2">
                  Salin Project URL dan Anon Key dari Project Settings &gt; API, lalu tambahkan ke{' '}
                  <code className="font-mono text-[11px]">.env.local</code> (untuk pengujian lokal) atau menu Environment Variables di Vercel Dashboard.
                </span>
                <pre className="p-2 rounded bg-slate-900 text-slate-200 text-[10px] font-mono overflow-x-auto">
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
              className="tap-target w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-xl transition-colors"
            >
              Tutup Panduan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
