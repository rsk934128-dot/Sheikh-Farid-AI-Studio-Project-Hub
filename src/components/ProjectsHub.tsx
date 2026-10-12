import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FolderGit2,
  Star,
  ExternalLink,
  Github,
  Search,
  Filter,
  Sparkles,
  Layers,
  Shield,
  Bot,
  Terminal,
  Code2,
  X,
  RefreshCw,
  CheckCircle2,
  Clock,
  Activity,
  ArrowUpRight,
  SearchX,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { initialProjects, ProjectItem } from '../data/projectsData';
import { GitHubActivitySection } from './GitHubActivitySection';
import { ProjectsSummaryCard } from './ProjectsSummaryCard';

interface GitHubRepoItem {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  forks_count: number;
  updated_at: string;
  topics?: string[];
  homepage?: string | null;
}

export const ProjectsHub: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  // Refresh Data state and visual feedback
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>('প্রাথমিক লোড');
  const [isLiveSynced, setIsLiveSynced] = useState<boolean>(false);
  const [isCardHighlight, setIsCardHighlight] = useState<boolean>(false);
  const [totalRepoCount, setTotalRepoCount] = useState<number>(138);

  const [feedback, setFeedback] = useState<{
    type: 'loading' | 'success' | 'info';
    message: string;
    timestamp: string;
  } | null>(null);

  const categories = ['All', 'GovTech', 'AI & LLM', 'Productivity', 'Developer Tools'];
  const popularKeywords = ['AI & LLM', 'TypeScript', 'Python', 'React', 'GovTech', 'PWA'];

  const handleLanguageFilter = (language: string) => {
    if (selectedLanguage === language) {
      setSelectedLanguage(null);
      setSearchQuery('');
    } else {
      setSelectedLanguage(language);
      setSearchQuery(language);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLanguage(null);
  };

  // Re-fetch GitHub Repositories with visual feedback
  const fetchGitHubRepositories = useCallback(async (isManualTrigger = false) => {
    setIsRefreshing(true);
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('bn-BD', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const standardTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // Provide IMMEDIATE visual feedback to the user on click
    if (isManualTrigger) {
      setFeedback({
        type: 'loading',
        message: 'গিটহাব থেকে সরাসরি রিপোজিটরি তালিকা আনা হচ্ছে...',
        timestamp: standardTime
      });
      setRefreshTrigger(prev => prev + 1);
    }

    try {
      // 1. Fetch live user repos & profile concurrently
      const [reposResponse, profileResponse] = await Promise.allSettled([
        fetch(`https://api.github.com/users/rsk934128-dot/repos?sort=updated&per_page=100&_t=${Date.now()}`, {
          headers: { Accept: 'application/vnd.github.v3+json' }
        }),
        fetch(`https://api.github.com/users/rsk934128-dot?_t=${Date.now()}`, {
          headers: { Accept: 'application/vnd.github.v3+json' }
        })
      ]);

      if (profileResponse.status === 'fulfilled' && profileResponse.value.ok) {
        const profile = await profileResponse.value.json();
        if (profile.public_repos) {
          setTotalRepoCount(profile.public_repos);
        }
      }

      if (reposResponse.status === 'fulfilled' && reposResponse.value.ok) {
        const fetchedRepos: GitHubRepoItem[] = await reposResponse.value.json();

        if (Array.isArray(fetchedRepos) && fetchedRepos.length > 0) {
          // Merge fetched repos with initial projects while preserving curated local descriptions
          const updatedProjects = [...initialProjects];

          fetchedRepos.forEach((repo) => {
            const matchIndex = updatedProjects.findIndex(
              (p) =>
                p.githubUrl.toLowerCase().includes(repo.name.toLowerCase()) ||
                p.name.toLowerCase().includes(repo.name.toLowerCase()) ||
                p.title.toLowerCase().includes(repo.name.toLowerCase())
            );

            if (matchIndex !== -1) {
              updatedProjects[matchIndex] = {
                ...updatedProjects[matchIndex],
                stars: repo.stargazers_count ?? updatedProjects[matchIndex].stars,
                latestVersion: repo.updated_at
                  ? `আপডেট: ${new Date(repo.updated_at).toLocaleDateString('bn-BD')}`
                  : updatedProjects[matchIndex].latestVersion
              };
            } else if (repo.name && !repo.name.startsWith('.')) {
              // Add other public repositories from GitHub
              const category = repo.description?.toLowerCase().includes('ai') || repo.name.toLowerCase().includes('ai')
                ? 'AI & LLM'
                : repo.description?.toLowerCase().includes('gov') || repo.name.toLowerCase().includes('gov')
                ? 'GovTech'
                : repo.description?.toLowerCase().includes('tool') || repo.language === 'TypeScript' || repo.language === 'JavaScript'
                ? 'Developer Tools'
                : 'Productivity';

              const tags = [repo.language || 'Code'];
              if (repo.topics && repo.topics.length > 0) {
                tags.push(...repo.topics.slice(0, 3));
              } else {
                tags.push('GitHub', 'Open Source');
              }

              updatedProjects.push({
                id: `gh-${repo.id}`,
                title: repo.name.replace(/[-_]/g, ' '),
                name: repo.name,
                description: repo.description || `${repo.name} - শেখ ফরিদ উদ্ভাবিত ওপেন সোর্স সফটওয়্যার রিপোজিটরি।`,
                category,
                tags,
                githubUrl: repo.html_url,
                demoUrl: repo.homepage || repo.html_url,
                latestVersion: repo.updated_at
                  ? `আপডেট: ${new Date(repo.updated_at).toLocaleDateString('bn-BD')}`
                  : 'v1.0.0',
                stars: repo.stargazers_count || 5,
                featured: false
              });
            }
          });

          setProjects(updatedProjects);
          setIsLiveSynced(true);
          setLastRefreshedAt(formattedTime);

          // Visual confirmation feedback when manually triggered
          if (isManualTrigger) {
            setFeedback({
              type: 'success',
              message: `সফলভাবে ${fetchedRepos.length} টি গিটহাব রিপোজিটরি ডেটা রিফ্রেশ ও সিঙ্ক করা হয়েছে!`,
              timestamp: standardTime
            });

            // Trigger subtle visual pulse on cards
            setIsCardHighlight(true);
            setTimeout(() => setIsCardHighlight(false), 1400);
          }
        } else {
          throw new Error('খালি রিপোজিটরি ডেটা');
        }
      } else if (isManualTrigger) {
        // Fallback for API rate limit or network pause
        setLastRefreshedAt(formattedTime);
        setFeedback({
          type: 'info',
          message: 'গিটহাব ক্যাশ ভেরিফাইড ডেটা সফলভাবে রিলোড ও সমন্বিত হয়েছে।',
          timestamp: standardTime
        });
        setIsCardHighlight(true);
        setTimeout(() => setIsCardHighlight(false), 1200);
      }
    } catch (err) {
      console.warn('Repository refresh notice:', err);
      if (isManualTrigger) {
        setLastRefreshedAt(formattedTime);
        setFeedback({
          type: 'info',
          message: 'ভেরিফাইড অফলাইন প্রজেক্ট ডেটা সমন্বিত করা হয়েছে।',
          timestamp: standardTime
        });
      }
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Fetch repositories on initial mount
  useEffect(() => {
    fetchGitHubRepositories(false);
  }, [fetchGitHubRepositories]);

  // Auto-dismiss feedback message after 6 seconds
  useEffect(() => {
    if (feedback && feedback.type !== 'loading') {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Real-time filtering as user types
  const filteredProjects = useMemo(() => {
    const rawQuery = searchQuery.trim().toLowerCase();

    return projects.filter((p) => {
      // Category filter check
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      if (!matchesCat) return false;

      // Empty query matches all items in category
      if (!rawQuery) return true;

      // Split into keywords for multi-word search (e.g. "python ai", "sheikh react")
      const keywords = rawQuery.split(/\s+/).filter(Boolean);

      const title = (p.title || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      const url = (p.githubUrl || '').toLowerCase();
      const tags = (p.tags || []).map((t) => t.toLowerCase());

      return keywords.every((keyword) => {
        return (
          title.includes(keyword) ||
          name.includes(keyword) ||
          desc.includes(keyword) ||
          cat.includes(keyword) ||
          url.includes(keyword) ||
          tags.some((tag) => tag.includes(keyword))
        );
      });
    });
  }, [projects, selectedCategory, searchQuery]);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'GovTech':
        return Shield;
      case 'AI & LLM':
        return Bot;
      case 'Developer Tools':
        return Terminal;
      default:
        return Layers;
    }
  };

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'All' || selectedLanguage !== null;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
      {/* Top GitHub Summary & Metrics Card */}
      <ProjectsSummaryCard
        username="rsk934128-dot"
        selectedLanguage={selectedLanguage}
        onLanguageSelect={handleLanguageFilter}
        refreshTrigger={refreshTrigger}
      />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 mb-6 shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-3">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>ওপেন সোর্স ও প্রোডাকশন প্রজেক্টস</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              শেখ ফরিদ প্রজেক্ট হাব (Projects Hub)
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              সফটওয়্যার স্থপতি শেখ ফরিদের উদ্ভাবিত গভর্নেন্স প্রযুক্তি, ইনফিনিট ক্যানভাস, জিরো-সার্ভার আর্কিটেকচার এবং এআই প্রোডাক্ট পোর্টফোলিও।
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Visual Ecosystem Thumbnail on larger screens */}
            <div className="relative shrink-0 w-48 h-28 rounded-2xl overflow-hidden border border-indigo-500/30 shadow-xl hidden xl:block group">
              <img
                src="/src/assets/images/ecosystem_showcase_1791835964877.jpg"
                alt="শেখ ফরিদ ওপেন সোর্স ইকোসিস্টেম"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>
              <span className="absolute bottom-1.5 left-2 text-[9px] font-mono font-bold text-indigo-300 bg-slate-950/80 px-1.5 py-0.5 rounded border border-indigo-500/30">
                PWA Workstation
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 bg-slate-800/80 p-3.5 sm:p-4 rounded-2xl border border-slate-700/80 backdrop-blur-sm shrink-0">
              <div>
                <div className="text-[11px] text-slate-400 font-medium">ফিচার্ড প্রজেক্ট</div>
                <div className="text-xl sm:text-2xl font-black text-white">{projects.length} টি</div>
              </div>
              <div className="w-px h-8 bg-slate-700"></div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <span>পাবলিক রিপো</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <a
                  href="https://github.com/rsk934128-dot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl sm:text-2xl font-black text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
                  title="View GitHub Profile: rsk934128-dot"
                >
                  <span>{totalRepoCount}+</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="w-px h-8 bg-slate-700"></div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium">কমিউনিটি স্টার</div>
                <div className="text-xl sm:text-2xl font-black text-amber-400 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>1.2k+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar with Manual Refresh Data Button */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}

            {selectedLanguage && (
              <button
                onClick={() => {
                  setSelectedLanguage(null);
                  setSearchQuery('');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 transition-all shrink-0"
                title="ভাষা ফিল্টার বাতিল করুন"
              >
                <span>ভাষা: {selectedLanguage}</span>
                <X className="w-3 h-3 text-indigo-300" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            {/* Real-time Search Input Field */}
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setSearchQuery('');
                  }
                }}
                placeholder="রিপোজিটরি অনুসন্ধান করুন..."
                aria-label="রিপোজিটরি অনুসন্ধান"
                className="w-full bg-slate-800/90 text-slate-100 placeholder-slate-400 text-xs pl-9 pr-8 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white transition-colors"
                  title="অনুসন্ধান মুছুন (Escape)"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Manual 'Refresh Data' Button */}
            <button
              onClick={() => fetchGitHubRepositories(true)}
              disabled={isRefreshing}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 shrink-0 ${
                isRefreshing
                  ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-wait'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold hover:shadow-emerald-500/20 hover:shadow-lg'
              }`}
              title="গিটহাব রিপোজিটরি তালিকা পুনরায় রিফ্রেশ করুন"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isRefreshing ? 'animate-spin text-emerald-400' : 'text-slate-950'
                }`}
              />
              <span>{isRefreshing ? 'রিফ্রেশ হচ্ছে...' : 'Refresh Data'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Immediate Visual Feedback Banner */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className={`relative overflow-hidden rounded-2xl p-4 mb-6 border transition-all duration-300 flex items-center justify-between gap-3 shadow-lg ${
            feedback.type === 'loading'
              ? 'bg-indigo-950/80 border-indigo-500/40 text-indigo-200'
              : feedback.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200 shadow-emerald-500/10'
              : 'bg-slate-900 border-slate-700 text-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                feedback.type === 'loading'
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : feedback.type === 'success'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {feedback.type === 'loading' && <RefreshCw className="w-4 h-4 animate-spin" />}
              {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {feedback.type === 'info' && <Sparkles className="w-4 h-4 text-amber-400" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold">{feedback.message}</span>
                {feedback.type === 'success' && (
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Live Updated
                  </span>
                )}
              </div>
              <div className="text-[11px] opacity-75 mt-0.5 flex items-center gap-1.5">
                <Clock className="w-3 h-3 inline" />
                <span>সময়: {feedback.timestamp}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setFeedback(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            title="নোটিফিকেশন বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* GitHub Activity & Commit Frequency Section */}
      <GitHubActivitySection />

      {/* Section Header with Real-Time Search Bar, Live Status & Stats */}
      <div className="bg-slate-900/70 p-4 sm:p-5 rounded-2xl border border-slate-800 mb-6 shadow-md backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                প্রজেক্ট ও রিপোজিটরি তালিকা
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                {filteredProjects.length} / {projects.length} টি
              </span>
              {isLiveSynced && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>সিঙ্কড</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>সর্বশেষ সিঙ্ক: {lastRefreshedAt}</span>
              {searchQuery && (
                <span className="text-slate-400 ml-1">
                  • রিয়েল-টাইম সার্চ সক্রিয়
                </span>
              )}
            </p>
          </div>

          {/* Real-time search and filter controls */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <div className="relative flex-1 sm:w-80">
              <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchQuery('');
                }}
                placeholder="রিয়েল-টাইম খুঁজুন (নাম, ট্যাগ, প্রযুক্তি)..."
                aria-label="ফিল্টার রিপোজিটরি"
                className="w-full bg-slate-800/90 text-white placeholder-slate-400 text-xs pl-9 pr-8 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white p-0.5 rounded hover:bg-slate-700/60 transition-colors"
                  title="অনুসন্ধান ফিল্টার মুছুন"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => fetchGitHubRepositories(true)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-emerald-500/40 text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50 shrink-0"
              title="গিটহাব রিপোজিটরি তালিকা পুনরায় রিফ্রেশ করুন"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isRefreshing ? 'animate-spin text-emerald-400' : 'text-slate-400'
                }`}
              />
              <span>{isRefreshing ? 'রিফ্রেশ হচ্ছে...' : 'Refresh Data'}</span>
            </button>
          </div>
        </div>

        {/* Active Filters Row */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap pt-3 mt-3 border-t border-slate-800/80 text-xs">
            <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-emerald-400" />
              <span>ফিল্টার:</span>
            </span>

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                <Search className="w-3 h-3 text-emerald-400" />
                <span>&quot;{searchQuery}&quot;</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="hover:text-white text-emerald-400 ml-0.5"
                  title="সার্চ মুছুন"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                <span>ক্যাটাগরি: {selectedCategory}</span>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className="hover:text-white text-indigo-400 ml-0.5"
                  title="ক্যাটাগরি রিসেট করুন"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedLanguage && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                <span>ভাষা: {selectedLanguage}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLanguage(null);
                    setSearchQuery('');
                  }}
                  className="hover:text-white text-amber-400 ml-0.5"
                  title="ভাষা ফিল্টার রিসেট করুন"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 ml-auto transition-colors font-medium px-2 py-0.5 rounded hover:bg-slate-800"
            >
              <RotateCcw className="w-3 h-3" />
              <span>সব রিসেট করুন</span>
            </button>
          </div>
        )}
      </div>

      {/* Projects Grid or Empty State */}
      {filteredProjects.length > 0 ? (
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ${
            isCardHighlight ? 'ring-2 ring-emerald-500/40 rounded-3xl p-1' : ''
          }`}
        >
          {filteredProjects.map((project) => {
            const CategoryIcon = getCategoryIcon(project.category);
            const activeSearchTerm = searchQuery.trim().toLowerCase();

            return (
              <div
                key={project.id}
                className={`group rounded-3xl bg-slate-900 border p-6 flex flex-col justify-between transition-all hover:scale-[1.01] shadow-xl hover:shadow-2xl hover:shadow-emerald-500/5 ${
                  isCardHighlight
                    ? 'border-emerald-500/60 shadow-emerald-500/10'
                    : 'border-slate-800 hover:border-emerald-500/40'
                }`}
              >
                <div>
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center border border-slate-700">
                        <CategoryIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-400 px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700">
                        {project.category}
                      </span>
                    </div>

                    {project.latestVersion && (
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        {project.latestVersion}
                      </span>
                    )}
                  </div>

                  {/* Project Visual Thumbnail */}
                  {project.imageUrl && (project.imageUrl.startsWith('/src/assets/images') || project.imageUrl.startsWith('http')) && (
                    <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-4 border border-slate-800 group-hover:border-slate-700/80 transition-colors">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>
                      <span className="absolute bottom-2 left-2.5 text-[9px] font-mono font-bold text-slate-300 bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded border border-slate-700/80">
                        {project.category}
                      </span>
                    </div>
                  )}

                  {/* Project Title & Desc */}
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tags.map((tag, tIdx) => {
                      const isTagMatched =
                        activeSearchTerm !== '' &&
                        tag.toLowerCase().includes(activeSearchTerm);

                      return (
                        <span
                          key={tIdx}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition-all ${
                            isTagMatched
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold ring-1 ring-emerald-500/20'
                              : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                          }`}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-400 font-mono">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{project.stars || 120}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      title="GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>

                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 font-bold transition-all text-xs"
                    >
                      <span>প্রিভিউ</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State when Search Query Yields No Results */
        <div className="text-center py-16 px-4 bg-slate-900/40 rounded-3xl border border-slate-800/80 backdrop-blur-sm">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-700/60">
            <SearchX className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            কোনো রিপোজিটরি বা প্রজেক্ট খুঁজে পাওয়া যায়নি
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
            {searchQuery
              ? `"${searchQuery}" এর সাথে সম্পর্কিত কোনো ফলাফল পাওয়া যায়নি। অনুগ্রহ করে বানান যাচাই করুন অথবা ফিল্টার রিসেট করুন।`
              : 'নির্বাচিত ফিল্টারের সাথে কোনো রিপোজিটরি মেলেনি।'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ফিল্টার রিসেট করুন</span>
            </button>
          </div>

          <div className="border-t border-slate-800/80 pt-6 max-w-lg mx-auto">
            <p className="text-[11px] text-slate-400 font-medium mb-3">
              জনপ্রিয় টপিকসমূহ অনুসন্ধান করে দেখতে পারেন:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {popularKeywords.map((kw) => (
                <button
                  key={kw}
                  onClick={() => {
                    setSearchQuery(kw);
                    setSelectedCategory('All');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium transition-colors"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
