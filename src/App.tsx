import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AiAssistantLab } from './components/AiAssistantLab';
import { CitizenGovTech } from './components/CitizenGovTech';
import { GmailWorkspace } from './components/GmailWorkspace';
import { ProjectsHub } from './components/ProjectsHub';
import { AboutUs } from './components/AboutUs';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { onAuthChange } from './services/firebase';
import { User } from 'firebase/auth';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('ai-lab');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  useEffect(() => {
    // Listen to Firebase Auth state
    const unsubscribe = onAuthChange((user) => {
      setCurrentUser(user);
    });

    // PWA Install prompt listener
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    };

    // Network status listener
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
      setInstallPrompt(null);
    }
  };

  const handleAuthSuccess = (token?: string, user?: any) => {
    if (token) {
      setAccessToken(token);
    }
    if (user) {
      setCurrentUser(user);
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setAccessToken('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onAuthSuccess={handleAuthSuccess}
        onSignOut={handleSignOut}
        installPrompt={installPrompt}
        onInstallClick={handleInstallClick}
      />

      {/* PWA & Network Banner */}
      <PWAInstallBanner
        showInstallBanner={showInstallBanner}
        onInstallClick={handleInstallClick}
        onDismiss={() => setShowInstallBanner(false)}
        isOffline={isOffline}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'ai-lab' && <AiAssistantLab />}
        {activeTab === 'govtech' && <CitizenGovTech />}
        {activeTab === 'gmail' && <GmailWorkspace initialAccessToken={accessToken} />}
        {activeTab === 'projects' && <ProjectsHub />}
        {activeTab === 'about' && <AboutUs />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © {new Date().getFullYear()} Sheikh Farid AI Studio. সকল অধিকার সংরক্ষিত।
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>মিনি মাইক্রোসফট ইকোসিস্টেম</span>
            <span>•</span>
            <span>সিটিজেনডেস্ক গভটেক বিডি</span>
            <span>•</span>
            <span>PWABuilder 100/100</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
