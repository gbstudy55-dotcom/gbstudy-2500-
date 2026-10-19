import { Platform, SiteSettings } from '../types';

export const defaultSettings: SiteSettings = {
  siteName: "GB STUDY",
  tagline: "Education Must be Free For Everyone",
  logoUrl: "https://i.ibb.co/Q3g9fGSt/1791541921524.png",
  telegramChannelUrl: "https://t.me/GBFreestudy",
  telegramPopup: {
    enabled: true,
    title: "Join Community!",
    description: "This site can be banned anytime. Please join our channel for latest updates and direct support.",
    membersText: "88,874 Members",
    btnText: "JOIN TELEGRAM",
  },
  accessKeySettings: {
    enabled: false,
    validKeys: ["GBFREE", "GBSTUDY2025", "FREEBATCH"],
    getKeyUrl: "https://t.me/GBFreestudy",
  },
  adminPasscode: "GBADMIN2026",
};

// High fidelity SVG icons representing the platforms seen in the video
export const defaultPlatforms: Platform[] = [
  {
    id: "pw",
    name: "Physics Wallah",
    url: "https://www.pw.live",
    glowColor: "#ffffff",
    icon: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="22" fill="#0c0d10"/>
        <circle cx="50" cy="50" r="42" fill="none" stroke="#2a2e39" stroke-width="2"/>
        <text x="50" y="62" font-family="'Outfit', sans-serif" font-weight="900" font-size="34" fill="#ffffff" text-anchor="middle" letter-spacing="-1">P<tspan fill="#3b82f6">W</tspan></text>
      </svg>
    `)}`,
    category: "JEE / NEET / Boards",
    description: "Alakh Pandey Sir's official batches, notes & live classes",
    order: 1,
    active: true,
  },
  {
    id: "next-toppers",
    name: "Next Toppers",
    url: "https://nexttoppers.com",
    glowColor: "#00f0ff",
    icon: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="22" fill="#081414"/>
        <path d="M28 28 L52 50 L28 72 M48 28 L72 50 L48 72" fill="none" stroke="#00e5ff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="28" cy="24" r="5" fill="#22c55e"/>
      </svg>
    `)}`,
    category: "Class 9th & 10th",
    description: "Next Toppers online preparation batches & lectures",
    order: 2,
    active: true,
  },
  {
    id: "mission-jeet",
    name: "Mission JEET",
    url: "https://t.me/GBFreestudy",
    glowColor: "#ff3b57",
    icon: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="22" fill="#180b0e"/>
        <circle cx="50" cy="40" r="18" fill="#ff2a55" fill-opacity="0.15" stroke="#ff2a55" stroke-width="3"/>
        <path d="M42 40 L48 46 L60 34" fill="none" stroke="#ff2a55" stroke-width="3" stroke-linecap="round"/>
        <text x="50" y="74" font-family="'Outfit', sans-serif" font-weight="900" font-size="14" fill="#ffffff" text-anchor="middle">MISSION</text>
        <text x="50" y="88" font-family="'Outfit', sans-serif" font-weight="900" font-size="13" fill="#ff3b57" text-anchor="middle">JEET</text>
      </svg>
    `)}`,
    category: "JEE / NEET",
    description: "Dedicated JEE Main & Advanced batches & test series",
    order: 3,
    active: true,
  },
  {
    id: "science-and-fun",
    name: "Science & Fun",
    url: "https://scienceandfun.com",
    glowColor: "#ffd600",
    icon: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="22" fill="#f8e71c"/>
        <circle cx="50" cy="50" r="44" fill="none" stroke="#222" stroke-width="2"/>
        <text x="50" y="48" font-family="'Outfit', sans-serif" font-weight="900" font-size="34" fill="#111111" text-anchor="middle">S<tspan fill="#ff2d55">&amp;</tspan>F</text>
        <text x="50" y="66" font-family="'Outfit', sans-serif" font-weight="800" font-size="10" fill="#111111" text-anchor="middle" letter-spacing="1">SCIENCE &amp; FUN</text>
      </svg>
    `)}`,
    category: "Class 9th to 12th",
    description: "Ashu Sir and team - concept clarity with practical science",
    order: 4,
    active: true,
  },
  {
    id: "master-sahab",
    name: "Master Sahab",
    url: "https://t.me/GBFreestudy",
    glowColor: "#ff9100",
    icon: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="22" fill="#1a1209"/>
        <circle cx="50" cy="36" r="16" fill="#ff9900" fill-opacity="0.2" stroke="#ff9900" stroke-width="2.5"/>
        <path d="M30 76 C30 58 70 58 70 76" fill="none" stroke="#ff9900" stroke-width="3"/>
        <circle cx="44" cy="35" r="3.5" fill="#ffffff"/>
        <circle cx="56" cy="35" r="3.5" fill="#ffffff"/>
        <path d="M40 33 L60 33" stroke="#ffffff" stroke-width="2"/>
        <text x="50" y="90" font-family="'Outfit', sans-serif" font-weight="800" font-size="10" fill="#ffb84d" text-anchor="middle">MASTER SAHAB</text>
      </svg>
    `)}`,
    category: "General Studies",
    description: "Master Sahab full course videos & downloadable materials",
    order: 5,
    active: true,
  },
  {
    id: "vibrant",
    name: "Vibrant",
    url: "https://t.me/GBFreestudy",
    glowColor: "#ffaa00",
    icon: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="22" fill="#140f08"/>
        <circle cx="50" cy="50" r="38" fill="none" stroke="#ff9f1c" stroke-width="3"/>
        <circle cx="50" cy="50" r="32" fill="none" stroke="#ff9f1c" stroke-dasharray="4,4" stroke-width="1.5"/>
        <path d="M36 36 L50 64 L64 36" fill="none" stroke="#ffaa00" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `)}`,
    category: "Kota Coaching Batches",
    description: "Premier Kota faculty lectures & DPP sheets",
    order: 6,
    active: true,
  },
  {
    id: "gb-books",
    name: "GB Books & Notes",
    url: "https://t.me/GBFreestudy",
    glowColor: "#22c55e",
    icon: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="22" fill="#09170e"/>
        <rect x="25" y="52" width="50" height="10" rx="3" fill="#22c55e"/>
        <rect x="28" y="39" width="44" height="10" rx="3" fill="#10b981"/>
        <rect x="31" y="26" width="38" height="10" rx="3" fill="#34d399"/>
        <text x="50" y="82" font-family="'Outfit', sans-serif" font-weight="800" font-size="11" fill="#4ade80" text-anchor="middle">GB BOOKS</text>
      </svg>
    `)}`,
    category: "E-Books & PDFs",
    description: "Complete handwritten notes, standard reference books & DPPs",
    order: 7,
    active: true,
  },
  {
    id: "unacademy",
    name: "Unacademy",
    url: "https://unacademy.com",
    glowColor: "#2563eb",
    icon: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="22" fill="#0a121e"/>
        <path d="M30 42 C30 30 70 30 70 42" fill="none" stroke="#3b82f6" stroke-width="7" stroke-linecap="round"/>
        <path d="M24 62 C24 45 76 45 76 62" fill="none" stroke="#60a5fa" stroke-width="7" stroke-linecap="round"/>
      </svg>
    `)}`,
    category: "Top Educators",
    description: "India's largest online learning platform batches",
    order: 8,
    active: true,
  },
  {
    id: "rwa",
    name: "RWA",
    url: "https://rojgarwithankit.co.in",
    glowColor: "#ef4444",
    icon: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="22" fill="#130909"/>
        <polygon points="50,18 78,32 78,65 50,86 22,65 22,32" fill="#2d1212" stroke="#ef4444" stroke-width="2.5"/>
        <text x="50" y="48" font-family="'Outfit', sans-serif" font-weight="900" font-size="16" fill="#ffffff" text-anchor="middle">RWA</text>
        <text x="50" y="64" font-family="'Outfit', sans-serif" font-weight="700" font-size="7" fill="#fca5a5" text-anchor="middle">ROJGAR</text>
      </svg>
    `)}`,
    category: "Govt Job Exams",
    description: "Ankit Bhati Sir - UP Police, SSC GD, Delhi Police batches",
    order: 9,
    active: true,
  },
  {
    id: "khan-gs",
    name: "Khan Global Studies",
    url: "https://khanglobalstudies.com",
    glowColor: "#38bdf8",
    icon: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="22" fill="#081520"/>
        <circle cx="50" cy="45" r="28" fill="none" stroke="#38bdf8" stroke-width="3"/>
        <text x="50" y="52" font-family="'Outfit', sans-serif" font-weight="900" font-size="18" fill="#38bdf8" text-anchor="middle">KGS</text>
        <text x="50" y="84" font-family="'Outfit', sans-serif" font-weight="700" font-size="9" fill="#93c5fd" text-anchor="middle">KHAN SIR</text>
      </svg>
    `)}`,
    category: "UPSC / BPSC / SSC",
    description: "Khan Sir GS lectures, mapping, current affairs & foundation",
    order: 10,
    active: true,
  },
  {
    id: "testbook",
    name: "Testbook",
    url: "https://testbook.com",
    glowColor: "#10b981",
    icon: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="22" fill="#061811"/>
        <path d="M30 30 L50 45 L70 30 L70 70 L50 55 L30 70 Z" fill="#10b981"/>
      </svg>
    `)}`,
    category: "Mock Tests & PYQs",
    description: "Test series, speed tests & sectional quizzes",
    order: 11,
    active: true,
  },
  {
    id: "drishti-ias",
    name: "Drishti IAS",
    url: "https://www.drishtiias.com",
    glowColor: "#ec4899",
    icon: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="22" fill="#1a0913"/>
        <path d="M25 50 Q50 25 75 50 Q50 75 25 50 Z" fill="none" stroke="#ec4899" stroke-width="3"/>
        <circle cx="50" cy="50" r="9" fill="#ec4899"/>
        <text x="50" y="84" font-family="'Outfit', sans-serif" font-weight="800" font-size="9" fill="#f472b6" text-anchor="middle">DRISHTI IAS</text>
      </svg>
    `)}`,
    category: "UPSC Civil Services",
    description: "Vikas Divyakirti Sir - Hindi & English medium UPSC guidance",
    order: 12,
    active: true,
  },
];

