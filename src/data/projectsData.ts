export interface ProjectItem {
  id: string | number;
  title: string;
  name: string;
  description: string;
  category: 'GovTech' | 'AI & LLM' | 'Developer Tools' | 'Productivity';
  tags: string[];
  githubUrl: string;
  demoUrl?: string;
  latestVersion?: string;
  imageUrl?: string;
  stars?: number;
  featured?: boolean;
}

export const initialProjects: ProjectItem[] = [
  {
    id: 'scrollverse',
    title: 'ScrollVerse (স্ক্রোলভার্স)',
    name: 'ScrollVerse Edge Canvas',
    description: 'ফিউচারিস্টিক ইনফিনিট ক্যানভাস এবং আধুনিক জিরো-ল্যাটেন্সি প্রজেক্ট ম্যানেজমেন্ট আর্কিটেকচার। লাইটওয়েট ও রেসপনসিভ মাল্টিটাস্কিং ইন্টারফেস।',
    category: 'Productivity',
    tags: ['Infinite Canvas', 'React', 'TypeScript', 'PWA', 'Zero Cost'],
    githubUrl: 'https://github.com/sf0745026/scrollverse',
    demoUrl: '#',
    latestVersion: 'v2.4.0',
    imageUrl: '/public/pwa-512x512.svg',
    stars: 148,
    featured: true
  },
  {
    id: 'citizendesk-bd',
    title: 'CitizenDesk BD (সিটিজেনডেস্ক বিডি)',
    name: 'CitizenDesk BD GovTech Portal',
    description: 'ডিজিটাল বাংলাদেশের নাগরিকদের জন্য তাৎক্ষণিক অনলাইন জিডি (GD) জেনারেটর, প্রশাসনিক আবেদনপত্র খসড়া এবং জরুরি হটলাইন ডিরেক্টরি।',
    category: 'GovTech',
    tags: ['GovTech', 'Online GD', 'Citizen Portal', 'Digital BD', 'Offline PWA'],
    githubUrl: 'https://github.com/sf0745026/citizendesk-bd',
    demoUrl: '#',
    latestVersion: 'v1.8.5',
    imageUrl: '/public/pwa-512x512.svg',
    stars: 215,
    featured: true
  },
  {
    id: 'noor-ai',
    title: 'NoorAI & FastGov Edge (নূর এআই)',
    name: 'NoorAI Ultra-Fast Bengali Assistant',
    description: 'সর্বাধুনিক বাংলা এআই ইঞ্জিন। জিরো-সার্ভার কস্ট, স্মার্ট প্রম্পট চিপস এবং আইন ও প্রশাসনিক নথি প্রক্রিয়াকরণ সুবিধা।',
    category: 'AI & LLM',
    tags: ['Gemini 2.5', 'Bengali NLP', 'Local Cache', 'AI Assistant', 'Client Edge'],
    githubUrl: 'https://github.com/sf0745026/noor-ai-edge',
    demoUrl: '#',
    latestVersion: 'v3.1.0',
    imageUrl: '/public/pwa-512x512.svg',
    stars: 340,
    featured: true
  },
  {
    id: 'code-exchange',
    title: 'Sheikh Code Exchange (কোড এক্সচেঞ্জ)',
    name: 'Sheikh Code Exchange & Utilities',
    description: 'উচ্চ পারফরম্যান্সের ডেভেলপার ইউটিলিটি, সিনট্যাক্স অপ্টিমাইজার এবং ক্লায়েন্ট-সাইড কোড জেনারেশন আর্কিটেকচার।',
    category: 'Developer Tools',
    tags: ['DevTools', 'Snippets', 'Syntax Highlighting', 'Edge Utilities'],
    githubUrl: 'https://github.com/sf0745026/sheikh-code-exchange',
    demoUrl: '#',
    latestVersion: 'v1.2.0',
    imageUrl: '/public/pwa-512x512.svg',
    stars: 89,
    featured: false
  },
  {
    id: 'mini-microsoft',
    title: 'Mini Microsoft Suite (মিনি মাইক্রোসফট)',
    name: 'Mini Microsoft Web Ecosystem',
    description: 'অফলাইন ওয়ার্কস্পেস, জিমেইল ওয়ার্কস্পেস ফিল্টার, ড্রাফট কম্পোজার এবং পিডব্লিউএ ১০০/১০০ কমপ্লায়েন্ট ফুলস্ট্যাক ইকোসিস্টেম।',
    category: 'Productivity',
    tags: ['Gmail API', 'OAuth 2.0', 'PWABuilder', 'Workbox', 'Tailwind CSS'],
    githubUrl: 'https://github.com/sf0745026/mini-microsoft-suite',
    demoUrl: '#',
    latestVersion: 'v4.0.1',
    imageUrl: '/public/pwa-512x512.svg',
    stars: 412,
    featured: true
  }
];
