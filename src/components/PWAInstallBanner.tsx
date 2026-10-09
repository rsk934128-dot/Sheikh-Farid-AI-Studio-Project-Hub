import React from 'react';
import { Download, WifiOff, X, Sparkles } from 'lucide-react';

interface PWAInstallBannerProps {
  showInstallBanner: boolean;
  onInstallClick: () => void;
  onDismiss: () => void;
  isOffline: boolean;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  showInstallBanner,
  onInstallClick,
  onDismiss,
  isOffline
}) => {
  return (
    <>
      {/* Offline Alert Strip */}
      {isOffline && (
        <div className="bg-rose-500/20 border-b border-rose-500/30 text-rose-300 px-4 py-2 text-xs flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5" />
          <span>আপনি অফলাইনে আছেন। সার্ভিস ওয়ার্কারের মাধ্যমে অফলাইন ক্যাশড মোড চালু রয়েছে।</span>
        </div>
      )}

      {/* PWA Floating Install Prompt */}
      {showInstallBanner && !isOffline && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">অ্যাপ ইনস্টল করুন</h4>
                <p className="text-[11px] text-slate-300">
                  সরাসরি হোম স্ক্রিন থেকে অফলাইন-রেডি স্পিডে ব্যবহার করতে ইনস্টল করুন।
                </p>
              </div>
            </div>

            <button
              onClick={onDismiss}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={onInstallClick}
              className="flex-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>এখনই ইনস্টল করুন</span>
            </button>

            <button
              onClick={onDismiss}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl font-medium"
            >
              পরে
            </button>
          </div>
        </div>
      )}
    </>
  );
};
