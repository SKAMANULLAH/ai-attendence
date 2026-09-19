import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { School, KeyRound, User, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function TeacherAuthPage({ onBack, onLoginSuccess }) {
  const { loginTeacher } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form Fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.teacherLogin(username, password);
        if (res.success && res.teacher) {
          loginTeacher(res.teacher);
          onLoginSuccess();
        } else {
          setError(res.message || 'Login failed');
        }
      } else {
        const res = await api.teacherRegister(username, password, name);
        if (res.success) {
          alert('Account created successfully! Please log in.');
          setIsLogin(true);
        } else {
          setError(res.message || 'Registration failed');
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 flex flex-col items-center">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="self-start mb-6 flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      {/* Main Card */}
      <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 mx-auto mb-4">
          <School className="w-6 h-6" />
        </div>

        <h2 className="text-xl font-black text-slate-900 text-center mb-1">
          {isLogin ? 'Teacher Sign In' : 'Register Teacher Account'}
        </h2>
        <p className="text-xs text-slate-500 text-center mb-6">
          {isLogin
            ? 'Enter your credentials to access class attendance records'
            : 'Create your instructor profile to manage courses'}
        </p>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. alexjohnson"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
          </button>
        </form>

        {/* Switch Between Login and Register */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            {isLogin
              ? "Don't have an account? Register instead"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
