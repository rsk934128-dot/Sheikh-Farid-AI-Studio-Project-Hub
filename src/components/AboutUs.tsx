import React from 'react';
import { User, Code2, Cpu, Globe, Award, Shield, CheckCircle2, Sparkles, Terminal, Mail, Github, Heart, Layers, ExternalLink } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
      
      {/* Hero Profile Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-8 sm:p-12 mb-10 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-center gap-8">
          
          {/* Avatar / Portrait Card with Photo */}
          <div className="relative shrink-0 group">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 p-1 shadow-2xl shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-900 rounded-[22px] overflow-hidden relative">
                <img
                  src="/src/assets/images/architect_portrait_1791835932249.jpg"
                  alt="প্রধান সফটওয়্যার স্থপতি মোহাম্মদ শেখ ফরিদ"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>
            <div className="absolute -bottom-2.5 -right-2 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 shadow-lg flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
              <span>স্থপতি</span>
            </div>
          </div>

          {/* Profile Details */}
          <div className="text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>প্রধান সফটওয়্যার স্থপতি ও উদ্ভাবক</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
              মোহাম্মদ শেখ ফরিদ (Sheikh Farid)
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed mb-4">
              বাংলাদেশি সফটওয়্যার স্থপতি, ওপেন সোর্স উদ্ভাবক এবং ডিজিটাল গভর্নেন্স বিশেষজ্ঞ। 'মিনি মাইক্রোসফট' ইকোসিস্টেমের মাধ্যমে সাধারণ নাগরিক ও প্রযুক্তিবিদদের জন্য নিরাপদ, উচ্চগতির এবং জিরো-সার্ভার-কস্ট ওয়েব প্ল্যাটফর্ম প্রতিষ্ঠায় নিবেদিত।
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <a
                href="https://github.com/rsk934128-dot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all hover:border-emerald-500/50 shadow-md"
              >
                <Github className="w-4 h-4 text-emerald-400" />
                <span>github.com/rsk934128-dot</span>
              </a>

              <a
                href="mailto:sf0745026@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all hover:border-cyan-500/50 shadow-md"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>sf0745026@gmail.com</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Sustainable Zero-Cost Architecture Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-10 mb-10 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              জিরো-সার্ভার-কস্ট ও টেকসই আর্কিটেকচার (Sustainability Strategy)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              কীভাবে উচ্চ ক্ষমতাসম্পন্ন এআই ও গভটেক অ্যাপ বিনামূল্যে পরিচালিত হচ্ছে
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/60 hover:border-emerald-500/30 transition-colors">
            <div className="text-emerald-400 font-bold text-sm mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>১. ক্লায়েন্ট-এজ এক্সিকিউশন</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              ভারী প্রসেসিং ব্রাউজারের নিজস্ব জাভাস্ক্রিপ্ট ইঞ্জিনে ঘটে। এর ফলে সার্ভার লোড থাকে শূন্যের কোঠায় এবং অ্যাপ্লিকেশন অত্যন্ত মসৃণভাবে চলে।
            </p>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/60 hover:border-cyan-500/30 transition-colors">
            <div className="text-cyan-400 font-bold text-sm mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>২. লোকাল ইনডেক্সড স্টোরেজ</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              ব্যবহারকারীর সংবেদনশীল ডেটা এবং এআই ক্যাশ মেমোরি সম্পূর্ণ লোকাল স্টোরেজে এনক্রিপ্ট হয়ে সংরক্ষিত থাকে, কোনো কেন্দ্রীয় ডেটাবেজ লিক হওয়ার ঝুঁকি ছাড়াই।
            </p>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/60 hover:border-indigo-500/30 transition-colors">
            <div className="text-indigo-400 font-bold text-sm mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>৩. ডিরেক্ট ১ম পক্ষীয় OAuth API</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              জিমেইল ও গুগল ক্লাউড সংযোগ নিরাপদ OAuth 2.0 টোকেনের মাধ্যমে সরাসরি গুগলের সার্ভারের সাথে যোগাযোগ করে, কোনো ইন্টারমিডিয়েট প্রক্সি ব্যতিরেকে।
            </p>
          </div>
        </div>
      </div>

      {/* Platform Architecture & Screenshot Showcase */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-10 mb-10 shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-emerald-400" />
              <span>প্ল্যাটফর্ম আর্কিটেকচার ও ভিজ্যুয়াল গ্যালারি</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              মিনি মাইক্রোসফট ইকোসিস্টেমের ক্লাউড অবকাঠামো, পিডব্লিউএ এবং গভটেক ইন্টারফেসের প্রিভিউ
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
            <Layers className="w-3.5 h-3.5" />
            <span>PWA v3.2.0 Production</span>
          </span>
        </div>

        {/* Hero Architectural Visual Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-8 border border-slate-700/80 group">
          <img
            src="/src/assets/images/ecosystem_showcase_1791835964877.jpg"
            alt="মিনি মাইক্রোসফট ক্লাউড আর্কিটেকচার ও ওয়ার্কস্টেশন প্রিভিউ"
            referrerPolicy="no-referrer"
            className="w-full h-64 sm:h-80 md:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          
          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-xl">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500 text-slate-950 mb-2 inline-block">
                CORE WORKSTATION TOPOLOGY
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-white">
                মিনি মাইক্রোসফট: ইউনিফাইড ডিজিটাল প্ল্যাটফর্ম
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1">
                জিরো-সার্ভার খরচ, স্বয়ংক্রিয় ক্লায়েন্ট-সাইড সিঙ্ক এবং মাল্টি-উইন্ডো ইন্টারেক্টিভ ওয়ার্কস্পেস।
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-900/90 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                100% Client-Side Engine
              </span>
            </div>
          </div>
        </div>

        {/* 3 Pillars Visual Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Card 1: AI Lab */}
          <div className="group rounded-2xl bg-slate-800/60 border border-slate-700/80 overflow-hidden hover:border-emerald-500/40 transition-all flex flex-col">
            <div className="relative h-44 overflow-hidden">
              <img
                src="/src/assets/images/ai_neural_grounding_1791835954278.jpg"
                alt="এআই ল্যাব ও রিয়েলটাইম সার্চ গ্রাউন্ডিং"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/90 text-slate-950">
                AI &amp; LLM
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-base font-bold text-white mb-1.5 group-hover:text-cyan-400 transition-colors">
                  বাংলা হাই-প্রিসিশন এআই ল্যাব
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  গুগল সার্চ গ্রাউন্ডিং দিয়ে রিয়েল-টাইম তথ্য যাচাই, আইন ও সরকারি নীতিমালার নিখুঁত বিশ্লেষণ।
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-cyan-300 font-mono">
                <span>✓ Gemini Grounded</span>
                <span>ভেরিফাইড সোর্স</span>
              </div>
            </div>
          </div>

          {/* Card 2: CitizenGovTech */}
          <div className="group rounded-2xl bg-slate-800/60 border border-slate-700/80 overflow-hidden hover:border-emerald-500/40 transition-all flex flex-col">
            <div className="relative h-44 overflow-hidden">
              <img
                src="/src/assets/images/govtech_digital_portal_1791835943620.jpg"
                alt="সার্ভিস সরকার সিটিজেনডেস্ক গভটেক পোর্টাল"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/90 text-slate-950">
                GovTech BD
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-base font-bold text-white mb-1.5 group-hover:text-emerald-400 transition-colors">
                  সার্ভিস সরকার (CitizenDesk)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  অনলাইন জিডি খসড়া, সরকারি ছুটির আবেদন ও জাতীয় জরুরি হটলাইন ডিরেক্টরি (৯৯৯)।
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-emerald-300 font-mono">
                <span>✓ বাংলাদেশ পুলিশ জিডি</span>
                <span>২৪/৭ সক্রিয়</span>
              </div>
            </div>
          </div>

          {/* Card 3: PWA Suite */}
          <div className="group rounded-2xl bg-slate-800/60 border border-slate-700/80 overflow-hidden hover:border-emerald-500/40 transition-all flex flex-col">
            <div className="relative h-44 overflow-hidden">
              <img
                src="/src/assets/images/ecosystem_showcase_1791835964877.jpg"
                alt="PWABuilder ১০০/১০০ কমপ্লায়েন্স"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/90 text-white">
                PWA 100/100
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-base font-bold text-white mb-1.5 group-hover:text-indigo-400 transition-colors">
                  পিডব্লিউএ কমপ্লায়েন্স স্যুট
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  অফলাইন ক্যাশিং, সার্ভিস ওয়ার্কার, মাস্কেবল আইকন ও ইনস্টলযোগ্য স্ট্যান্ডঅ্যালোন ওয়েব অ্যাপ।
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-indigo-300 font-mono">
                <span>✓ মাইক্রোসফট অডিট</span>
                <span>১০০% পারফেক্ট</span>
              </div>
            </div>
          </div>

        </div>

        {/* Detailed Compliance Specs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm text-white">📱 PWABuilder ১০০/১০০ কমপ্লায়েন্স</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">100/100</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              মাইক্রোসফট PWABuilder অডিটের সব মানদণ্ড (অফলাইন ক্যাশিং, সার্ভিস ওয়ার্কার, মাস্কেবল আইকন, স্ট্যান্ডঅ্যালোন ডিসপ্লে) পূরণ করা হয়েছে।
            </p>
            <div className="text-[11px] font-mono text-emerald-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
              ✓ ServiceWorker Registered (autoUpdate)<br />
              ✓ Web App Manifest Validated<br />
              ✓ Maskable SVG Icons (192x192 &amp; 512x512)
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm text-white">🏛️ সিটিজেনডেস্ক গভটেক ইঞ্জিন</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">GovTech BD</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              বাংলাদেশ পুলিশ অনলাইন জিডি মান এবং সাধারণ সরকারি ছুটির আবেদনপত্রের তাৎক্ষণিক ডিজিটাল খসড়া প্রস্তুতকারক।
            </p>
            <div className="text-[11px] font-mono text-cyan-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
              ✓ Instant General Diary Generator<br />
              ✓ Official Petition &amp; Letter Formatter<br />
              ✓ 24/7 National Emergency Hotline (999, 333)
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Dedication */}
      <div className="text-center py-6 text-xs text-slate-500 flex items-center justify-center gap-1">
        <span>নির্মাতা</span>
        <span className="text-emerald-400 font-bold">শেখ ফরিদ</span>
        <span>• মিনি মাইক্রোসফট ও সিটিজেনডেস্ক গভটেক ইকোসিস্টেম</span>
        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 ml-1 inline" />
      </div>

    </div>
  );
};
