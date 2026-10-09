import React from 'react';
import { User, Code2, Cpu, Globe, Award, Shield, CheckCircle2, Sparkles, Terminal, Mail, Github, Heart } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
      
      {/* Hero Profile Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-8 sm:p-12 mb-10 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-center gap-8">
          
          {/* Avatar / Portrait Card */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 p-1 shadow-2xl shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center overflow-hidden">
                <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  SF
                </span>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 shadow-lg">
              স্থপতি
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
                href="https://github.com/sf0745026"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all"
              >
                <Github className="w-4 h-4 text-emerald-400" />
                <span>github.com/sf0745026</span>
              </a>

              <a
                href="mailto:sf0745026@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all"
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
          <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/60">
            <div className="text-emerald-400 font-bold text-sm mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>১. ক্লায়েন্ট-এজ এক্সিকিউশন</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              ভারী প্রসেসিং ব্রাউজারের নিজস্ব জাভাস্ক্রিপ্ট ইঞ্জিনে ঘটে। এর ফলে সার্ভার লোড থাকে শূন্যের কোঠায় এবং অ্যাপ্লিকেশন অত্যন্ত মসৃণভাবে চলে।
            </p>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/60">
            <div className="text-cyan-400 font-bold text-sm mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>২. লোকাল ইনডেক্সড স্টোরেজ</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              ব্যবহারকারীর সংবেদনশীল ডেটা এবং এআই ক্যাশ মেমোরি সম্পূর্ণ লোকাল স্টোরেজে এনক্রিপ্ট হয়ে সংরক্ষিত থাকে, কোনো কেন্দ্রীয় ডেটাবেজ লিক হওয়ার ঝুঁকি ছাড়াই।
            </p>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/60">
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
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-10 mb-10 shadow-xl">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-emerald-400" />
          <span>প্ল্যাটফর্ম আর্কিটেকচার ও স্ক্রিনশট গ্যালারি</span>
        </h2>

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
