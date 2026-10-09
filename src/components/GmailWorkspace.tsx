import React, { useState, useEffect, useCallback } from 'react';
import { Mail, Tag, Filter, Inbox, Star, AlertCircle, RefreshCw, Send, CheckCircle2, Search, Key, ShieldCheck, FileText, Trash2, Archive } from 'lucide-react';

export interface GmailLabel {
  id: string;
  name: string;
  type?: 'system' | 'user';
  messagesTotal?: number;
  messagesUnread?: number;
}

export interface GmailMessageItem {
  id: string;
  threadId: string;
  sender: string;
  subject: string;
  snippet: string;
  date: string;
  labelIds: string[];
  unread: boolean;
  starred?: boolean;
}

interface GmailWorkspaceProps {
  initialAccessToken?: string;
}

export const GmailWorkspace: React.FC<GmailWorkspaceProps> = ({ initialAccessToken = '' }) => {
  const [accessToken, setAccessToken] = useState<string>(initialAccessToken);
  const [labels, setLabels] = useState<GmailLabel[]>([]);
  const [selectedLabelId, setSelectedLabelId] = useState<string>('INBOX');
  const [messages, setMessages] = useState<GmailMessageItem[]>([]);
  const [isLoadingLabels, setIsLoadingLabels] = useState<boolean>(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<GmailMessageItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Sync token from parent if updated
  useEffect(() => {
    if (initialAccessToken) {
      setAccessToken(initialAccessToken);
      fetchUserLabels(initialAccessToken);
    } else if (!accessToken) {
      // Load demo mode initial state for immediate usability
      enableDemoData();
    }
  }, [initialAccessToken]);

  const enableDemoData = () => {
    setIsDemoMode(true);
    const demoLabels: GmailLabel[] = [
      { id: 'INBOX', name: 'INBOX', type: 'system', messagesTotal: 24, messagesUnread: 3 },
      { id: 'STARRED', name: 'STARRED', type: 'system', messagesTotal: 5, messagesUnread: 0 },
      { id: 'IMPORTANT', name: 'IMPORTANT', type: 'system', messagesTotal: 8, messagesUnread: 2 },
      { id: 'SENT', name: 'SENT', type: 'system', messagesTotal: 42, messagesUnread: 0 },
      { id: 'DRAFT', name: 'DRAFT', type: 'system', messagesTotal: 2, messagesUnread: 0 },
      { id: 'GovTech-Updates', name: 'GovTech-Updates', type: 'user', messagesTotal: 12, messagesUnread: 1 },
      { id: 'Project-Hub', name: 'Project-Hub', type: 'user', messagesTotal: 7, messagesUnread: 0 }
    ];

    const demoMessages: GmailMessageItem[] = [
      {
        id: 'msg-1',
        threadId: 'th-1',
        sender: 'ডিজিটাল বাংলাদেশ নাগরিক সেবা <noreply@gov.bd>',
        subject: 'অনলাইন জিডি (GD) আবেদনের প্রাপ্তিস্বীকার পত্র',
        snippet: 'আপনার জিডি সফলভাবে সাধারণ ডায়েরিভুক্ত করা হয়েছে। থানার তদন্তকারী কর্মকর্তা অতিসত্বর যোগাযোগ করবেন...',
        date: 'আজ ১০:১৫ AM',
        labelIds: ['INBOX', 'IMPORTANT', 'GovTech-Updates'],
        unread: true,
        starred: true
      },
      {
        id: 'msg-2',
        threadId: 'th-2',
        sender: 'Sheikh Farid Studio Core <notifications@sheikhfarid.dev>',
        subject: 'New release v4.0.1: Mini Microsoft & Bengali AI Engine',
        snippet: 'Zero-latency edge caching and local PWA audit completed with 100/100 PWABuilder score...',
        date: 'গতকাল',
        labelIds: ['INBOX', 'Project-Hub'],
        unread: true
      },
      {
        id: 'msg-3',
        threadId: 'th-3',
        sender: 'Google Cloud Platform <cloud-noreply@google.com>',
        subject: 'OAuth 2.0 Credentials Status & Workspace Gmail Scopes',
        snippet: 'Your application has been granted read-only access to Gmail labels and user threads safely...',
        date: '৭ অক্টো',
        labelIds: ['INBOX', 'STARRED'],
        unread: false,
        starred: true
      },
      {
        id: 'msg-4',
        threadId: 'th-4',
        sender: 'বাংলাদেশ পুলিশ সাপোর্ট <support@police.gov.bd>',
        subject: 'প্রশাসনিক ছুটির আবেদন অনুমোদিত হয়েছে',
        snippet: 'আপনার ৩ দিনের অর্জিত ছুটির আবেদনটি বিভাগীয় প্রধান কর্তৃক চূড়ান্ত অনুমোদন লাভ করেছে...',
        date: '৫ অক্টো',
        labelIds: ['INBOX', 'GovTech-Updates'],
        unread: false
      },
      {
        id: 'msg-5',
        threadId: 'th-5',
        sender: 'Me <me@farid.dev>',
        subject: 'Draft: ScrollVerse Architecture Whitepaper 2026',
        snippet: 'Next generation infinite canvas with client-side reactive virtual scrolling...',
        date: '৩ অক্টো',
        labelIds: ['DRAFT', 'Project-Hub'],
        unread: false
      }
    ];

    setLabels(demoLabels);
    setMessages(demoMessages);
    setSelectedMessage(demoMessages[0]);
  };

  /**
   * Fetches user labels from the Gmail API using the provided access token
   * Requirement 1: "Create a function in the GmailWorkspace component that fetches user labels from the Gmail API using the provided access token and displays them as a filter list."
   */
  const fetchUserLabels = useCallback(async (tokenToUse: string) => {
    if (!tokenToUse.trim()) {
      setErrorMessage('অনুগ্রহ করে বৈধ গুগল এক্সেস টোকেন প্রদান করুন বা ডেমো মোড চালু করুন।');
      return;
    }

    setIsLoadingLabels(true);
    setErrorMessage(null);

    try {
      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/labels', {
        headers: {
          'Authorization': `Bearer ${tokenToUse.trim()}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('এক্সেস টোকেনটির মেয়াদ শেষ অথবা অকার্যকর। অনুগ্রহ করে নতুন টোকেন সংগ্রহ করুন।');
        }
        throw new Error(`Gmail API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const rawLabels: any[] = data.labels || [];

      // Sort labels: System labels first (INBOX, STARRED, etc.), then custom user labels
      const formattedLabels: GmailLabel[] = rawLabels.map(l => ({
        id: l.id,
        name: l.name,
        type: (l.type === 'system' ? 'system' : 'user') as 'system' | 'user',
        messagesTotal: l.messagesTotal,
        messagesUnread: l.messagesUnread
      })).sort((a, b) => {
        if (a.id === 'INBOX') return -1;
        if (b.id === 'INBOX') return 1;
        if (a.type === 'system' && b.type !== 'system') return -1;
        if (a.type !== 'system' && b.type === 'system') return 1;
        return a.name.localeCompare(b.name);
      });

      setLabels(formattedLabels);
      setIsDemoMode(false);

      // Now fetch message list for selected label
      await fetchMessagesForLabel(tokenToUse, selectedLabelId || 'INBOX');
    } catch (err: any) {
      console.warn('Failed to fetch Gmail labels:', err);
      setErrorMessage(err.message || 'Gmail API থেকে লেবেল লোড করা সম্ভব হয়নি। ডেমো ডেটা দেখানো হচ্ছে।');
      enableDemoData();
    } finally {
      setIsLoadingLabels(false);
    }
  }, [selectedLabelId]);

  /**
   * Fetch messages for a specific label
   */
  const fetchMessagesForLabel = async (token: string, labelId: string) => {
    setIsLoadingMessages(true);
    try {
      const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=${labelId}&maxResults=15`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token.trim()}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Gmail API messages error: ${response.status}`);
      }

      const listData = await response.json();
      const messageRefs: any[] = listData.messages || [];

      if (messageRefs.length === 0) {
        setMessages([]);
        setSelectedMessage(null);
        return;
      }

      // Fetch headers and snippets for top messages
      const messageDetails = await Promise.all(
        messageRefs.slice(0, 8).map(async (ref) => {
          try {
            const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${ref.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`, {
              headers: { 'Authorization': `Bearer ${token.trim()}` }
            });
            if (!detailRes.ok) return null;
            const detailData = await detailRes.json();
            const headers = detailData.payload?.headers || [];
            const subjectHeader = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
            const fromHeader = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || 'Unknown Sender';
            const dateHeader = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';

            return {
              id: detailData.id,
              threadId: detailData.threadId,
              sender: fromHeader,
              subject: subjectHeader,
              snippet: detailData.snippet || '',
              date: dateHeader ? new Date(dateHeader).toLocaleDateString('bn-BD') : 'সম্প্রতি',
              labelIds: detailData.labelIds || [labelId],
              unread: (detailData.labelIds || []).includes('UNREAD'),
              starred: (detailData.labelIds || []).includes('STARRED')
            } as GmailMessageItem;
          } catch {
            return null;
          }
        })
      );

      const validMessages = messageDetails.filter(Boolean) as GmailMessageItem[];
      setMessages(validMessages);
      if (validMessages.length > 0) {
        setSelectedMessage(validMessages[0]);
      }
    } catch (err) {
      console.warn('Error fetching messages list:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSelectLabel = (labelId: string) => {
    setSelectedLabelId(labelId);
    if (!isDemoMode && accessToken) {
      fetchMessagesForLabel(accessToken, labelId);
    }
  };

  const visibleMessages = messages.filter(msg => {
    const matchesLabel = isDemoMode
      ? (selectedLabelId === 'ALL' || msg.labelIds.includes(selectedLabelId))
      : true;
    const matchesQuery = searchQuery
      ? (msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
         msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
         msg.snippet.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return matchesLabel && matchesQuery;
  });

  const getLabelIcon = (labelId: string) => {
    switch (labelId) {
      case 'INBOX': return Inbox;
      case 'STARRED': return Star;
      case 'IMPORTANT': return AlertCircle;
      case 'SENT': return Send;
      case 'DRAFT': return FileText;
      case 'TRASH': return Trash2;
      default: return Tag;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 mb-6 shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-3">
              <Mail className="w-3.5 h-3.5" />
              <span>Google Workspace 1P API ইন্টিগ্রেশন</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              জিমেইল ওয়ার্কস্পেস ও লেবেল ফিল্টারিং
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Gmail REST API ব্যবহার করে ইউজারের সব লেবেল ফেচ করুন এবং রিয়েল-টাইমে ফিল্টার করে মেসেজ ব্রাউজ করুন।
            </p>
          </div>

          {/* Access Token Connect Bar */}
          <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 backdrop-blur-md max-w-md w-full">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                <span>OAuth 2.0 এক্সেস টোকেন</span>
              </span>
              {isDemoMode && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                  ডেমো মোড সক্রিয়
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="password"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="Google Bearer Access Token পেস্ট করুন..."
                className="flex-1 bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => fetchUserLabels(accessToken)}
                disabled={isLoadingLabels}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLabels ? 'animate-spin' : ''}`} />
                <span>ফেচ</span>
              </button>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-200 text-xs flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              {errorMessage}
            </span>
            <button
              onClick={enableDemoData}
              className="text-xs font-bold text-amber-300 underline hover:text-white"
            >
              ডেমো ডেটা দেখুন
            </button>
          </div>
        )}
      </div>

      {/* Gmail Workspace Two-Column Explorer */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-900/80 rounded-3xl border border-slate-800 shadow-xl overflow-hidden min-h-[580px]">
        
        {/* Left Sidebar: User Labels Filter List */}
        <div className="md:col-span-4 lg:col-span-3 border-r border-slate-800 p-4 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5 text-emerald-400" />
                <span>লেবেল তালিকা ({labels.length})</span>
              </div>
              <button
                onClick={() => fetchUserLabels(accessToken)}
                title="রিফ্রেশ লেবেল"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingLabels ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Labels Navigation List */}
            <div className="space-y-1 overflow-y-auto max-h-[460px] pr-1">
              {labels.map((label) => {
                const IconComponent = getLabelIcon(label.id);
                const isSelected = selectedLabelId === label.id;
                return (
                  <button
                    key={label.id}
                    onClick={() => handleSelectLabel(label.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <IconComponent className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{label.name}</span>
                    </div>

                    {label.messagesUnread !== undefined && label.messagesUnread > 0 ? (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isSelected ? 'bg-white text-emerald-800' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {label.messagesUnread}
                      </span>
                    ) : label.messagesTotal !== undefined && (
                      <span className="text-[10px] text-slate-500 opacity-60">
                        {label.messagesTotal}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>নিরাপদ ক্লায়েন্ট-সাইড Bearer ট্রান্সফার</span>
          </div>
        </div>

        {/* Center: Filtered Message List */}
        <div className="md:col-span-4 lg:col-span-4 border-r border-slate-800 flex flex-col">
          
          {/* Search & Header */}
          <div className="p-3 border-b border-slate-800">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="মেসেজ সার্চ করুন..."
                className="w-full bg-slate-800/80 text-slate-200 text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-700/80 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Message Cards */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {isLoadingMessages ? (
              <div className="p-8 text-center text-xs text-slate-400">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-400" />
                <span>মেসেজ লোড হচ্ছে...</span>
              </div>
            ) : visibleMessages.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                <Mail className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>এই লেবেলে কোনো মেসেজ নেই।</p>
              </div>
            ) : (
              visibleMessages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={`p-3.5 cursor-pointer transition-colors ${
                      isSelected ? 'bg-slate-800/90' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className={`font-semibold truncate max-w-[150px] ${msg.unread ? 'text-white' : 'text-slate-400'}`}>
                        {msg.sender.split('<')[0]}
                      </span>
                      <span className="text-slate-500 text-[10px]">{msg.date}</span>
                    </div>

                    <h4 className={`text-xs mb-1 truncate ${msg.unread ? 'font-bold text-slate-100' : 'font-medium text-slate-300'}`}>
                      {msg.subject}
                    </h4>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {msg.snippet}
                    </p>

                    <div className="flex items-center gap-1 mt-2">
                      {msg.labelIds.slice(0, 2).map((lbl, idx) => (
                        <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {lbl}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Selected Message Detail */}
        <div className="md:col-span-4 lg:col-span-5 p-6 flex flex-col justify-between bg-slate-900/30">
          {selectedMessage ? (
            <div>
              <div className="border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ফিল্টার: {selectedLabelId}
                  </span>
                  <span className="text-xs text-slate-400">{selectedMessage.date}</span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-white mb-2 leading-tight">
                  {selectedMessage.subject}
                </h2>

                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <span className="text-slate-500">প্রেরক:</span>
                  <span className="font-semibold text-emerald-400">{selectedMessage.sender}</span>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed space-y-3 font-sans">
                <p className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.snippet}
                </p>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1">
                  <div className="font-bold text-slate-300 mb-1">মেটাডেটা ও লেবেল আইডি:</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedMessage.labelIds.map((l, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/20 text-[10px]">
                        🏷️ {l}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              একটি বার্তা নির্বাচন করুন
            </div>
          )}

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Gmail REST API v1 Compliant</span>
            <span className="text-emerald-400 font-mono">0ms Sync</span>
          </div>
        </div>

      </div>

    </div>
  );
};
