import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-black/[0.02] dark:bg-white/[0.02] border border-dashed border-black/10 dark:border-white/10 rounded-3xl my-4">
      <div className="w-12 h-12 rounded-2xl bg-black/[0.04] dark:bg-[#2C2C2E] flex items-center justify-center text-[#6C6C70] dark:text-[#8E8E93] mb-3">
        <Icon className="w-6 h-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-[#6C6C70] dark:text-[#8E8E93] max-w-sm mb-4 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="apple-button tap-target px-5 py-2.5 text-xs font-semibold text-white bg-[#007AFF] hover:bg-[#0071E3] dark:bg-[#0A84FF] rounded-2xl transition-all shadow-xs"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

