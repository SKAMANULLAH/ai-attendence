// Centralized API Client for Snap-AI Backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    ...options.headers,
  };

  // Only set Content-Type to application/json if body is not FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.detail || data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Health
  checkHealth: () => request("/api/health"),

  // Teacher Auth
  teacherLogin: (username, password) =>
    request("/api/teacher/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  teacherRegister: (username, password, name) =>
    request("/api/teacher/register", {
      method: "POST",
      body: JSON.stringify({ username, password, name }),
    }),

  // Subjects
  createSubject: (subject_code, name, section, teacher_id) =>
    request("/api/subjects/create", {
      method: "POST",
      body: JSON.stringify({ subject_code, name, section, teacher_id }),
    }),

  getTeacherSubjects: (teacher_id) =>
    request(`/api/subjects/teacher/${teacher_id}`),

  getSubjectByCode: (subject_code) =>
    request(`/api/subjects/code/${subject_code}`),

  // Student Portal
  loginWithFace: (photoBlob) => {
    const formData = new FormData();
    formData.append("file", photoBlob, "face.jpg");
    return request("/api/student/login-face", {
      method: "POST",
      body: formData,
    });
  },

  registerStudent: (name, photoBlob, audioBlob = null) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("photo", photoBlob, "profile.jpg");
    if (audioBlob) {
      formData.append("audio", audioBlob, "voice.wav");
    }
    return request("/api/student/register", {
      method: "POST",
      body: formData,
    });
  },

  getStudentDashboard: (student_id) =>
    request(`/api/student/${student_id}/dashboard`),

  enrollStudent: (student_id, subject_id) =>
    request("/api/student/enroll", {
      method: "POST",
      body: JSON.stringify({ student_id, subject_id }),
    }),

  unenrollStudent: (student_id, subject_id) =>
    request("/api/student/unenroll", {
      method: "POST",
      body: JSON.stringify({ student_id, subject_id }),
    }),

  // Attendance AI
  scanPhotoAttendance: (subject_id, photoFiles) => {
    const formData = new FormData();
    formData.append("subject_id", subject_id);
    for (const photo of photoFiles) {
      formData.append("photos", photo);
    }
    return request("/api/attendance/scan-photo", {
      method: "POST",
      body: formData,
    });
  },

  scanVoiceAttendance: (subject_id, audioBlob) => {
    const formData = new FormData();
    formData.append("subject_id", subject_id);
    formData.append("audio", audioBlob, "classroom_audio.wav");
    return request("/api/attendance/scan-voice", {
      method: "POST",
      body: formData,
    });
  },

  confirmAttendance: (logs) =>
    request("/api/attendance/confirm", {
      method: "POST",
      body: JSON.stringify({ logs }),
    }),

  getTeacherRecords: (teacher_id) =>
    request(`/api/attendance/records/teacher/${teacher_id}`),
};

export default api;
