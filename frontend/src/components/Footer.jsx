import React from 'react';
import { Globe, Heart, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/60 py-6 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-brand-500" />
          <span className="font-medium text-slate-600">snap-ai.online</span>
          <span>• Production Ready</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Biometrics Encrypted
          </span>
          <span>•</span>
          <span>Face & Voice Attendance System</span>
        </div>
      </div>
    </footer>
  );
}
