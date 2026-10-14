import React from 'react';
import { Sparkles, Bot, Shield, Mail, FolderGit2, User, Download, LogIn, LogOut, CheckCircle2, AlertCircle, UserCheck, Camera } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { signInWithGoogleSafe, signOutSafe, signInAsDemoUser } from '../services/firebase';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: FirebaseUser | any;
  onAuthSuccess: (token?: string, user?: any) => void;
  onSignOut?: () => void;
  installPrompt: any;
  onInstallClick: () => void;
  onOpenProfileModal?: () => void;
  customAvatarUrl?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onAuthSuccess,
  onSignOut,
  installPrompt,
  onInstallClick,
  onOpenProfileModal,
  customAvatarUrl
}) => {
  const [authLoading, setAuthLoading] = React.useState(false);
  const [authNotice, setAuthNotice] = React.useState<{ text: string; showDemoBtn?: boolean } | null>(null);

  const handleSignIn = async () => {
    setAuthLoading(true);
    setAuthNotice(null);
    try {
      const res = await signInWithGoogleSafe();
      if (res.cancelled) {
        setAuthNotice({
          text: 'লগইন উইন্ডো বন্ধ করা হয়েছে।',
          showDemoBtn: true
        });
      } else if (res.error) {
        setAuthNotice({
          text: res.error,
          showDemoBtn: true
        });
      } else if (res.user) {
        onAuthSuccess(res.accessToken, res.user);
      }
    } catch (e: any) {
      setAuthNotice({
        text: e?.message || 'লগইন প্রক্রিয়ায় ত্রুটি ঘটেছে।',
        showDemoBtn: true
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const res = signInAsDemoUser();
    onAuthSuccess(res.accessToken, res.user);
    setAuthNotice(null);
  };

  const handleSignOut = async () => {
    await signOutSafe();
    if (onSignOut) {
      onSignOut();
    }
  };

  const navItems = [
    { id: 'ai-lab', label: 'এআই ল্যাব', sub: 'AI Lab', icon: Bot },
    { id: 'govtech', label: 'সার্ভিস সরকার', sub: 'CitizenDesk', icon: Shield },
    { id: 'gmail', label: 'জিমেইল হাব', sub: 'Gmail API', icon: Mail },
    { id: 'projects', label: 'প্রজেক্ট হাব', sub: 'Projects', icon: FolderGit2 },
    { id: 'about', label: 'আমাদের সম্পর্কে', sub: 'About Us', icon: User }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('ai-lab')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  Sheikh Farid AI Studio
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  মিনি মাইক্রোসফট
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                হাই-প্রিসিশন লোকাল এআই • গভটেক ইকোসিস্টেম
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Install PWA Button */}
            {installPrompt && (
              <button
                onClick={onInstallClick}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 transition-all"
                title="অ্যাপ হিসেবে ইনস্টল করুন"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ইনস্টল PWA</span>
              </button>
            )}

            {/* Google Authentication & Profile Picture */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-800/80 pl-1.5 pr-1.5 py-1 rounded-full border border-slate-700">
                <button
                  onClick={onOpenProfileModal}
                  className="relative group cursor-pointer focus:outline-none"
                  title="ক্যামেরা বা ডিভাইস থেকে প্রোফাইল ছবি পরিবর্তন করুন"
                >
                  {customAvatarUrl || currentUser.photoURL ? (
                    <img
                      src={customAvatarUrl || currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full border-2 border-emerald-400 object-cover group-hover:opacity-80 transition-opacity"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold group-hover:bg-emerald-500 transition-colors">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  {/* Camera overlay indicator */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-slate-900 border border-emerald-400 rounded-full flex items-center justify-center text-[8px] text-emerald-400 group-hover:scale-110 transition-transform">
                    <Camera className="w-2.5 h-2.5" />
                  </span>
                </button>

                <button
                  onClick={onOpenProfileModal}
                  className="text-left text-xs font-medium text-slate-200 hover:text-emerald-300 max-w-[85px] truncate hidden sm:inline transition-colors"
                  title="প্রোফাইল সেটিংস ও ছবি পরিবর্তন"
                >
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </button>

                <button
                  onClick={handleSignOut}
                  className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                  title="লগআউট"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                {/* Visitor Profile Photo button */}
                <button
                  onClick={onOpenProfileModal}
                  className="relative group p-1 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/50 transition-all flex items-center gap-1"
                  title="প্রোফাইল ছবি পার্সোনালাইজ করুন (ক্যামেরা / ডিভাইস)"
                >
                  {customAvatarUrl ? (
                    <img
                      src={customAvatarUrl}
                      alt="Custom Avatar"
                      className="w-6 h-6 rounded-full object-cover border border-emerald-400"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center">
                      <Camera className="w-3 h-3 text-emerald-400" />
                    </div>
                  )}
                </button>

                <button
                  onClick={handleSignIn}
                  disabled={authLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all disabled:opacity-50"
                  title="গুগল পপআপ মাধ্যমে সাইন-ইন করুন"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{authLoading ? 'লগইন হচ্ছে...' : 'গুগল সাইন-ইন'}</span>
                </button>

                <button
                  onClick={handleDemoLogin}
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
                  title="তাৎক্ষণিক প্রিভিউ লগইন"
                >
                  <UserCheck className="w-3 h-3" />
                  <span>ডেমো মোড</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Auth Notice Toast / Banner */}
        {authNotice && (
          <div className="py-2 px-3 bg-amber-500/10 border-t border-amber-500/20 text-amber-300 text-xs flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{authNotice.text}</span>
            </span>
            <div className="flex items-center gap-2">
              {authNotice.showDemoBtn && (
                <button
                  onClick={handleDemoLogin}
                  className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-semibold text-[11px] transition-colors"
                >
                  ডেমো মোডে প্রবেশ করুন →
                </button>
              )}
              <button 
                onClick={() => setAuthNotice(null)} 
                className="text-amber-400 hover:text-white text-xs font-bold px-1"
                title="বন্ধ করুন"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Mobile Navigation Row */}
        <div className="flex lg:hidden overflow-x-auto py-2 space-x-1 border-t border-slate-800/80 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:text-white bg-slate-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
