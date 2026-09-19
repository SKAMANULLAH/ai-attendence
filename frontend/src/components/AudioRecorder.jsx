import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Trash2, CheckCircle2 } from 'lucide-react';

export default function AudioRecorder({ onAudioRecorded, label = "Record Voice Sample" }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onAudioRecorded(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone error:', err);
      alert('Could not access microphone. Please ensure microphone permissions are allowed in browser settings.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const clearRecording = () => {
    setAudioUrl(null);
    setRecordingDuration(0);
    onAudioRecorded(null);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-3">
        <Mic className="w-4 h-4 text-brand-500" />
        <span className="text-xs font-bold text-slate-800 tracking-wide">{label}</span>
      </div>

      {audioUrl ? (
        <div className="w-full flex flex-col items-center gap-3">
          <audio src={audioUrl} controls className="w-full h-9 rounded-lg" />
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Voice captured
            </span>
            <button
              onClick={clearRecording}
              className="text-[11px] font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1 bg-rose-50 px-2 py-1 rounded-md"
            >
              <Trash2 className="w-3 h-3" /> Record again
            </button>
          </div>
        </div>
      ) : isRecording ? (
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-sm font-bold font-mono text-rose-600">{formatTime(recordingDuration)}</span>
          </div>
          <p className="text-[11px] text-slate-500">Speaking into microphone...</p>
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <Square className="w-3.5 h-3.5 fill-current" /> Stop Recording
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <p className="text-[11px] text-slate-500 text-center">
            Click to record voice sample (e.g., "Present, Akash")
          </p>
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <Mic className="w-3.5 h-3.5" /> Start Recording
          </button>
        </div>
      )}
    </div>
  );
}
