import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'teacher' | 'student' | null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage on refresh
    const savedUser = localStorage.getItem('snap_ai_user');
    const savedRole = localStorage.getItem('snap_ai_role');

    if (savedUser && savedRole) {
      try {
        setUser(JSON.parse(savedUser));
        setRole(savedRole);
      } catch (e) {
        localStorage.removeItem('snap_ai_user');
        localStorage.removeItem('snap_ai_role');
      }
    }
    setLoading(false);
  }, []);

  const loginTeacher = (teacherData) => {
    setUser(teacherData);
    setRole('teacher');
    localStorage.setItem('snap_ai_user', JSON.stringify(teacherData));
    localStorage.setItem('snap_ai_role', 'teacher');
  };

  const loginStudent = (studentData) => {
    setUser(studentData);
    setRole('student');
    localStorage.setItem('snap_ai_user', JSON.stringify(studentData));
    localStorage.setItem('snap_ai_role', 'student');
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('snap_ai_user');
    localStorage.removeItem('snap_ai_role');
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, loginTeacher, loginStudent, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
