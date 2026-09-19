import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Camera, Sparkles, GraduationCap, School } from 'lucide-react';

export default function Navbar({ onNavigate, currentPage }) {
  const { user, role, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-pink flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-sans">Snap<span className="text-brand-500">AI</span></span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-brand-100 text-brand-700 rounded-md uppercase tracking-wider">v2.0</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">AI Biometric Attendance</p>
            </div>
          </div>

          {/* Navigation & User Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/60 text-xs font-medium">
                  {role === 'teacher' ? (
                    <School className="w-3.5 h-3.5 text-brand-600" />
                  ) : (
                    <GraduationCap className="w-3.5 h-3.5 text-accent-pink" />
                  )}
                  <span>{user.name || user.username}</span>
                  <span className="capitalize text-[10px] px-1.5 py-0.2 bg-white rounded-full font-bold shadow-xs">
                    {role}
                  </span>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('student')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                    currentPage === 'student'
                      ? 'bg-accent-pink text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Student</span>
                </button>
                <button
                  onClick={() => onNavigate('teacher-auth')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                    currentPage === 'teacher-auth' || currentPage === 'teacher-dashboard'
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <School className="w-3.5 h-3.5" />
                  <span>Teacher</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
