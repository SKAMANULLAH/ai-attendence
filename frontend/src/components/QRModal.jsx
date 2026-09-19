import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, QrCode } from 'lucide-react';

export default function QRModal({ subject, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  if (!isOpen || !subject) return null;

  const currentDomain = window.location.origin;
  const joinUrl = `${currentDomain}/?join-code=${subject.subject_code}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 mb-2">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-slate-900">{subject.name}</h3>
          <p className="text-xs text-slate-500">
            Code: <span className="font-mono font-bold text-brand-600">{subject.subject_code}</span> • Section: {subject.section}
          </p>
        </div>

        {/* QR Code Graphic */}
        <div className="flex justify-center p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-5">
          <QRCodeSVG
            value={joinUrl}
            size={190}
            level="H"
            includeMargin={true}
            className="rounded-lg shadow-xs"
          />
        </div>

        {/* Copy Join Link Section */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Shareable Enrollment Link
          </label>
          <div className="flex items-center gap-2 p-2 bg-slate-100 border border-slate-200 rounded-xl">
            <input
              type="text"
              readOnly
              value={joinUrl}
              className="flex-1 bg-transparent text-xs text-slate-700 outline-hidden font-mono select-all"
            />
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0 shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 text-center mt-1">
            Students can scan this QR code with their mobile phone or click the link to enroll.
          </p>
        </div>
      </div>
    </div>
  );
}