// Presets that admin can pick from with one click
export const platformPresets = [
  {
    name: "Adda247",
    url: "https://www.adda247.com",
    glowColor: "#f97316",
    category: "Banking & SSC",
    icon: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="22" fill="#1a0e08"/>
        <text x="50" y="48" font-family="'Outfit', sans-serif" font-weight="900" font-size="22" fill="#f97316" text-anchor="middle">ADDA</text>
        <text x="50" y="70" font-family="'Outfit', sans-serif" font-weight="900" font-size="18" fill="#ffffff" text-anchor="middle">247</text>
      </svg>
    `)}`
  },
  {
    name: "Apni Kaksha",
    url: "https://www.apnikaksha.net",
    glowColor: "#8b5cf6",
    category: "Coding & JEE",
    icon: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="22" fill="#130920"/>
        <text x="50" y="46" font-family="'Outfit', sans-serif" font-weight="900" font-size="16" fill="#a78bfa" text-anchor="middle">APNI</text>
        <text x="50" y="68" font-family="'Outfit', sans-serif" font-weight="900" font-size="15" fill="#ffffff" text-anchor="middle">KAKSHA</text>
      </svg>
    `)}`
  },
  {
    name: "Careerwill",
    url: "https://careerwill.com",
    glowColor: "#06b6d4",
    category: "Govt Exams",
    icon: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="22" fill="#081820"/>
        <circle cx="50" cy="50" r="34" fill="none" stroke="#06b6d4" stroke-width="4"/>
        <text x="50" y="58" font-family="'Outfit', sans-serif" font-weight="900" font-size="26" fill="#ffffff" text-anchor="middle">CW</text>
      </svg>
    `)}`
  },
  {
    name: "Target with Alok",
    url: "https://t.me/GBFreestudy",
    glowColor: "#eab308",
    category: "State Exams & Teaching",
    icon: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="22" fill="#181508"/>
        <circle cx="50" cy="50" r="30" fill="none" stroke="#eab308" stroke-width="3"/>
        <circle cx="50" cy="50" r="14" fill="#eab308"/>
      </svg>
    `)}`
  }
];
