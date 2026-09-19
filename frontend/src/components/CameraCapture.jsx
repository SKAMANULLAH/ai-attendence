import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, Upload, AlertCircle, Check } from 'lucide-react';

export default function CameraCapture({ onCapture, onCancel, title = "Face Recognition Camera", autoStart = true }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' (front) or 'environment' (back)
  const [cameraError, setCameraError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Start Camera Stream
  const startCamera = useCallback(async (facing = facingMode) => {
    setCameraError(null);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      const constraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Camera permission denied or camera not found. You can upload an image instead.');
    }
  }, [facingMode, stream]);

  useEffect(() => {
    if (autoStart) {
      startCamera(facingMode);
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Switch between front & back camera (especially on mobile phones)
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Capture snapshot from video stream
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsProcessing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setCapturedImage(url);
        onCapture(blob, url);
      }
      setIsProcessing(false);
    }, 'image/jpeg', 0.92);
  };

  // File upload fallback
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCapturedImage(url);
      onCapture(file, url);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="w-full px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-accent-pink" />
          <span className="font-semibold text-sm tracking-wide">{title}</span>
        </div>
        <button
          onClick={toggleFacingMode}
          className="flex items-center gap-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-md text-slate-300 transition-colors"
          title="Switch front/back camera"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Flip</span>
        </button>
      </div>

      {/* Viewfinder Area */}
      <div className="relative w-full aspect-[4/3] bg-slate-950 flex items-center justify-center overflow-hidden">
        {cameraError ? (
          <div className="p-6 text-center text-slate-400">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
            <p className="text-xs">{cameraError}</p>
            <label className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors shadow-sm">
              <Upload className="w-4 h-4" /> Upload Image
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        ) : capturedImage ? (
          <div className="relative w-full h-full">
            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
              <Check className="w-3 h-3" /> Captured
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Face guide target reticle */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-48 h-60 border-2 border-dashed border-brand-400/70 rounded-full radar-ring"></div>
              <div className="absolute top-4 bg-slate-900/60 backdrop-blur-xs text-white text-[11px] px-3 py-1 rounded-full font-medium">
                Align face within circle
              </div>
            </div>
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="w-full p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
        {capturedImage ? (
          <>
            <button
              onClick={retakePhoto}
              className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-all"
            >
              Retake
            </button>
            <button
              onClick={() => onCancel && onCancel()}
              className="flex-1 py-2 text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-all shadow-sm"
            >
              Continue
            </button>
          </>
        ) : (
          <>
            <label className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl cursor-pointer transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>

            <button
              onClick={capturePhoto}
              disabled={isProcessing || !!cameraError}
              className="flex-1 py-2 text-xs font-bold text-white bg-gradient-to-r from-brand-500 to-accent-pink hover:opacity-95 rounded-xl transition-all shadow-md shadow-brand-500/20 flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Take Snapshot</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
