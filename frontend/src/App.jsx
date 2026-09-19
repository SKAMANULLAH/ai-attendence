import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import TeacherAuthPage from './pages/TeacherAuthPage';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentPortal from './pages/StudentPortal';

export default function App() {
  const { user, role } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  // Automatic routing based on authentication and URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get('join-code');

    // If join code is provided in URL, prioritize student portal
    if (joinCode) {
      setCurrentPage('student');
      return;
    }

    if (user) {
      if (role === 'teacher') {
        setCurrentPage('teacher-dashboard');
      } else if (role === 'student') {
        setCurrentPage('student');
      }
    } else {
      if (currentPage === 'teacher-dashboard') {
        setCurrentPage('home');
      }
    }
  }, [user, role]);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#F4F6FB] text-slate-900 selection:bg-brand-500 selection:text-white">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage onSelectRole={(target) => handleNavigate(target)} />
        )}

        {currentPage === 'teacher-auth' && (
          <TeacherAuthPage
            onBack={() => handleNavigate('home')}
            onLoginSuccess={() => handleNavigate('teacher-dashboard')}
          />
        )}

        {currentPage === 'teacher-dashboard' && (
          <TeacherDashboard />
        )}

        {currentPage === 'student' && (
          <StudentPortal onBack={() => handleNavigate('home')} />
        )}
      </main>

      <Footer />
    </div>
  );
}
