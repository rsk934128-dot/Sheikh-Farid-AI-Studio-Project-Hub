import React, { useState } from 'react';
import { FolderGit2, Star, ExternalLink, Github, Search, Filter, Sparkles, Layers, Shield, Bot, Terminal, Code2 } from 'lucide-react';
import { initialProjects, ProjectItem } from '../data/projectsData';

export const ProjectsHub: React.FC = () => {
  const [projects] = useState<ProjectItem[]>(initialProjects);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'GovTech', 'AI & LLM', 'Productivity', 'Developer Tools'];

  const filteredProjects = projects.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'GovTech': return Shield;
      case 'AI & LLM': return Bot;
      case 'Developer Tools': return Terminal;
      default: return Layers;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 mb-8 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
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

          <div className="flex items-center gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 backdrop-blur-sm shrink-0">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">মোট প্রজেক্ট</div>
              <div className="text-2xl font-black text-white">{projects.length} টি</div>
            </div>
            <div className="w-px h-8 bg-slate-700"></div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">কমিউনিটি স্টার</div>
              <div className="text-2xl font-black text-amber-400 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>1.2k+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
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
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="প্রজেক্ট খুঁজুন..."
              className="w-full bg-slate-800/90 text-slate-200 text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const CategoryIcon = getCategoryIcon(project.category);
          return (
            <div
              key={project.id}
              className="group rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-6 flex flex-col justify-between transition-all hover:scale-[1.01] shadow-xl hover:shadow-2xl hover:shadow-emerald-500/5"
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

                {/* Project Title & Desc */}
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/60"
                    >
                      {tag}
                    </span>
                  ))}
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

    </div>
  );
};
