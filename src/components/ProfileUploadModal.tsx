import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  Upload,
  X,
  Check,
  RefreshCw,
  Sparkles,
  AlertCircle,
  CloudUpload,
  CheckCircle2,
  Image as ImageIcon,
  ShieldCheck,
  Zap,
  Sliders
} from 'lucide-react';
import { uploadProfilePicture, getPersistedProfilePicture } from '../services/firebase';

interface ProfileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  currentPhotoURL?: string | null;
  onPhotoUpdated: (newPhotoURL: string) => void;
}

export const ProfileUploadModal: React.FC<ProfileUploadModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentPhotoURL,
  onPhotoUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'device' | 'camera' | 'presets'>('device');
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [selectedBlob, setSelectedBlob] = useState<Blob | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('profile.jpg');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hasCapturedSnapshot, setHasCapturedSnapshot] = useState(false);

  // File input refs
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mobileCameraInputRef = useRef<HTMLInputElement | null>(null);

  // Preset studio avatars
  const presetAvatars = [
    {
      name: 'শেখ ফরিদ (আর্কিটেক্ট পোর্ট্রেট)',
      url: '/src/assets/images/architect_portrait_1791835932249.jpg',
      tag: 'অফিসিয়াল'
    },
    {
      name: 'সাইবারস্পেস ইঞ্জিনিয়ার',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      tag: 'টেক'
    },
    {
      name: 'এআই সিস্টেম স্পেশালিস্ট',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      tag: 'মডেলিং'
    },
    {
      name: 'ডিজিটাল গভটেক লিডার',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      tag: 'গভটেক'
    }
  ];

  // Initialize or reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPreviewURL(currentPhotoURL || getPersistedProfilePicture(currentUser?.uid) || null);
      setSelectedBlob(null);
      setErrorMsg(null);
      setIsSuccess(false);
      setUploadStatus(null);
      setHasCapturedSnapshot(false);
    } else {
      stopCamera();
    }
  }, [isOpen, currentPhotoURL, currentUser]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError(null);
    setHasCapturedSnapshot(false);
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 720 },
          height: { ideal: 720 }
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn("Camera access warning:", err);
      setCameraError(
        'ক্যামেরা অ্যাক্সেস করা যায়নি। ব্রাউজারের পারমিশন চেক করুন অথবা ডিভাইসের ফাইল নির্বাচন করুন।'
      );
      setIsCameraActive(false);
    }
  };

  // Switch tabs and handle camera stream
  const handleTabChange = (tab: 'device' | 'camera' | 'presets') => {
    setActiveTab(tab);
    setErrorMsg(null);
    if (tab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
  };

  // Compress & convert file to optimized square avatar blob
  const processImageFile = (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPEG, PNG, WebP) নির্বাচন করুন।');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 600;
        let width = img.width;
        let height = img.height;

        // Calculate square crop/contain
        const minDim = Math.min(width, height);
        const startX = (width - minDim) / 2;
        const startY = (height - minDim) / 2;

        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Draw cropped centered square
        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, maxSize, maxSize);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              setSelectedBlob(blob);
              setSelectedFileName(file.name || 'avatar.jpg');
              setPreviewURL(URL.createObjectURL(blob));
            }
          },
          'image/jpeg',
          0.9
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Capture snapshot from live video stream
  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    const size = Math.min(video.videoWidth || 640, video.videoHeight || 640);

    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Center crop
    const startX = ((video.videoWidth || 640) - size) / 2;
    const startY = ((video.videoHeight || 640) - size) / 2;

    // Mirror image for natural selfie feel
    ctx.translate(600, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, startX, startY, size, size, 0, 0, 600, 600);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          setSelectedBlob(blob);
          setSelectedFileName(`camera_${Date.now()}.jpg`);
          setPreviewURL(URL.createObjectURL(blob));
          setHasCapturedSnapshot(true);
          stopCamera();
        }
      },
      'image/jpeg',
      0.9
    );
  };

  const handleRetakeCamera = () => {
    setHasCapturedSnapshot(false);
    setSelectedBlob(null);
    startCamera();
  };

  // Select a preset avatar
  const handleSelectPreset = async (presetUrl: string) => {
    try {
      setIsUploading(true);
      setUploadStatus('প্রিসেট অ্যাভাটার প্রস্তুত হচ্ছে...');
      const response = await fetch(presetUrl);
      const blob = await response.blob();
      setSelectedBlob(blob);
      setSelectedFileName('preset_avatar.jpg');
      setPreviewURL(presetUrl);
      setIsUploading(false);
      setUploadStatus(null);
    } catch (err) {
      console.warn("Preset fetch error, using direct URL:", err);
      setPreviewURL(presetUrl);
      setIsUploading(false);
    }
  };

  // Perform upload to Firebase Storage
  const handleSaveToFirebase = async () => {
    if (!selectedBlob && !previewURL) {
      setErrorMsg('অনুগ্রহ করে ক্যামেরা বা ডিভাইস থেকে একটি ছবি যুক্ত করুন।');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);
    setUploadStatus('Firebase Storage-এ আপলোড হচ্ছে...');

    const userId = currentUser?.uid || 'studio-architect';

    try {
      let finalBlob = selectedBlob;

      // If preset selected without blob, fetch blob
      if (!finalBlob && previewURL) {
        setUploadStatus('ছবি ফরম্যাট প্রক্রিয়াকরণ হচ্ছে...');
        try {
          const resp = await fetch(previewURL);
          finalBlob = await resp.blob();
        } catch (e) {
          console.warn("Direct blob convert fallback:", e);
        }
      }

      if (!finalBlob) {
        throw new Error('ছবি প্রক্রিয়াকরণে ত্রুটি হয়েছে।');
      }

      setUploadStatus('ক্লাউড স্টোরেজে (Firebase Storage) সংরক্ষিত হচ্ছে...');

      const result = await uploadProfilePicture(userId, finalBlob, selectedFileName);

      if (result.success && result.downloadURL) {
        setIsSuccess(true);
        setUploadStatus('সফলভাবে Firebase Storage-এ সংরক্ষিত হয়েছে!');
        onPhotoUpdated(result.downloadURL);
        
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        throw new Error(result.error || 'আপলোড সম্পন্ন করা যায়নি।');
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMsg(err.message || 'Firebase Storage আপলোডে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl shadow-emerald-950/40 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>প্রোফাইল ছবি পরিবর্তন</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Firebase Storage
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ক্যামেরা বা ডিভাইস থেকে ছবি আপলোড করে স্টুডিও ড্যাশবোর্ড পারসোনালাইজ করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 p-1.5 mx-6 mt-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 text-xs font-semibold">
          <button
            onClick={() => handleTabChange('device')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'device'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>ডিভাইস ফাইল</span>
          </button>
          <button
            onClick={() => handleTabChange('camera')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'camera'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>লাইভ ক্যামেরা</span>
          </button>
          <button
            onClick={() => handleTabChange('presets')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'presets'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>প্রিসেট আর্কিটেক্ট</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col items-center">
          {/* Active Tab: Device Upload */}
          {activeTab === 'device' && (
            <div className="w-full flex flex-col items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <input
                ref={mobileCameraInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {/* Upload Drop Zone / Button */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-700 hover:border-emerald-500/60 bg-slate-950/40 hover:bg-slate-950/70 p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all border border-emerald-500/20">
                  <CloudUpload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-200 text-center">
                  আপনার ডিভাইস থেকে ছবি নির্বাচন করুন
                </p>
                <p className="text-xs text-slate-400 mt-1 text-center">
                  ব্রাউজ করতে ক্লিক করুন (JPG, PNG, WebP — সর্বোচ্চ 5MB)
                </p>
              </div>

              {/* Fast Mobile Direct Camera button */}
              <div className="w-full flex items-center justify-between gap-3 text-xs text-slate-400">
                <span className="h-px bg-slate-800 flex-1"></span>
                <span>অথবা মোবাইলের ক্ষেত্রে</span>
                <span className="h-px bg-slate-800 flex-1"></span>
              </div>

              <button
                type="button"
                onClick={() => mobileCameraInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>মোবাইল ক্যামেরা চালু করুন (Direct Camera)</span>
              </button>
            </div>
          )}

          {/* Active Tab: Live Camera */}
          {activeTab === 'camera' && (
            <div className="w-full flex flex-col items-center gap-4">
              <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-emerald-500/30 bg-slate-950 shadow-inner flex items-center justify-center">
                {/* Live Video Feed */}
                {!hasCapturedSnapshot ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100"
                    />
                    {/* Guiding Circular Target Ring */}
                    <div className="absolute inset-0 pointer-events-none border border-emerald-400/40 rounded-full animate-pulse"></div>
                  </>
                ) : (
                  /* Captured Snapshot Preview */
                  previewURL && (
                    <img
                      src={previewURL}
                      alt="Captured Snapshot"
                      className="w-full h-full object-cover"
                    />
                  )
                )}

                {/* Camera Loading or Error State */}
                {!isCameraActive && !hasCapturedSnapshot && !cameraError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-950/90 text-center">
                    <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-2" />
                    <p className="text-xs text-slate-300">ক্যামেরা সংযোগ হচ্ছে...</p>
                  </div>
                )}

                {cameraError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-950/95 text-center">
                    <AlertCircle className="w-8 h-8 text-rose-400 mb-2" />
                    <p className="text-xs text-rose-300">{cameraError}</p>
                    <button
                      onClick={startCamera}
                      className="mt-3 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg border border-slate-700"
                    >
                      পুনরায় চেষ্টা করুন
                    </button>
                  </div>
                )}
              </div>

              {/* Shutter & Retake Controls */}
              {!hasCapturedSnapshot ? (
                <button
                  type="button"
                  onClick={handleCaptureSnapshot}
                  disabled={!isCameraActive}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/60 disabled:opacity-50 transition-all active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  <span>ছবি তুলুন (Take Snapshot)</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleRetakeCamera}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>আবার তুলুন (Retake)</span>
                  </button>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ছবি প্রস্তুত</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Active Tab: Presets */}
          {activeTab === 'presets' && (
            <div className="w-full flex flex-col gap-3">
              <p className="text-xs text-slate-400 text-center mb-1">
                স্টুডিওর অফিসিয়াল আর্কিটেক্ট ও টেক পোর্ট্রেট নির্বাচন করুন:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {presetAvatars.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset.url)}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      previewURL === preset.url
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-md shadow-emerald-950/50'
                        : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                        {preset.tag}
                      </div>
                      <div className="text-xs font-bold text-slate-200 truncate">
                        {preset.name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Current / New Avatar Preview Comparison */}
          {previewURL && (
            <div className="w-full mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-4 bg-slate-950/40 p-3 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={previewURL}
                    alt="Preview"
                    className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-lg shadow-emerald-950/60"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-[10px] shadow">
                    ✓
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    ড্যাশবোর্ড প্রিভিউ
                  </div>
                  <div className="text-[11px] text-slate-400">
                    স্টুডিও ও নেভিগেশন বারে এই ছবিটি দৃশ্যমান থাকবে
                  </div>
                </div>
              </div>

              {selectedBlob && (
                <div className="text-[10px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 shrink-0">
                  {(selectedBlob.size / 1024).toFixed(0)} KB
                </div>
              )}
            </div>
          )}

          {/* Upload Status / Toast */}
          {uploadStatus && (
            <div className="w-full mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0 text-emerald-400" />
              <span>{uploadStatus}</span>
            </div>
          )}

          {errorMsg && (
            <div className="w-full mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSuccess && (
            <div className="w-full mt-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>প্রোফাইল ছবি সফলভাবে Firebase Storage-এ সংরক্ষিত হয়েছে!</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>সেশন জুড়ে স্থায়ী থাকবে</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              বাতিল
            </button>
            <button
              type="button"
              onClick={handleSaveToFirebase}
              disabled={isUploading || (!selectedBlob && !previewURL)}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/50 disabled:opacity-50 transition-all"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>সংরক্ষণ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <CloudUpload className="w-3.5 h-3.5" />
                  <span>Firebase Storage-এ সেভ করুন</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
