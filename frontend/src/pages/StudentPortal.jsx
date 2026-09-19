import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import CameraCapture from '../components/CameraCapture';
import AudioRecorder from '../components/AudioRecorder';
import SubjectCard from '../components/SubjectCard';
import {
  GraduationCap,
  Camera,
  Plus,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StudentPortal({ onBack }) {
  const { user, role, loginStudent } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // Authentication & Scanning State
  const [isScanning, setIsScanning] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [capturedPhotoBlob, setCapturedPhotoBlob] = useState(null);

  // Registration Fields
  const [regName, setRegName] = useState('');
  const [regAudioBlob, setRegAudioBlob] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // Enrollment State
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollCode, setEnrollCode] = useState('');
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Quick Join via URL param ?join-code=CS101
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get('join-code');
    if (joinCode && user?.student_id) {
      setEnrollCode(joinCode);
      setShowEnrollModal(true);
    }
  }, [user]);

  // Fetch Student's Enrolled Courses
  const fetchCourses = async () => {
    if (!user?.student_id) return;
    setLoadingCourses(true);
    try {
      const res = await api.getStudentDashboard(user.student_id);
      if (res.success) {
        setCourses(res.enrolled_courses || []);
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    if (user?.student_id) {
      fetchCourses();
    }
  }, [user]);

  // Handle FaceID Snapshot
  const handleFaceCapture = async (blob) => {
    setCapturedPhotoBlob(blob);
    setIsScanning(true);
    setAuthError(null);

    try {
      const res = await api.loginWithFace(blob);
      if (res.success && res.recognized && res.student) {
        loginStudent(res.student);
        confetti({ particleCount: 60, spread: 50 });
      } else {
        // Face not recognized -> offer registration
        setAuthError(res.error || res.message || 'Face not recognized. Please register your profile below.');
        setShowRegister(true);
      }
    } catch (err) {
      setAuthError(err.message || 'Face scanning failed. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  // Handle Student Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName.trim()) {
      alert('Please enter your full name.');
      return;
    }
    if (!capturedPhotoBlob) {
      alert('Please capture a face photo first.');
      return;
    }

    setIsRegistering(true);
    try {
      const res = await api.registerStudent(regName.trim(), capturedPhotoBlob, regAudioBlob);
      if (res.success && res.student) {
        loginStudent(res.student);
        setShowRegister(false);
        confetti({ particleCount: 100, spread: 70 });
      }
    } catch (err) {
      alert(`Registration failed: ${err.message}`);
    } finally {
      setIsRegistering(false);
    }
  };

  // Enroll in course
  const handleEnrollCourse = async (e) => {
    e.preventDefault();
    if (!enrollCode.trim()) return;

    setIsEnrolling(true);
    try {
      // 1. Get subject by code
      const subRes = await api.getSubjectByCode(enrollCode.trim().toUpperCase());
      if (subRes.success && subRes.subject) {
        const subId = subRes.subject.subject_id;
        const enrollRes = await api.enrollStudent(user.student_id, subId);
        if (enrollRes.success) {
          setShowEnrollModal(false);
          setEnrollCode('');
          // Clear query param if present
          window.history.replaceState({}, document.title, window.location.pathname);
          fetchCourses();
          confetti({ particleCount: 60, spread: 60 });
        }
      }
    } catch (err) {
      alert(`Enrollment failed: ${err.message}`);
    } finally {
      setIsEnrolling(false);
    }
  };

  // Unenroll from course
  const handleUnenroll = async (subjectId) => {
    if (!confirm('Are you sure you want to unenroll from this course?')) return;
    try {
      await api.unenrollStudent(user.student_id, subjectId);
      fetchCourses();
    } catch (err) {
      alert(`Unenrollment failed: ${err.message}`);
    }
  };

  // ==========================================
  // VIEW 1: AUTHENTICATED STUDENT DASHBOARD
  // ==========================================
  if (user && role === 'student') {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <span className="text-xs font-bold text-accent-pink uppercase tracking-wider">Student Dashboard</span>
            <h1 className="text-2xl font-black text-slate-900 mt-0.5">Welcome, {user.name}</h1>
            <p className="text-xs text-slate-500">Track your attendance rate and course enrollments</p>
          </div>

          <button
            onClick={() => setShowEnrollModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-accent-pink hover:bg-pink-600 text-white text-xs font-bold rounded-xl shadow-md shadow-pink-500/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll in Subject</span>
          </button>
        </div>

        {/* Courses Section */}
        <div>
          <h2 className="text-lg font-black text-slate-900 mb-4">Your Enrolled Courses</h2>

          {loadingCourses ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-36 bg-white rounded-2xl animate-pulse border border-slate-200"></div>
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.map((course) => (
                <SubjectCard
                  key={course.subject_id}
                  subject={course}
                  isTeacher={false}
                  onUnenroll={handleUnenroll}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center flex flex-col items-center justify-center">
              <BookOpen className="w-10 h-10 text-slate-300 mb-2" />
              <h3 className="text-sm font-bold text-slate-700">No courses joined yet</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Ask your teacher for the course code or scan their classroom QR code to enroll.
              </p>
              <button
                onClick={() => setShowEnrollModal(true)}
                className="px-4 py-2 bg-accent-pink text-white text-xs font-bold rounded-xl"
              >
                Enter Course Code
              </button>
            </div>
          )}
        </div>

        {/* Enroll Modal */}
        {showEnrollModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
              <h3 className="text-base font-black text-slate-900 mb-1">Enroll in Course</h3>
              <p className="text-xs text-slate-500 mb-4">Enter the subject code given by your instructor</p>

              <form onSubmit={handleEnrollCourse} className="flex flex-col gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS101"
                    value={enrollCode}
                    onChange={(e) => setEnrollCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl uppercase font-mono focus:outline-hidden focus:border-accent-pink"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowEnrollModal(false)}
                    className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isEnrolling}
                    className="px-4 py-2 bg-accent-pink hover:bg-pink-600 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1"
                  >
                    {isEnrolling && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Enroll Now</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 2: UNREGISTERED / FACEID LOGIN SCANNER
  // ==========================================
  return (
    <div className="max-w-md mx-auto px-4 py-10 flex flex-col items-center">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="self-start mb-6 flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      <div className="w-full flex flex-col items-center mb-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-pink-50 text-accent-pink flex items-center justify-center mb-2">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Student FaceID Login</h2>
        <p className="text-xs text-slate-500">Look directly into the camera to authenticate or register</p>
      </div>

      {/* Alert if not recognized */}
      {authError && (
        <div className="w-full mb-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{authError}</span>
        </div>
      )}

      {/* Live Camera Scanner */}
      <div className="w-full">
        <CameraCapture
          title="Student FaceID Scanner"
          onCapture={handleFaceCapture}
        />
      </div>

      {/* Scanning status */}
      {isScanning && (
        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-brand-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Scanning face biometric features...</span>
        </div>
      )}

      {/* Registration Section (Visible if face is not recognized) */}
      {showRegister && (
        <div className="w-full mt-6 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xl animate-in slide-in-from-bottom-3 duration-300">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent-pink" />
            <h3 className="font-extrabold text-base text-slate-900">Register New Student Profile</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            We will attach your facial embedding to your student account.
          </p>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Maya Patel"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-accent-pink"
              />
            </div>

            {/* Optional Voice Recording */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Optional: Voice Sample
              </label>
              <AudioRecorder
                label="Record Voice (e.g. 'Present, Maya')"
                onAudioRecorded={(blob) => setRegAudioBlob(blob)}
              />
            </div>

            <button
              type="submit"
              disabled={isRegistering}
              className="w-full mt-2 py-3 bg-gradient-to-r from-accent-pink to-rose-600 hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-md shadow-pink-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isRegistering && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Complete Profile Registration</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
