import React from 'react';
import { BookOpen, Users, Clock, QrCode, Trash2, Award } from 'lucide-react';

export default function SubjectCard({ subject, isTeacher = false, onShare, onUnenroll }) {
  const percentage = subject.attendance_percentage ?? 0;

  // Percentage color coding
  const getBadgeColor = (val) => {
    if (val >= 75) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (val >= 60) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  const getProgressColor = (val) => {
    if (val >= 75) return 'bg-emerald-500';
    if (val >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden group">
      {/* Top accent border */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-500 via-accent-pink to-accent-cyan"></div>

      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="px-2 py-0.5 text-[11px] font-bold font-mono bg-brand-50 text-brand-700 rounded-md border border-brand-200/60">
              {subject.subject_code}
            </span>
            <span className="ml-2 text-xs font-semibold text-slate-400">
              Sec {subject.section}
            </span>
          </div>

          {!isTeacher && (
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getBadgeColor(percentage)}`}>
              {percentage}%
            </span>
          )}
        </div>

        {/* Course Name */}
        <h3 className="font-extrabold text-base text-slate-900 line-clamp-1 group-hover:text-brand-600 transition-colors">
          {subject.name}
        </h3>

        {/* Student View: Attendance Progress Bar */}
        {!isTeacher && (
          <div className="mt-3">
            <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
              <span>Attendance Rate</span>
              <span className="font-bold text-slate-700">
                {subject.attended_classes || 0} / {subject.total_classes || 0} Classes
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
                style={{ width: `${Math.min(100, percentage)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Teacher View: Stats Badges */}
        {isTeacher && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded-xl">
              <Users className="w-4 h-4 text-brand-500" />
              <div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase">Students</div>
                <div className="text-sm font-extrabold text-slate-800">{subject.total_students || 0}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded-xl">
              <Clock className="w-4 h-4 text-accent-pink" />
              <div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase">Sessions</div>
                <div className="text-sm font-extrabold text-slate-800">{subject.total_classes || 0}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        {isTeacher ? (
          <button
            onClick={() => onShare && onShare(subject)}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Share QR & Code</span>
          </button>
        ) : (
          <button
            onClick={() => onUnenroll && onUnenroll(subject.subject_id)}
            className="text-[11px] font-medium text-rose-500 hover:text-rose-700 flex items-center gap-1 transition-colors hover:underline"
          >
            <Trash2 className="w-3 h-3" /> Unenroll Course
          </button>
        )}
      </div>
    </div>
  );
}
