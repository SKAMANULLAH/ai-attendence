# Snap-AI: Intelligent Biometrics Attendance System 🚀

A modern, full-stack AI attendance platform powered by **Computer Vision (Face Recognition)**, **Voice Biometrics**, **React 18**, and **FastAPI** with **Supabase (PostgreSQL)** and **Cloudinary**.

Domain: **[snap-ai.online](https://snap-ai.online)** | API: **[api.snap-ai.online](https://api.snap-ai.online)**

---

## 🌟 Key Features

1. **Multimodal Biometrics**:
   - **Panoramic Classroom Face Recognition**: Instant detection and 128-dimensional Euclidean distance matching of all students in high-res group photos.
   - **Voice Biometrics**: Sequential roll-call recognition using silence-split Voice Activity Detection (VAD) and speaker d-vector matching.
2. **Student FaceID Portal**:
   - Native webcam / mobile camera facial scanner for zero-click login.
   - Real-time attendance percentage tracking across all enrolled courses.
   - 1-tap course enrollment via QR code scan or shareable link (`https://snap-ai.online/?join-code=CS101`).
3. **Teacher Control Center**:
   - Subject and section roster management.
   - Photo & Voice attendance modes with interactive preview table and manual override before finalizing records.
   - Historical session logs with attendee counts and percentage statistics.
4. **Production Architecture**:
   - Asynchronous Python FastAPI backend.
   - Cloudinary image uploads for session archives and student avatars.
   - Cloud PostgreSQL on Supabase.
   - Responsive mobile-first React frontend with front/back camera switching.

---

## 📁 Project Structure

```
Attendence Project/
├── backend/                        # FastAPI Python API Server & Biometrics
│   ├── server.py                   # REST endpoints, biometrics & Supabase integration
│   ├── config.py                   # Environment, Cloudinary & Supabase initialization
│   ├── requirements.txt            # Python dependencies
│   ├── .env                        # Pre-configured credentials (local & EC2)
│   ├── ecosystem.config.js         # PM2 configuration for AWS EC2
│   ├── nginx-snap-ai.conf          # Nginx virtual host config for snap-ai.online
│   ├── Dockerfile                  # Production container image
│   └── src/                        # Computer Vision, Voice Biometrics & Database modules
│       ├── database/               # Supabase CRUD layer (db.py, config.py)
│       └── pipelines/              # Face (dlib/SVM) and Voice (Resemblyzer/VAD) pipelines
│
└── frontend/                       # React (Vite + Tailwind CSS) Web App
    ├── src/
    │   ├── components/             # CameraCapture, AudioRecorder, QRModal, SubjectCard
    │   ├── pages/                  # HomePage, TeacherDashboard, StudentPortal, TeacherAuthPage
    │   ├── api/client.js           # API client for FastAPI
    │   └── context/AuthContext.jsx # Session persistence
    ├── .env                        # Local API URL (http://localhost:8000)
    ├── .env.production             # EC2 API URL (https://api.snap-ai.online)
    └── package.json
```


---

## 💻 How to Run Locally

### 1. Start the Backend API (FastAPI)
Open a terminal in the root folder:
```powershell
# Run the FastAPI server on port 8000
python -m uvicorn backend.server:app --reload --port 8000
```
*API will be available at: `http://localhost:8000` (Interactive Docs: `http://localhost:8000/docs`)*

### 2. Start the Frontend (React + Vite)
Open a second terminal in the `frontend` folder:
```powershell
cd frontend
npm install
npm run dev
```
*Web App will be available at: `http://localhost:5173`*

---

## ☁️ How to Deploy on AWS EC2 (`snap-ai.online`)

Since you already have an AWS EC2 instance running your MERN projects:

### Step 1: Clone or Copy the Repository to EC2
```bash
git clone <your-repo-url> /var/www/snap-ai
cd /var/www/snap-ai
```

### Step 2: Install Backend Dependencies & Start with PM2
```bash
pip install -r backend/requirements.txt

# Start FastAPI alongside your existing MERN app using PM2:
pm2 start backend/ecosystem.config.js
pm2 save
```

### Step 3: Build the React Frontend
```bash
cd /var/www/snap-ai/frontend
npm install
npm run build
```
*(Creates production static bundle in `/var/www/snap-ai/frontend/dist`)*

### Step 4: Configure Nginx & SSL
Copy the included Nginx configuration:
```bash
sudo cp /var/www/snap-ai/backend/nginx-snap-ai.conf /etc/nginx/sites-available/snap-ai.online
sudo ln -s /etc/nginx/sites-available/snap-ai.online /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Issue free Let's Encrypt SSL certificates for your domain:
```bash
sudo certbot --nginx -d snap-ai.online -d www.snap-ai.online -d api.snap-ai.online
```

Done! Your app is live at **https://snap-ai.online**!
