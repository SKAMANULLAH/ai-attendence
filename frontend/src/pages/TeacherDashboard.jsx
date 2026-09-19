import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import SubjectCard from '../components/SubjectCard';
import CameraCapture from '../components/CameraCapture';
import AudioRecorder from '../components/AudioRecorder';
import QRModal from '../components/QRModal';
import AttendanceResultModal from '../components/AttendanceResultModal';
import {
  Camera,
  Mic,
  Plus,
  BookOpen,
  History,
  Users,
  Calendar,
  Sparkles,
  Upload,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('take-attendance'); // 'take-attendance' | 'subjects' | 'records'
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  // Take Attendance State
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [attendanceMode, setAttendanceMode] = useState('photo'); // 'photo' | 'voice'
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  // Attendance Results Modal State
  const [resultModalData, setResultModalData] = useState(null);

  // Create Subject Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newSection, setNewSection] = useState('A');
  const [isCreating, setIsCreating] = useState(false);

  // Share QR Modal State
  const [shareSubject, setShareSubject] = useState(null);

  // Attendance Records State
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  // Load Teacher's Subjects
  const fetchSubjects = async () => {
    if (!user?.teacher_id) return;
    setLoadingSubjects(true);
    try {
      const res = await api.getTeacherSubjects(user.teacher_id);
      if (res.success) {
        setSubjects(res.subjects || []);
        if (res.subjects?.length > 0 && !selectedSubjectId) {
          setSelectedSubjectId(res.subjects[0].subject_id);
        }
      }
    } catch (err) {
      console.error('Failed to load subjects:', err);
    } finally {
      setLoadingSubjects(false);
    }
  };

  // Load Historical Records
  const fetchRecords = async () => {
    if (!user?.teacher_id) return;
    setLoadingRecords(true);
    try {
      const res = await api.getTeacherRecords(user.teacher_id);
      if (res.success) {
        setRecords(res.sessions || []);
      }
    } catch (err) {
      console.error('Failed to load records:', err);
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [user]);

  useEffect(() => {
    if (activeTab === 'records') {
      fetchRecords();
    }
  }, [activeTab]);

  // Handle Photo Selection
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      setUploadedPhotos((prev) => [...prev, ...files]);
    }
  };

  const handleCameraCapture = (blob) => {
    const file = new File([blob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
    setUploadedPhotos((prev) => [...prev, file]);
    setShowCamera(false);
  };

  // Run AI Attendance Scan
  const handleRunAnalysis = async () => {
    if (!selectedSubjectId) {
      alert('Please select a subject first.');
      return;
    }

    setIsAnalyzing(true);
    try {
      let res;
      if (attendanceMode === 'photo') {
        if (!uploadedPhotos.length) {
          alert('Please take or upload at least one classroom photo.');
          setIsAnalyzing(false);
          return;
        }
        res = await api.scanPhotoAttendance(selectedSubjectId, uploadedPhotos);
      } else {
        if (!recordedAudio) {
          alert('Please record classroom audio first.');
          setIsAnalyzing(false);
          return;
        }
        res = await api.scanVoiceAttendance(selectedSubjectId, recordedAudio);
      }

      if (res.success) {
        if (!res.results || res.results.length === 0) {
          alert(res.message || 'No enrolled students found in this course.');
        } else {
          setResultModalData(res);
        }
      }
    } catch (err) {
      alert(`AI Attendance Scan Error: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Confirm and Save attendance logs
  const handleSaveAttendance = async (logs) => {
    await api.confirmAttendance(logs);
    setUploadedPhotos([]);
    setRecordedAudio(null);
    fetchSubjects(); // Refresh attendance session counts
  };

  // Create Subject Submission
  const handleCreateSubject = async (e) => {
    e.preventDefault();
    if (!newCode || !newName || !newSection) return;

    setIsCreating(true);
    try {
      const res = await api.createSubject(newCode.trim().toUpperCase(), newName.trim(), newSection.trim(), user.teacher_id);
      if (res.success) {
        setShowCreateModal(false);
        setNewCode('');
        setNewName('');
        setNewSection('A');
        fetchSubjects();
      }
    } catch (err) {
      alert(`Error creating subject: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Instructor Portal</span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Welcome, {user?.name}</h1>
          <p className="text-xs text-slate-500">Manage courses and conduct instant AI roll-calls</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('take-attendance')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'take-attendance'
                ? 'bg-white text-brand-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Take Attendance</span>
          </button>

          <button
            onClick={() => setActiveTab('subjects')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'subjects'
                ? 'bg-white text-brand-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Subjects ({subjects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'records'
                ? 'bg-white text-brand-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: TAKE ATTENDANCE */}
      {/* ==================================================== */}
      {activeTab === 'take-attendance' && (
        <div className="flex flex-col gap-6">
          {/* Top Controls Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              {/* Select Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Course / Subject
                </label>
                {loadingSubjects ? (
                  <div className="h-10 bg-slate-100 rounded-xl animate-pulse"></div>
                ) : subjects.length > 0 ? (
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-brand-500"
                  >
                    {subjects.map((s) => (
                      <option key={s.subject_id} value={s.subject_id}>
                        {s.name} ({s.subject_code} - Sec {s.section})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
                    No subjects found. Create a subject in the 'Subjects' tab first.
                  </div>
                )}
              </div>

              {/* Mode Toggle (Photo vs Voice) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Attendance Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setAttendanceMode('photo')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      attendanceMode === 'photo'
                        ? 'bg-brand-500 text-white border-brand-500 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    <span>Photo AI</span>
                  </button>

                  <button
                    onClick={() => setAttendanceMode('voice')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      attendanceMode === 'voice'
                        ? 'bg-accent-pink text-white border-accent-pink shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>Voice ID</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mode A: Photo Capture / Upload Area */}
          {attendanceMode === 'photo' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Classroom Photos</h3>
                  <p className="text-xs text-slate-500">Add panoramic classroom snapshots to recognize all faces simultaneously</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCamera(!showCamera)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{showCamera ? 'Close Camera' : 'Live Camera'}</span>
                  </button>

                  <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Images</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                </div>
              </div>

              {/* Live Camera View (Toggled) */}
              {showCamera && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <CameraCapture
                    title="Classroom Snapshot Camera"
                    onCapture={handleCameraCapture}
                    onCancel={() => setShowCamera(false)}
                  />
                </div>
              )}

              {/* Gallery of Added Photos */}
              {uploadedPhotos.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-600">{uploadedPhotos.length} Photo(s) Staged</span>
                    <button
                      onClick={() => setUploadedPhotos([])}
                      className="text-xs text-rose-500 hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {uploadedPhotos.map((file, idx) => (
                      <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-xs group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 left-1 bg-slate-900/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                          Photo {idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-10 border-2 border-dashed border-slate-200 rounded-2xl text-center flex flex-col items-center justify-center text-slate-400">
                  <Camera className="w-8 h-8 mb-2 text-slate-300" />
                  <p className="text-xs font-semibold">No classroom photos added yet</p>
                  <p className="text-[11px] text-slate-400">Click "Live Camera" to take a snapshot or "Upload Images" from device</p>
                </div>
              )}
            </div>
          )}

          {/* Mode B: Voice Recording Area */}
          {attendanceMode === 'voice' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Sequential Voice Attendance</h3>
                <p className="text-xs text-slate-500">Record students answering roll-call. The AI will isolate speech bursts and match voice d-vectors.</p>
              </div>

              <AudioRecorder
                label="Classroom Roll-Call Audio"
                onAudioRecorded={(blob) => setRecordedAudio(blob)}
              />
            </div>
          )}

          {/* Big Action Button */}
          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing || (!uploadedPhotos.length && !recordedAudio)}
            className={`w-full py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
              isAnalyzing || (!uploadedPhotos.length && !recordedAudio)
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-brand-600 via-brand-500 to-accent-pink hover:opacity-95 text-white shadow-brand-500/25'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Deep Scanning Biometrics...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Run AI Attendance Analysis</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: MANAGE SUBJECTS */}
      {/* ==================================================== */}
      {activeTab === 'subjects' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">Your Subjects</h2>
              <p className="text-xs text-slate-500">Manage course rosters, sections, and sharing codes</p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Subject</span>
            </button>
          </div>

          {loadingSubjects ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-44 bg-white rounded-2xl animate-pulse border border-slate-200"></div>
              ))}
            </div>
          ) : subjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {subjects.map((sub) => (
                <SubjectCard
                  key={sub.subject_id}
                  subject={sub}
                  isTeacher={true}
                  onShare={(subject) => setShareSubject(subject)}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">No subjects yet</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">Create your first subject to start taking attendance</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-brand-500 text-white text-xs font-bold rounded-xl"
              >
                Create Subject
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: ATTENDANCE RECORDS */}
      {/* ==================================================== */}
      {activeTab === 'records' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Attendance Log History</h2>
              <p className="text-xs text-slate-500">Historical summary of past classroom sessions</p>
            </div>
            <button
              onClick={fetchRecords}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loadingRecords ? (
            <div className="py-12 text-center text-slate-400 flex flex-col items-center">
              <Loader2 className="w-6 h-6 animate-spin mb-2" />
              <span className="text-xs">Loading historical records...</span>
            </div>
          ) : records.length > 0 ? (
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 font-bold text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Subject Name</th>
                    <th className="py-3 px-3">Subject Code</th>
                    <th className="py-3 px-4 text-center">Attendance Stats</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map((item) => {
                    const percentage = item.total_count > 0 ? Math.round((item.present_count / item.total_count) * 100) : 0;
                    return (
                      <tr key={item.session_key} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-800 flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.formatted_time}</span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {item.subject_name}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 font-mono text-[11px] font-bold bg-brand-50 text-brand-700 rounded-md">
                            {item.subject_code}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-[11px] rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{item.present_count} / {item.total_count} Students ({percentage}%)</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">
              <History className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">No attendance sessions recorded yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Result Review Modal */}
      {resultModalData && (
        <AttendanceResultModal
          results={resultModalData.results}
          logs={resultModalData.logs}
          isOpen={!!resultModalData}
          onClose={() => setResultModalData(null)}
          onSave={handleSaveAttendance}
        />
      )}

      {/* Share QR Modal */}
      <QRModal
        subject={shareSubject}
        isOpen={!!shareSubject}
        onClose={() => setShareSubject(null)}
      />

      {/* Create Subject Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900 mb-1">Create New Subject</h3>
            <p className="text-xs text-slate-500 mb-4">Enter subject details to begin taking attendance</p>

            <form onSubmit={handleCreateSubject} className="flex flex-col gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subject Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS101"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl uppercase font-mono focus:outline-hidden focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Structures & Algorithms"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Section
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A"
                  value={newSection}
                  onChange={(e) => setNewSection(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1"
                >
                  {isCreating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Subject</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
