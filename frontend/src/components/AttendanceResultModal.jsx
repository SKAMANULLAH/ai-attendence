import React, { useState } from 'react';
import { CheckCircle2, XCircle, Save, X, Sparkles, Check, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AttendanceResultModal({ results: initialResults, logs: initialLogs, isOpen, onClose, onSave }) {
  const [results, setResults] = useState(initialResults || []);
  const [logs, setLogs] = useState(initialLogs || []);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !results.length) return null;

  // Toggle present/absent manually if the teacher wants to override an AI detection
  const toggleStatus = (studentId) => {
    setResults((prev) =>
      prev.map((item) => {
        if (item.student_id === studentId) {
          const newStatus = !item.is_present;
          return {
            ...item,
            is_present: newStatus,
            source: newStatus ? 'Manual Override' : 'Manual Override (Absent)'
          };
        }
        return item;
      })
    );

    setLogs((prev) =>
      prev.map((log) => {
        if (log.student_id === studentId) {
          return { ...log, is_present: !log.is_present };
        }
        return log;
      })
    );
  };

  const handleConfirm = async () => {
    setIsSaving(true);
    try {
      await onSave(logs);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
      onClose();
    } catch (err) {
      alert(`Failed to save attendance: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const presentCount = results.filter((r) => r.is_present).length;
  const totalCount = results.length;
  const percentage = Math.round((presentCount / totalCount) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-pink flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">Review AI Attendance</h3>
            <p className="text-xs text-slate-500">
              Verify detected students and click rows to manually toggle attendance status.
            </p>
          </div>
        </div>

        {/* Summary Stats Banner */}
        <div className="flex items-center justify-between p-3.5 bg-brand-50/70 border border-brand-200/60 rounded-2xl mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-brand-900">Attendance Rate:</span>
            <span className="text-sm font-extrabold text-brand-600 font-mono">{percentage}%</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> {presentCount} Present
            </span>
            <span className="text-rose-600 flex items-center gap-1">
              <XCircle className="w-4 h-4" /> {totalCount - presentCount} Absent
            </span>
          </div>
        </div>

        {/* Results Table */}
        <div className="flex-1 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 sticky top-0 font-bold text-slate-600">
              <tr>
                <th className="py-2.5 px-4">Student Name</th>
                <th className="py-2.5 px-3">ID</th>
                <th className="py-2.5 px-3">Detection Source</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((student) => (
                <tr
                  key={student.student_id}
                  onClick={() => toggleStatus(student.student_id)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                  title="Click to toggle Present/Absent"
                >
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {student.name}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">
                    #{student.student_id}
                  </td>
                  <td className="py-3 px-3 text-[11px] text-slate-500">
                    {student.source}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {student.is_present ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <Check className="w-3 h-3" /> Present
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                        <X className="w-3 h-3" /> Absent
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Discard
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-md shadow-brand-500/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving to Database...' : 'Confirm & Save Records'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
