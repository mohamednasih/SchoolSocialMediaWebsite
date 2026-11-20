import React from "react";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  onBack?: () => void;
}

export function PageHeader({ title, subtitle, badge, action, onBack }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex min-h-[64px] items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft size={19} />
          </button>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h1 className="truncate text-lg font-black tracking-tight text-slate-900 sm:text-xl">
              {title}
            </h1>
            {badge}
          </div>
          {subtitle && <p className="truncate text-xs font-medium text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </header>
  );
}
