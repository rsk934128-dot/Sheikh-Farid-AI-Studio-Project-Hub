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
    id: 'ai-assistant-coding-studio',
    title: 'AI Assistant Coding Studio (এআই কোডিং স্টুডিও)',
    name: 'AI Assistant Coding Studio Engine',
    description: 'সর্বাধুনিক এআই অ্যাসিস্ট্যান্ট কোডিং প্ল্যাটফর্ম। সার্চ গ্রাউন্ডিং, সিনট্যাক্স হাইলাইটিং এবং রিয়েল-টাইম ক্লায়েন্ট-সাইড এক্সিকিউশন আর্কিটেকচার।',
    category: 'AI & LLM',
    tags: ['Gemini 2.5', 'Search Grounding', 'TypeScript', 'React', 'Live Workspace'],
    githubUrl: 'https://github.com/rsk934128-dot/AI-Assistant-Coding-Studio',
    demoUrl: '#',
    latestVersion: 'v3.2.0',
    imageUrl: '/src/assets/images/ai_neural_grounding_1791835954278.jpg',
    stars: 185,
    featured: true
  },
  {
    id: 'sheikh-farid-project-hub',
    title: 'Sheikh Farid Project Hub (প্রজেক্ট হাব)',
    name: 'Sheikh Farid AI Studio Project Hub',
    description: 'শেখ ফরিদের সেন্ট্রাল পোর্টফোলিও ও প্রজেক্ট হাব। লাইভ গিটহাব এপিআই মেট্রিক্স, কমিট ফ্রিকোয়েন্সি বার চার্ট এবং পিডব্লিউএ আর্কিটেকচার।',
    category: 'Developer Tools',
    tags: ['GitHub API', 'PWA', 'Tailwind CSS', 'Vite', 'Dynamic Charts'],
    githubUrl: 'https://github.com/rsk934128-dot/Sheikh-Farid-AI-Studio-Project-Hub',
    demoUrl: '#',
    latestVersion: 'v2.1.0',
    imageUrl: '/src/assets/images/ecosystem_showcase_1791835964877.jpg',
    stars: 142,
    featured: true
  },
  {
    id: 'payhub-gateway',
    title: 'PayHub Gateway & Disbursement (পে-হাব গেটওয়ে)',
    name: 'PayHub Gmail Disbursement PWA',
    description: 'স্ট্রাইপ ও জিমেইল ইন্টিগ্রেশন সমন্বিত স্বয়ংক্রিয় আর্থিক ডিসবার্সমেন্ট সিস্টেম। নিরাপদ পেমেন্ট যাচাইকরণ ও কিউআর কোড রশিদ।',
    category: 'GovTech',
    tags: ['Stripe', 'Gmail API', 'OAuth 2.0', 'Disbursement', 'Security'],
    githubUrl: 'https://github.com/rsk934128-dot/PayHub-Gateway-Gmail-Disbursement-PWA',
    demoUrl: '#',
    latestVersion: 'v1.9.4',
    imageUrl: '/src/assets/images/govtech_digital_portal_1791835943620.jpg',
    stars: 210,
    featured: true
  },
  {
    id: 'stripe-gmail-gateway',
    title: 'Stripe Gmail Payment Hub (স্ট্রাইপ পেমেন্ট হাব)',
    name: 'Stripe-Gmail Payment Gateway Hub',
    description: 'ফুলস্ট্যাক স্ট্রাইপ গেটওয়ে সংযোগকারী ও ক্লাউড নোটিফিকেশন হাব। দ্রুত ইনভয়েস ইস্যু এবং লেনদেন নিরীক্ষা টুল।',
    category: 'Productivity',
    tags: ['FinTech', 'Stripe API', 'PWA', 'Audit Logs', 'Fast Sync'],
    githubUrl: 'https://github.com/rsk934128-dot/Stripe-Gmail-Payment-Gateway-Hub',
    demoUrl: '#',
    latestVersion: 'v2.0.1',
    imageUrl: '/src/assets/images/ecosystem_showcase_1791835964877.jpg',
    stars: 168,
    featured: true
  },
  {
    id: 'apk-editor-studio',
    title: 'APK Editor Studio (এপিকে এডিটর)',
    name: 'Android APK Editor Studio & Utilities',
    description: 'অ্যান্ড্রয়েড অ্যাপ্লিকেশন প্যাকেজ বিশ্লেষণ, ম্যানিফেস্ট পরিদর্শন এবং ক্লায়েন্ট-সাইড অ্যাসেট অপ্টিমাইজেশন ইউটিলিটি।',
    category: 'Developer Tools',
    tags: ['Android Tools', 'APK Parser', 'Manifest Inspector', 'Decompiler'],
    githubUrl: 'https://github.com/rsk934128-dot/APK-Editor-Studio',
    demoUrl: '#',
    latestVersion: 'v1.4.0',
    imageUrl: '/public/pwa-512x512.svg',
    stars: 96,
    featured: false
  },
  {
    id: 'fifa-hub',
    title: 'FIFA Hub & Sports Analytics (ফিফা হাব)',
    name: 'FIFA Sports Analytics & Live Feed',
    description: 'স্পোর্টস অ্যানালিটিক্স, লাইভ ম্যাচ স্ট্যাটাস এবং রিয়েল-টাইম প্লেয়ার পারফরম্যান্স ট্র্যাকিং ড্যাশবোর্ড।',
    category: 'Productivity',
    tags: ['Sports Analytics', 'Realtime Feed', 'PWA', 'Tailwind'],
    githubUrl: 'https://github.com/rsk934128-dot/FIFA-Hub-1',
    demoUrl: '#',
    latestVersion: 'v1.2.0',
    imageUrl: '/public/pwa-512x512.svg',
    stars: 115,
    featured: false
  }
];
