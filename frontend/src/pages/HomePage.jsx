import React from 'react';
import { Camera, Mic, GraduationCap, School, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function HomePage({ onSelectRole }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col items-center">
      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-semibold mb-6 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-accent-pink" />
        <span>Next-Gen Biometric Attendance</span>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 text-center tracking-tight leading-tight sm:leading-none mb-4">
        AI Attendance <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-accent-pink to-accent-cyan">in a Snap</span>
      </h1>
      
      <p className="max-w-xl text-center text-slate-600 text-sm sm:text-base mb-10 sm:mb-14">
        Say goodbye to manual roll calls. Mark instant attendance with classroom panoramic face analysis or sequential voice identification.
      </p>

      {/* Role Selection Cards (Mobile-first responsive grid) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl">
        {/* Student Portal Card */}
        <div 
          onClick={() => onSelectRole('student')}
          className="group relative bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-accent-pink/50 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-pink/5 rounded-full blur-2xl group-hover:bg-accent-pink/10 transition-colors"></div>

          <div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white mb-6 shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-7 h-7" />
            </div>

            <span className="text-xs font-bold text-accent-pink uppercase tracking-wider">Student Portal</span>
            <h2 className="text-2xl font-black text-slate-900 mt-1 mb-2">I'm a Student</h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Login seamlessly using FaceID with your webcam, check your real-time attendance percentage across courses, and join classes via QR code.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm font-bold text-accent-pink group-hover:translate-x-1 transition-transform">
            <span>Enter Student Portal</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Teacher Portal Card */}
        <div 
          onClick={() => onSelectRole('teacher-auth')}
          className="group relative bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-brand-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl group-hover:bg-brand-500/10 transition-colors"></div>

          <div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center text-white mb-6 shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <School className="w-7 h-7" />
            </div>

            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Instructor Portal</span>
            <h2 className="text-2xl font-black text-slate-900 mt-1 mb-2">I'm a Teacher</h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Create subjects, snap single or multiple classroom photos for automatic face attendance, record roll-call audio, and export historical logs.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm font-bold text-brand-600 group-hover:translate-x-1 transition-transform">
            <span>Enter Teacher Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="mt-16 sm:mt-24 w-full grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-white/60 border border-slate-200/70 rounded-2xl flex flex-col items-center">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-brand-600 flex items-center justify-center mb-2">
            <Camera className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-800">128-D Face Recognition</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Deep metric learning with Euclidean distance verification</p>
        </div>

        <div className="p-4 bg-white/60 border border-slate-200/70 rounded-2xl flex flex-col items-center">
          <div className="w-8 h-8 rounded-lg bg-pink-50 text-accent-pink flex items-center justify-center mb-2">
            <Mic className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-800">Voice Biometrics</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Silence-split VAD and speaker d-vector matching</p>
        </div>

        <div className="p-4 bg-white/60 border border-slate-200/70 rounded-2xl flex flex-col items-center">
          <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center mb-2">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-800">Cloud & Mobile Ready</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Instant mobile QR enrollments with live Supabase sync</p>
        </div>
      </div>
    </div>
  );
}
