import React, { useState } from 'react';
import { Shield, FileText, PhoneCall, CheckCircle2, Printer, Copy, Download, Sparkles, Building, AlertTriangle, ArrowRight } from 'lucide-react';

export const CitizenGovTech: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'gd' | 'leave' | 'hotlines'>('gd');
  
  // GD State
  const [gdData, setGdData] = useState({
    thana: 'মিরপুর মডেল থানা',
    district: 'ঢাকা',
    applicantName: 'মোহাম্মদ শেখ ফরিদ',
    fatherName: 'মরহুম আব্দুল আলীম',
    address: 'বাড়ি নং ১২, রোড নং ৫, ব্লক-সি, মিরপুর-২, ঢাকা',
    phone: '01700000000',
    nid: '19952691234567890',
    itemType: 'জাতীয় পরিচয়পত্র ও ড্রাইভিং লাইসেন্স',
    lostDate: new Date().toISOString().split('T')[0],
    lostPlace: 'মিরপুর ১০ গোলচত্বর সংলগ্ন এলাকা',
    description: 'আমার মানিব্যাগে থাকা আসল জাতীয় পরিচয়পত্র (NID) এবং বিআরটিএ কর্তৃক প্রদত্ত স্মার্ট ড্রাইভিং লাইসেন্স হারিয়ে গেছে। সকল সম্ভাব্য স্থানে খোঁজাখুঁজি করিয়াও কোনো সন্ধান পাওয়া যায় নাই।'
  });

  // Leave / Petition State
  const [leaveData, setLeaveData] = useState({
    recipient: 'বিভাগীয় প্রধান / মহাপরিচালক',
    organization: 'বাংলাদেশ তথ্যপ্রযুক্তি অধিদপ্তর, আগারগাঁও, ঢাকা',
    applicantName: 'শেখ ফরিদ',
    designation: 'সিনিয়র সিস্টেম অ্যানালিস্ট',
    subject: 'জরুরি পারিবারিক কারণে ৩ (তিন) দিনের নৈমিত্তিক ছুটির আবেদন',
    startDate: new Date().toISOString().split('T')[0],
    daysCount: '৩',
    reason: 'জরুরি পারিবারিক কাজ এবং অসুস্থ অভিভাবকের চিকিৎসার জন্য আগামী ৩ দিন কর্মস্থলে উপস্থিত থাকা সম্ভব হবে না।'
  });

  const [copied, setCopied] = useState(false);

  const emergencyHotlines = [
    { number: '999', name: 'জাতীয় জরুরি সেবা', desc: 'পুলিশ, অ্যাম্বুলেন্স ও ফায়ার সার্ভিস (টোল ফ্রি)', tag: '২৪/৭ সক্রিয়', color: 'from-rose-500 to-red-600' },
    { number: '333', name: 'সরকারি তথ্য ও সেবা', desc: 'নাগরিক সেবা ও তথ্য প্রাপ্তির হেল্পলাইন', tag: 'টোল ফ্রি', color: 'from-emerald-500 to-teal-600' },
    { number: '109', name: 'নারী ও শিশু হেল্পলাইন', desc: 'সহিংসতা ও বাল্যবিয়ে প্রতিরোধ সেল', tag: 'জরুরি', color: 'from-purple-500 to-indigo-600' },
    { number: '106', name: 'দুদক অভিযোগ সেল', desc: 'দুর্নীতি দমন কমিশন হটলাইন', tag: 'গোপনীয়', color: 'from-amber-500 to-orange-600' },
    { number: '16122', name: 'ভূমি সেবা হটলাইন', desc: 'ভূমি সেবা, নামজারি ও খতিয়ান সংক্রান্ত সহায়তা', tag: 'নাগরিক সেবা', color: 'from-blue-500 to-cyan-600' },
    { number: '1098', name: 'চাইল্ড হেল্পলাইন', desc: 'ঝুঁকিতে থাকা শিশুদের জরুরি সুরক্ষায়', tag: 'টোল ফ্রি', color: 'from-pink-500 to-rose-600' }
  ];

  const getGeneratedDocument = () => {
    if (activeSubTab === 'gd') {
      return `গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
ডিজিটাল সিটিজেনডেস্ক • সাধারণ ডায়েরি (Online GD Form)

তারিখ: ${new Date().toLocaleDateString('bn-BD')}

বরাবর,
ভারপ্রাপ্ত কর্মকর্তা (Officer-in-Charge),
${gdData.thana}, ${gdData.district}।

বিষয়: ${gdData.itemType} হারানো সংক্রান্ত সাধারণ ডায়েরি (GD) করার আবেদন।

জনাব,
যথাবিহিত সম্মান প্রদর্শনপূর্বক বিনীত নিবেদন এই যে, আমি ${gdData.applicantName}, পিতা: ${gdData.fatherName}, বর্তমান ঠিকানা: ${gdData.address}, মোবাইল নম্বর: ${gdData.phone}, জাতীয় পরিচয়পত্র নং: ${gdData.nid}।

আমি আপনার অবগতির জন্য জানাইতেছি যে, অদ্য ${gdData.lostDate} তারিখে আনুমানিক সময় ${gdData.lostPlace} হইতে আমার ব্যবহৃত "${gdData.itemType}" অনিচ্ছাকৃতভাবে হারাইয়া গিয়াছে। আমি আশপাশের এলাকা ও সম্ভাব্য সকল স্থানে খোঁজাখুঁজি করিয়াও কোনো সন্ধান পাই নাই।

হারিয়ে যাওয়া বিবরণ:
${gdData.description}

এমতাবস্থায়, ভবিষ্যৎ আইনি সুরক্ষার সুবিধার্থে বিষয়টি আপনার থানায় সাধারণ ডায়েরিভুক্ত (GD Entry) করার প্রয়োজনীয় ব্যবস্থা গ্রহণ করিতে মহোদয়ের সুমর্জি হয়।

বিনীত নিবেদক,

স্বাক্ষর: _________________________
নাম: ${gdData.applicantName}
মোবাইল: ${gdData.phone}
এনআইডি: ${gdData.nid}`;
    }

    if (activeSubTab === 'leave') {
      return `আবেদনপত্র (অফিসিয়াল ফরম্যাট)

তারিখ: ${new Date().toLocaleDateString('bn-BD')}

বরাবর,
${leaveData.recipient},
${leaveData.organization}।

বিষয়: ${leaveData.subject}।

মহোদয়,
যথাবিহিত সম্মান প্রদর্শনপূর্বক বিনীত নিবেদন এই যে, আমি ${leaveData.applicantName}, আপনার কার্যালয়ে "${leaveData.designation}" হিসেবে কর্মরত আছি। ${leaveData.reason}। উক্ত কারণে আগামী ${leaveData.startDate} তারিখ হইতে মোট ${leaveData.daysCount} দিন কর্মস্থলে উপস্থিত থাকা আমার পক্ষে সম্ভব হইবে না।

এমতাবস্থায়, বিনীত প্রার্থনা এই যে— উপরোল্লিখিত বিষয়টি বিবেচনাপূর্বক আমাকে আগামী ${leaveData.startDate} তারিখ হইতে ${leaveData.daysCount} দিনের নৈমিত্তিক ছুটি মঞ্জুর করিয়া বাধিত করিবেন।

বিনীত নিবেদক,

স্বাক্ষর: _________________________
নাম: ${leaveData.applicantName}
পদবি: ${leaveData.designation}
তারিখ: ${new Date().toLocaleDateString('bn-BD')}`;
    }

    return '';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getGeneratedDocument());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const doc = getGeneratedDocument();
    const win = window.open('', '', 'width=800,height=600');
    if (win) {
      win.document.write(`<pre style="font-family: sans-serif; font-size: 14px; white-space: pre-wrap; padding: 40px; line-height: 1.6;">${doc}</pre>`);
      win.document.close();
      win.print();
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
      
      {/* Top Banner with GovTech Visual Image */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 mb-8 shadow-xl border border-emerald-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
              <Shield className="w-3.5 h-3.5" />
              <span>ডিজিটাল বাংলাদেশ • সিটিজেনডেস্ক গভটেক প্ল্যাটফর্ম</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              সার্ভিস সরকার (CitizenDesk BD)
            </h1>
            <p className="text-sm text-emerald-100/90 leading-relaxed mb-4">
              নাগরিকদের দৈনন্দিন প্রশাসনিক কাজ সহজ করতে তাৎক্ষণিক অনলাইন জিডি ড্রাফট, সরকারি ছুটির আবেদন ও সকল জরুরি জাতীয় হটলাইনের একীভূত ডিজিটাল সেবা পোর্টাল।
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-500/30">
                  অফলাইন-রেডি পিডব্লিউএ
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">| ২৪/৭ জাতীয় নাগরিক সহায়তা</span>
            </div>
          </div>

          {/* Visual Portal Illustration */}
          <div className="relative shrink-0 w-full lg:w-72 sm:h-44 h-36 rounded-2xl overflow-hidden border border-emerald-500/40 shadow-2xl shadow-emerald-500/10 group">
            <img
              src="/src/assets/images/govtech_digital_portal_1791835943620.jpg"
              alt="স্মার্ট গভর্ন্যান্স পোর্টাল ও সিটিজেন ই-সার্ভিস"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-300 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-emerald-500/30">
                স্মার্ট গভর্নেন্স হাব
              </span>
              <span className="text-[10px] font-mono text-slate-300 bg-slate-950/80 px-1.5 py-0.5 rounded">
                E-Gov BD
              </span>
            </div>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="flex space-x-2 mt-6 pt-4 border-t border-emerald-500/20 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('gd')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeSubTab === 'gd'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                : 'bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>অনলাইন জিডি (GD) জেনারেটর</span>
          </button>

          <button
            onClick={() => setActiveSubTab('leave')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeSubTab === 'leave'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                : 'bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/60'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>প্রশাসনিক ছুটির আবেদনপত্র</span>
          </button>

          <button
            onClick={() => setActiveSubTab('hotlines')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeSubTab === 'hotlines'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                : 'bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/60'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>জরুরি জাতীয় হটলাইন (৯৯৯)</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeSubTab === 'hotlines' ? (
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-emerald-400" />
              <span>জরুরি সেবা জাতীয় হটলাইন ডিরেক্টরি</span>
            </h2>
            <p className="text-xs text-slate-400">যে কোনো জরুরি প্রয়োজনে সরাসরি কল করতে নম্বরে ক্লিক করুন।</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {emergencyHotlines.map((h, i) => (
              <a
                key={i}
                href={`tel:${h.number}`}
                className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-5 hover:border-emerald-500/40 transition-all hover:scale-[1.02] shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black font-mono tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                      {h.number}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {h.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-100 text-base mb-1">{h.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{h.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>সরাসরি ডায়াল করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Form Input Column */}
          <div className="lg:col-span-5 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{activeSubTab === 'gd' ? 'জিডি তথ্য পূরণ করুন' : 'আবেদনের তথ্য দিন'}</span>
            </h2>

            {activeSubTab === 'gd' ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">থানা ও জেলা</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={gdData.thana}
                      onChange={(e) => setGdData({ ...gdData, thana: e.target.value })}
                      placeholder="থানা"
                      className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      value={gdData.district}
                      onChange={(e) => setGdData({ ...gdData, district: e.target.value })}
                      placeholder="জেলা"
                      className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">আবেদনকারীর নাম ও পিতা</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={gdData.applicantName}
                      onChange={(e) => setGdData({ ...gdData, applicantName: e.target.value })}
                      placeholder="আপনার নাম"
                      className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      value={gdData.fatherName}
                      onChange={(e) => setGdData({ ...gdData, fatherName: e.target.value })}
                      placeholder="পিতার নাম"
                      className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">হারানো বস্তুর ধরন</label>
                  <input
                    type="text"
                    value={gdData.itemType}
                    onChange={(e) => setGdData({ ...gdData, itemType: e.target.value })}
                    placeholder="যেমন: জাতীয় পরিচয়পত্র / মোবাইল"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">হারানোর তারিখ ও স্থান</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={gdData.lostDate}
                      onChange={(e) => setGdData({ ...gdData, lostDate: e.target.value })}
                      className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      value={gdData.lostPlace}
                      onChange={(e) => setGdData({ ...gdData, lostPlace: e.target.value })}
                      placeholder="স্থান"
                      className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">বিস্তারিত বিবরণ</label>
                  <textarea
                    rows={3}
                    value={gdData.description}
                    onChange={(e) => setGdData({ ...gdData, description: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">বরাবর ও প্রতিষ্ঠান</label>
                  <input
                    type="text"
                    value={leaveData.recipient}
                    onChange={(e) => setLeaveData({ ...leaveData, recipient: e.target.value })}
                    placeholder="কর্মকর্তার পদবি"
                    className="w-full mb-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    value={leaveData.organization}
                    onChange={(e) => setLeaveData({ ...leaveData, organization: e.target.value })}
                    placeholder="প্রতিষ্ঠানের নাম ও ঠিকানা"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">আবেদনকারী ও পদবি</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={leaveData.applicantName}
                      onChange={(e) => setLeaveData({ ...leaveData, applicantName: e.target.value })}
                      placeholder="আপনার নাম"
                      className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      value={leaveData.designation}
                      onChange={(e) => setLeaveData({ ...leaveData, designation: e.target.value })}
                      placeholder="আপনার পদবি"
                      className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">ছুটির শুরু ও মোট দিন</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={leaveData.startDate}
                      onChange={(e) => setLeaveData({ ...leaveData, startDate: e.target.value })}
                      className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      value={leaveData.daysCount}
                      onChange={(e) => setLeaveData({ ...leaveData, daysCount: e.target.value })}
                      placeholder="দিনের সংখ্যা (যেমন: ৩)"
                      className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">ছুটির সুনির্দিষ্ট কারণ</label>
                  <textarea
                    rows={3}
                    value={leaveData.reason}
                    onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Generated Document Preview Column */}
          <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-bold text-slate-200">লাইভ অফিসিয়াল নথি প্রিভিউ</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700 transition-all"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-white shadow-sm transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>প্রিন্ট / PDF</span>
                  </button>
                </div>
              </div>

              {/* Official Document Sheet */}
              <div className="relative bg-white text-slate-900 rounded-2xl p-6 sm:p-8 font-sans shadow-inner overflow-hidden border border-slate-200">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5 select-none text-center">
                  <div className="text-8xl font-black">বাংলাদেশ</div>
                  <div className="text-4xl font-bold">CITIZENDESK</div>
                </div>

                <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed relative z-10 font-mono">
                  {getGeneratedDocument()}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>বাংলাদেশ পুলিশ ও সাধারণ প্রশাসন স্ট্যান্ডার্ড ফরম্যাট</span>
              </span>
              <span className="text-slate-500 font-mono">Ver: 2.1-GovBD</span>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
