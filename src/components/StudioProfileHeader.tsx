import React from 'react';
import { Camera, Sparkles, Cloud, CheckCircle2, ShieldCheck, Zap, HardDrive, RefreshCw } from 'lucide-react';
import firebaseAppletConfig from '../../firebase-applet-config.json';

interface StudioProfileHeaderProps {
  currentUser: any;
  currentPhotoURL?: string | null;
  onOpenUploadModal: () => void;
}

export const StudioProfileHeader: React.FC<StudioProfileHeaderProps> = ({
  currentUser,
  currentPhotoURL,
  onOpenUploadModal
}) => {
  const defaultPhoto = '/src/assets/images/architect_portrait_1791835932249.jpg';
  const displayPhoto = currentPhotoURL || currentUser?.photoURL || defaultPhoto;
  const displayName = currentUser?.displayName || 'শেখ ফরিদ (আর্কিটেক্ট ও লিড ইঞ্জিনিয়ার)';
  const displayEmail = currentUser?.email || 'farid.workspace@demo.bd';
  const bucketName = firebaseAppletConfig.storageBucket || 'gen-lang-client-0112590605.firebasestorage.app';

  return (
    <div className="relative mb-6 rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-emerald-950/30 p-5 sm:p-6 backdrop-blur-xl shadow-xl shadow-slate-950/60">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        {/* Left: Avatar with interactive camera trigger & User Info */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Avatar with Camera Trigger Overlay */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-emerald-500/40 p-0.5 bg-slate-950 shadow-lg shadow-emerald-950/40 transition-transform group-hover:scale-105">
              <img
                src={displayPhoto}
                alt={displayName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>

            {/* Click to Change Photo Button Badge */}
            <button
              type="button"
              onClick={onOpenUploadModal}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/80 border border-emerald-400/30 transition-all hover:scale-110 active:scale-95 group-hover:ring-2 group-hover:ring-emerald-400"
              title="ক্যামেরা বা ডিভাইস থেকে প্রোফাইল ছবি আপলোড করুন"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* User Details */}
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>পারসোনালাইজড স্টুডিও ড্যাশবোর্ড</span>
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/80 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>সেশন সক্রিয়</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>{displayName}</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
              <span>{displayEmail}</span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-emerald-400/90 font-medium">এআই সিস্টেম আর্কিটেক্ট ও ডেভেলপার</span>
            </p>
          </div>
        </div>

        {/* Right: Storage Integration & Action Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Cloud Storage Status Pill */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl px-3.5 py-2 flex items-center gap-3 shadow-inner">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20 shrink-0">
              <Cloud className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                <span>Firebase Storage</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              </div>
              <div className="text-[10px] text-slate-400 truncate max-w-[170px]" title={bucketName}>
                {bucketName}
              </div>
            </div>
          </div>

          {/* Upload Button */}
          <button
            type="button"
            onClick={onOpenUploadModal}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 border border-emerald-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Camera className="w-4 h-4" />
            <span>ছবি পরিবর্তন (ক্যামেরা/ফাইল)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
