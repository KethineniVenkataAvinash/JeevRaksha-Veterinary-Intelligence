'use client';

import { useEffect, useState, useRef } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Stethoscope, ClipboardList, BarChart3, 
  Settings, LogOut, Globe, ChevronDown, Menu, X, User, Info, BookOpen, Mic, MicOff, Bot
} from "lucide-react";
import { createClient } from '@/utils/supabase/client';
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const languages = [
  { code: 'en', langTag: 'en-IN', name: 'English (IN)' },
  { code: 'hi', langTag: 'hi-IN', name: 'हिंदी (Hindi)' },
  { code: 'te', langTag: 'te-IN', name: 'తెలుగు (Telugu)' },
  { code: 'ta', langTag: 'ta-IN', name: 'தமிழ் (Tamil)' },
  { code: 'ml', langTag: 'ml-IN', name: 'മലയാളం (Malayalam)' },
  { code: 'kn', langTag: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)' }
];

// --- AI VOICE DICTIONARY (With Sub-Menu Translations) ---
const aiResponses: Record<string, any> = {
  en: { 
    prompt: "I am online. How can I help you?", dashboard: "Navigating to the dashboard.", diagnose_main: "Opening the Diagnostic Center.", 
    diagnose_full: "Opening Full Diagnose wizard.", diagnose_skin: "Opening Skin Disease scanner.", diagnose_audio: "Opening Respiratory Audio scanner.", 
    diagnose_weight: "Opening Biometrics calculator.", diagnose_manual: "Opening Manual Formula.", history: "Opening your scan history.", 
    reports: "Opening analytics and reports.", guide: "Opening the Reference Guide.", settings: "Opening settings.", logout: "Logging you out.", 
    unknown: "I didn't quite catch that. Can you repeat?" 
  },
  hi: { 
    prompt: "मैं ऑनलाइन हूँ। मैं आपकी कैसे मदद कर सकता हूँ?", dashboard: "डैशबोर्ड पर जा रहा हूँ।", diagnose_main: "जांच केंद्र खोल रहा हूँ।", 
    diagnose_full: "संपूर्ण जांच अनुभाग खोल रहा हूँ।", diagnose_skin: "त्वचा रोग स्कैनर खोल रहा हूँ।", diagnose_audio: "श्वसन ऑडियो स्कैनर खोल रहा हूँ।", 
    diagnose_weight: "वजन और बायोमेट्रिक्स खोल रहा हूँ।", diagnose_manual: "मैनुअल कैलकुलेटर खोल रहा हूँ।", history: "इतिहास खोल रहा हूँ।", 
    reports: "रिपोर्ट्स खोल रहा हूँ।", guide: "गाइड खोल रहा हूँ।", settings: "सेटिंग्स खोल रहा हूँ।", logout: "लॉग आउट कर रहा हूँ।", 
    unknown: "मुझे समझ नहीं आया। कृपया फिर से बोलें।" 
  },
  te: { 
    prompt: "నేను ఆన్‌లైన్‌లో ఉన్నాను. ఎలా సహాయపడగలను?", dashboard: "డాష్‌బోర్డ్‌కు వెళ్తున్నాను.", diagnose_main: "డయాగ్నస్టిక్ సెంటర్‌ను తెరుస్తున్నాను.", 
    diagnose_full: "పూర్తి స్థాయి పరీక్షను తెరుస్తున్నాను.", diagnose_skin: "చర్మ వ్యాధి స్కానర్‌ను తెరుస్తున్నాను.", diagnose_audio: "శ్వాసకోశ ఆడియో స్కానర్‌ను తెరుస్తున్నాను.", 
    diagnose_weight: "బరువు మరియు బయోమెట్రిక్స్‌ను తెరుస్తున్నాను.", diagnose_manual: "మాన్యువల్ కాలిక్యులేటర్‌ను తెరుస్తున్నాను.", history: "చరిత్రను తెరుస్తున్నాను.", 
    reports: "రిపోర్ట్స్ తెరుస్తున్నాను.", guide: "గైడ్ తెరుస్తున్నాను.", settings: "సెట్టింగులు తెరుస్తున్నాను.", logout: "లాగ్ అవుట్ చేస్తున్నాను.", 
    unknown: "క్షమించండి, మళ్ళీ చెప్పండి." 
  },
  ta: { 
    prompt: "நான் ஆன்லைனில் இருக்கிறேன். எப்படி உதவலாம்?", dashboard: "முகப்புக்கு செல்கிறேன்.", diagnose_main: "பரிசோதனை மையத்தை திறக்கிறேன்.", 
    diagnose_full: "முழுமையான பரிசோதனையை திறக்கிறேன்.", diagnose_skin: "தோல் நோய் ஸ்கேனரை திறக்கிறேன்.", diagnose_audio: "சுவாச ஆடியோ ஸ்கேனரை திறக்கிறேன்.", 
    diagnose_weight: "எடை மற்றும் பயோமெட்ரிக்ஸை திறக்கிறேன்.", diagnose_manual: "மேனுவல் கால்குலேட்டரை திறக்கிறேன்.", history: "வரலாற்றை திறக்கிறேன்.", 
    reports: "அறிக்கைகளை திறக்கிறேன்.", guide: "வழிகாட்டியை திறக்கிறேன்.", settings: "அமைப்புகளை திறக்கிறேன்.", logout: "வெளியேறுகிறீர்கள்.", 
    unknown: "புரியவில்லை, மீண்டும் சொல்லவும்." 
  },
  ml: { 
    prompt: "ഞാൻ തയ്യാറാണ്. എങ്ങനെ സഹായിക്കാം?", dashboard: "ഡാഷ്‌ബോർഡിലേക്ക് പോകുന്നു.", diagnose_main: "പരിശോധന കേന്ദ്രം തുറക്കുന്നു.", 
    diagnose_full: "സമ്പൂർണ്ണ പരിശോധന തുറക്കുന്നു.", diagnose_skin: "ത്വക്ക് രോഗ സ്കാനർ തുറക്കുന്നു.", diagnose_audio: "ശ്വസന ഓഡിയോ സ്കാനർ തുറക്കുന്നു.", 
    diagnose_weight: "ഭാരവും ബയോമെട്രിക്സും തുറക്കുന്നു.", diagnose_manual: "മാനുവൽ കാൽക്കുലേറ്റർ തുറക്കുന്നു.", history: "ചരിത്രം തുറക്കുന്നു.", 
    reports: "റിപ്പോർട്ടുകൾ തുറക്കുന്നു.", guide: "വഴികാട്ടി തുറക്കുന്നു.", settings: "ക്രമീകരണങ്ങൾ തുറക്കുന്നു.", logout: "പുറത്തുകടക്കുന്നു.", 
    unknown: "മനസ്സിലായില്ല, വീണ്ടും പറയുക." 
  },
  kn: { 
    prompt: "ನಾನು ಸಿದ್ಧನಿದ್ದೇನೆ. ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?", dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹೋಗುತ್ತಿದ್ದೇನೆ.", diagnose_main: "ಪರೀಕ್ಷಾ ಕೇಂದ್ರ ತೆರೆಯುತ್ತಿದ್ದೇನೆ.", 
    diagnose_full: "ಸಂಪೂರ್ಣ ಪರೀಕ್ಷೆಯನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.", diagnose_skin: "ಚರ್ಮ ರೋಗ ಸ್ಕ್ಯಾನರ್ ತೆರೆಯುತ್ತಿದ್ದೇನೆ.", diagnose_audio: "ಉಸಿರಾಟದ ಆಡಿಯೊ ಸ್ಕ್ಯಾನರ್ ತೆರೆಯುತ್ತಿದ್ದೇನೆ.", 
    diagnose_weight: "ತೂಕ ಮತ್ತು ಬಯೋಮೆಟ್ರಿಕ್ಸ್ ತೆರೆಯುತ್ತಿದ್ದೇನೆ.", diagnose_manual: "ಮ್ಯಾನ್ಯುಯಲ್ ಕ್ಯಾಲ್ಕುಲೇಟರ್ ತೆರೆಯುತ್ತಿದ್ದೇನೆ.", history: "ಇತಿಹಾಸ ತೆರೆಯುತ್ತಿದ್ದೇನೆ.", 
    reports: "ವರದಿಗಳನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.", guide: "ಮಾರ್ಗದರ್ಶಿ ತೆರೆಯುತ್ತಿದ್ದೇನೆ.", settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.", logout: "ಲಾಗ್ ಔಟ್ ಆಗುತ್ತಿದ್ದೀರಿ.", 
    unknown: "ಅರ್ಥವಾಗಲಿಲ್ಲ, ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ." 
  }
};

// --- ADVANCED WEIGHTED INTENT ROUTING WITH SUB-MENUS ---
const commandIntents: Record<string, { keywords: string[], route?: string, action?: string }> = {
  dashboard: { keywords: ['dashboard', 'home', 'main menu', 'होम', 'डैशबोर्ड', 'ముఖ్యపుట', 'డాష్‌బోర్డ్', 'முகப்பு', 'ಮುಖಪುಟ', 'ഡാഷ്ബോർഡ്'], route: '/' },
  diagnose_full: { keywords: ['full diagnose', 'full scan', 'complete scan', 'entire scan', 'संपूर्ण जांच', 'पूरा स्कैन', 'పూర్తి స్కాన్', 'முழு சோதனை'], route: '/diagnose?tab=full' },
  diagnose_skin: { keywords: ['skin', 'dermal', 'lumpy', 'त्वचा', 'चर्म रोग', 'చర్మం', 'தோல்'], route: '/diagnose?tab=skin' },
  diagnose_audio: { keywords: ['audio', 'respiratory', 'cough', 'sound', 'lungs', 'breath', 'ध्वनि', 'खांसी', 'सांस', 'ఆడియో', 'దగ్గు', 'மூச்சு'], route: '/diagnose?tab=audio' },
  diagnose_weight: { keywords: ['weight', 'biometric', 'scale', 'size', 'mass', 'वजन', 'वज़न', 'బరువు', 'எடை', 'ತೂಕ'], route: '/diagnose?tab=weight' },
  diagnose_manual: { keywords: ['manual', 'formula', 'calculator', 'schaeffer', 'मैनुअल', 'कैलकुलेटर', 'మాన్యువల్', 'மேனுவல்'], route: '/diagnose?tab=manual' },
  diagnose_main: { keywords: ['diagnose', 'scan', 'doctor', 'checkup', 'test', 'जांच', 'चेकअप', 'पारीक्षा', 'స్కాన్', 'పరీక్ష', 'சோதனை', 'ಪರೀಕ್ಷೆ', 'പരിശോധന'], route: '/diagnose' },
  history: { keywords: ['history', 'past records', 'scan history', 'record', 'previous', 'इतिहास', 'पुराने', 'रिकॉर्ड', 'చరిత్ర', 'రికార్డ్', 'வரலாறு', 'ಇತಿಹಾಸ', 'ചരിത്രം'], route: '/history' },
  reports: { keywords: ['analytics', 'report', 'chart', 'statistics', 'graph', 'ग्राफ', 'रिपोर्ट', 'విశ్లేషణ', 'రిపోర్ట్', 'ரிப்போர்ட்', 'ವರದಿ', 'റിപ്പോർട്ട്'], route: '/reports' },
  guide: { keywords: ['guide', 'book', 'disease info', 'reference', 'learn', 'गाइड', 'किताब', 'बीमारी', 'जानकारी', 'మార్గదర్శి', 'వ్యాధి', 'வழிகாட்டி', 'ಮಾರ್ಗದರ್ಶಿ', 'ವഴികാട്ടി'], route: '/guide' },
  settings: { keywords: ['setting', 'profile', 'account', 'सेटिंग', 'प्रोफाइल', 'సెట్టింగులు', 'அமைப்புகள்', 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು', 'ക്രമീകരണങ്ങൾ'], route: '/settings' },
  logout: { keywords: ['logout', 'sign out', 'log out', 'लॉग आउट', 'बाहर', 'లాగ్ అవుట్', 'வெளியேறு', 'ಲಾಗ್ ಔಟ್', 'പുറത്തുകടക്കുക'], action: 'logout' }
};

interface ChatMessage {
  role: 'ai' | 'user';
  text: string;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const isLoginPage = pathname === '/login' || pathname === '/update-password' || pathname.startsWith('/auth');

  const [userMeta, setUserMeta] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  
  const [selectedLanguage, setSelectedLanguage] = useState("English (IN)");
  const [activeLangCode, setActiveLangCode] = useState("en");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // --- LIVE CHATBOT STATES ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [interimText, setInterimText] = useState("");
  const [micState, setMicState] = useState<'idle' | 'listening' | 'speaking' | 'processing'>('idle');
  
  const voiceRecognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const isManuallyStopped = useRef(false);

  // 1. Fetch User Data
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserMeta(user.user_metadata);
    };
    if (!isLoginPage) fetchUser(); 
  }, [isLoginPage, pathname]);

  // 2. Initialize Language State (Strictly Local Storage & Cookies)
  useEffect(() => {
    const savedLang = localStorage.getItem('jr_app_language');
    let targetLang = 'en';

    if (savedLang) {
       targetLang = savedLang;
    } else {
       const match = document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/);
       if (match && match[1]) targetLang = match[1];
    }

    const found = languages.find(l => l.code === targetLang) || languages[0];
    setActiveLangCode(found.code);
    setSelectedLanguage(found.name);

    if (!document.getElementById('google-translate-script')) {
      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          { pageLanguage: 'en', includedLanguages: 'en,hi,te,ta,ml,kn', autoDisplay: false },
          'google_translate_element'
        );
      };
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // 3. Auto-Scroll Chat to Bottom smoothly
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, interimText, micState]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleLanguageChange = (langCode: string, langName: string) => {
    setSelectedLanguage(langName);
    setActiveLangCode(langCode);
    setLangDropdownOpen(false);
    
    // Save explicitly to local storage to override location defaults
    localStorage.setItem('jr_app_language', langCode);

    // ALWAYS set the cookie (Even for English, we set /en/en so it stays explicit)
    const cookieValue = `/en/${langCode}`;
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname};`;
    
    window.location.reload();
  };

  // ==========================================
  // HIGH-ACCURACY CONTINUOUS AI VOICE ENGINE
  // ==========================================
  
  const addMessage = (role: 'ai' | 'user', text: string) => {
    setChatHistory(prev => [...prev, { role, text }]);
  };

  const speakToUser = (text: string, langCode: string, callback?: () => void) => {
    setMicState('speaking');
    addMessage('ai', text);
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      const utterance = new SpeechSynthesisUtterance(text);
      const langConfig = languages.find(l => l.code === langCode);
      utterance.lang = langConfig?.langTag || 'en-IN'; 
      utterance.rate = 0.95; 
      
      utterance.onend = () => {
        if (!isManuallyStopped.current) {
          // CONTINUOUS LOOP: Once AI finishes talking, it goes right back to listening!
          startListening(activeLangCode);
        } else {
          setMicState('idle');
        }
        if (callback) callback();
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        if (!isManuallyStopped.current) startListening(activeLangCode);
        if (callback) callback();
      }, 2000);
    }
  };

  const startListening = (fallbackLangCode: string) => {
    if (isManuallyStopped.current) return;

    setMicState('listening');
    setInterimText("");

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addMessage('ai', "Microphone access is not supported. Please use Google Chrome.");
      setMicState('idle');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Process chunk by chunk
    recognition.interimResults = true; 
    
    const langConfig = languages.find(l => l.code === fallbackLangCode);
    recognition.lang = langConfig?.langTag || 'en-IN';

    recognition.onresult = (event: any) => {
      let currentInterim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentInterim += event.results[i][0].transcript;
      }
      setInterimText(currentInterim);
      
      if (event.results[0].isFinal) {
        setMicState('processing');
        setInterimText("");
        addMessage('user', currentInterim);
        processVoiceCommand(currentInterim);
      }
    };

    recognition.onerror = (e: any) => {
      if (e.error !== 'no-speech' && e.error !== 'aborted' && !isManuallyStopped.current) {
        speakToUser(aiResponses[fallbackLangCode]?.unknown || aiResponses['en'].unknown, fallbackLangCode);
      } else if (e.error === 'no-speech' && !isManuallyStopped.current) {
        // Silent restart for continuous listening
        setTimeout(() => startListening(fallbackLangCode), 300);
      }
    };

    recognition.onend = () => {
      // Auto-restart if it stopped naturally but user didn't hit close
      if (!isManuallyStopped.current && micState === 'listening') {
        setTimeout(() => startListening(fallbackLangCode), 300);
      }
    };

    voiceRecognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      // Ignore start errors if it's already started
    }
  };

  // --- STRICT WEIGHTED INTENT MATCHER ---
  const getIntent = (transcript: string) => {
    const lowerT = transcript.toLowerCase();
    let bestIntent = 'unknown';
    let maxScore = 0;

    for (const [intent, data] of Object.entries(commandIntents)) {
      let score = 0;
      for (const kw of data.keywords) {
        const lowerKw = kw.toLowerCase();
        
        // Multi-word exact match gets a massive bonus (e.g. "full diagnose")
        if (lowerKw.includes(' ') && lowerT.includes(lowerKw)) {
           score += 50 + lowerKw.length;
        } 
        // English word boundary match (prevents "in" matching inside "skin")
        else if (/^[a-z]+$/.test(lowerKw)) {
           if (new RegExp(`\\b${lowerKw}\\b`, 'i').test(lowerT)) score += lowerKw.length;
        } 
        // Regional string inclusion
        else {
           if (lowerT.includes(lowerKw)) score += lowerKw.length;
        }
      }
      
      if (score > maxScore) {
        maxScore = score;
        bestIntent = intent;
      }
    }
    return bestIntent;
  };

  const processVoiceCommand = (command: string) => {
    const lowerCmd = command.toLowerCase();
    
    // Auto-Detect English overrides
    const isEnglishCommand = /[a-z]/i.test(lowerCmd);
    const replyLang = isEnglishCommand ? 'en' : activeLangCode;
    const responses = aiResponses[replyLang] || aiResponses['en'];

    const targetIntent = getIntent(command);

    if (targetIntent === 'unknown') {
      speakToUser(responses.unknown, replyLang);
      return;
    }

    if (targetIntent === 'logout') {
      speakToUser(responses.logout, replyLang, () => handleLogout());
      return;
    }

    // Dynamic Navigation Execution
    const intentData = commandIntents[targetIntent as keyof typeof commandIntents];
    if (intentData && intentData.route) {
      speakToUser(responses[targetIntent], replyLang, () => {
         router.push(intentData.route!);
      });
    }
  };

  const toggleChatbot = () => {
    if (isChatOpen) {
      setIsChatOpen(false);
      isManuallyStopped.current = true;
      setMicState('idle');
      if (voiceRecognitionRef.current) {
          voiceRecognitionRef.current.onend = null;
          voiceRecognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    } else {
      setIsChatOpen(true);
      isManuallyStopped.current = false;
      setChatHistory([]); 
      const responses = aiResponses[activeLangCode] || aiResponses['en'];
      speakToUser(responses.prompt, activeLangCode);
    }
  };

  const toggleMicManual = () => {
    if (micState === 'listening' || micState === 'processing' || micState === 'speaking') {
      isManuallyStopped.current = true;
      setMicState('idle');
      if (voiceRecognitionRef.current) {
          voiceRecognitionRef.current.onend = null;
          voiceRecognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    } else {
      isManuallyStopped.current = false;
      startListening(activeLangCode);
    }
  };

  const getPageTitle = () => {
    switch (pathname) {
      case '/': return 'JeevRaksha / Dashboard';
      case '/diagnose': return 'JeevRaksha / AI Diagnostic';
      case '/history': return 'JeevRaksha / History';
      case '/reports': return 'JeevRaksha / Analytics';
      case '/guide': return 'JeevRaksha / Clinical Guide'; 
      case '/about': return 'JeevRaksha / About';
      case '/settings': return 'JeevRaksha / Settings';
      case '/login': return 'JeevRaksha / Login';
      case '/update-password': return 'JeevRaksha / Update Password';
      default: return 'JeevRaksha Veterinary Intelligence';
    }
  };

  const NavigationLinks = () => (
    <>
      <Link href="/" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${pathname === '/' ? 'bg-vet-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-vet-blue-700'}`}>
        <LayoutDashboard className="h-4 w-4 shrink-0" /> <span className="notranslate">Dashboard</span>
      </Link>
      <Link href="/diagnose" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${pathname === '/diagnose' || pathname.startsWith('/diagnose') ? 'bg-vet-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-vet-blue-700'}`}>
        <Stethoscope className="h-4 w-4 shrink-0" /> AI Diagnostic
      </Link>
      <Link href="/history" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${pathname === '/history' ? 'bg-vet-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-vet-blue-700'}`}>
        <ClipboardList className="h-4 w-4 shrink-0" /> History
      </Link>
      <Link href="/reports" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${pathname === '/reports' ? 'bg-vet-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-vet-blue-700'}`}>
        <BarChart3 className="h-4 w-4 shrink-0" /> Analytics
      </Link>
      <Link href="/guide" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${pathname === '/guide' ? 'bg-vet-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-vet-blue-700'}`}>
        <BookOpen className="h-4 w-4 shrink-0" /> Clinical Guide
      </Link>
      <Link href="/about" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${pathname === '/about' ? 'bg-vet-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-vet-blue-700'}`}>
        <Info className="h-4 w-4 shrink-0" /> About
      </Link>
      <div className="my-2 border-t border-slate-100"></div>
      <Link href="/settings" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${pathname === '/settings' ? 'bg-slate-100 text-vet-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
        <Settings className="h-4 w-4 shrink-0" /> Settings
      </Link>
    </>
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{getPageTitle()}</title>
        <link rel="icon" href="/icon.png" type="image/png" />
        <style>{`
          .goog-te-banner-frame { display: none !important; }
          body { top: 0 !important; }
          #google_translate_element { position: absolute !important; opacity: 0 !important; pointer-events: none !important; }
          .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
          .skiptranslate { display: none !important; }
          
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        `}</style>
      </head>
      
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}>
        <div id="google_translate_element"></div>

        {isLoginPage ? (
          <main className="min-h-screen w-full overflow-x-hidden">{children}</main>
        ) : (
          <div className="flex h-screen overflow-hidden print:h-auto print:overflow-visible print:block relative">
            
            {mobileMenuOpen && <div className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-sm print:hidden" onClick={() => setMobileMenuOpen(false)}></div>}
            
            <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col justify-between z-40 transform transition-all duration-300 shrink-0 print:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:flex ${isSidebarOpen ? 'md:translate-x-0 md:ml-0' : 'md:-ml-64'}`}>
              <div>
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="JeevRaksha Logo" className="h-10 w-10 rounded-lg shadow-sm border border-slate-200 object-cover bg-white" />
                    <div>
                      <h1 className="font-bold text-lg text-slate-900 leading-tight notranslate">JeevRaksha</h1>
                      <p className="text-[10px] font-semibold text-vet-blue-600 uppercase tracking-wide notranslate">Veterinary Intelligence</p>
                    </div>
                  </div>
                  <button className="md:hidden text-slate-400 hover:text-slate-800" onClick={() => setMobileMenuOpen(false)}><X className="h-5 w-5" /></button>
                </div>
                <nav className="p-4 flex flex-col gap-1"><NavigationLinks /></nav>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <div onClick={handleLogout} className="flex items-center justify-between p-2.5 bg-white rounded-xl cursor-pointer hover:bg-red-50 border border-slate-200 transition-colors group shadow-sm">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="h-9 w-9 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                      {userMeta?.avatar_url ? <img src={userMeta.avatar_url} alt="User" className="h-full w-full object-cover" /> : <User className="h-5 w-5 text-slate-400" />}
                    </div>
                    <div className="truncate pr-2">
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-red-900 truncate">{userMeta?.full_name || 'User'}</p>
                      <p className="text-[11px] font-medium text-slate-500 capitalize notranslate">{userMeta?.role || 'Farmer'}</p>
                    </div>
                  </div>
                  <LogOut className="h-4 w-4 text-slate-400 group-hover:text-red-600 shrink-0 mr-1" />
                </div>
              </div>
            </aside>

            <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-0 print:h-auto print:overflow-visible print:block">
              <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10 transition-all duration-300 print:hidden">
                <div className="flex items-center gap-3">
                   <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-1.5 -ml-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
                     <Menu className="h-6 w-6" />
                   </button>
                   <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden md:block p-1.5 -ml-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
                     <Menu className="h-6 w-6" />
                   </button>
                   <span className="font-bold text-base text-slate-900 select-none notranslate">JeevRaksha Veterinary Intelligence</span>
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                   <div className="relative z-50">
                     <div onClick={() => setLangDropdownOpen(!langDropdownOpen)} className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                         <Globe className="h-4 w-4 text-slate-500" />
                         <span className="text-xs font-medium text-slate-700 select-none notranslate">{selectedLanguage}</span>
                         <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
                     </div>
                     
                     {langDropdownOpen && (
                       <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2">
                         {languages.map((lang) => (
                           <button key={lang.code} onClick={() => handleLanguageChange(lang.code, lang.name)} className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-slate-50 notranslate ${selectedLanguage === lang.name ? 'bg-vet-blue-50 text-vet-blue-700 border-l-2 border-vet-blue-600' : 'text-slate-700 border-l-2 border-transparent'}`}>
                             {lang.name}
                           </button>
                         ))}
                       </div>
                     )}
                   </div>

                   <Link href="/settings" className="p-2 text-slate-500 bg-slate-50 border border-slate-200 hover:bg-vet-blue-50 hover:text-vet-blue-600 hover:border-vet-blue-200 rounded-full transition-all shadow-sm">
                       <Settings className="h-5 w-5" />
                   </Link>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50 print:overflow-visible print:bg-white print:p-0">{children}</div>
            </main>

            {/* ========================================================== */}
            {/* GOOGLE LIVE SCREEN STYLE CHATBOT WIDGET                    */}
            {/* ========================================================== */}
            
            <div className={`fixed bottom-6 right-6 z-[100] flex flex-col items-end transition-all duration-500 print:hidden ${isChatOpen ? 'w-[360px]' : 'w-auto'}`}>
              
              {/* Chat Window Panel */}
              {isChatOpen && (
                <div className="relative w-full sm:w-[350px] bg-[#f4f6f8] rounded-2xl shadow-2xl border border-slate-200 flex flex-col mb-6 mr-4 animate-in slide-in-from-bottom-10 fade-in duration-300 h-[450px]">
                  
                  {/* Header */}
                  <div className="bg-[#6366f1] p-4 flex items-center justify-between text-white rounded-t-2xl shrink-0 shadow-sm z-10">
                    <div className="flex items-center gap-3">
                      <Bot className="h-6 w-6" />
                      <div>
                        <h3 className="font-bold text-sm leading-tight">Chatbot</h3>
                        <p className="text-[10px] text-indigo-200 font-medium">Always Listening</p>
                      </div>
                    </div>
                    <button onClick={toggleChatbot} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Scrollable Chat Area */}
                  <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar pb-16">
                    {chatHistory.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {/* We add 'notranslate' to ensure Google doesn't mess up the AI's native language output */}
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm notranslate shadow-sm border ${
                          msg.role === 'user' 
                            ? 'bg-indigo-50 border-indigo-100 text-indigo-900 rounded-br-sm' 
                            : 'bg-white border-slate-200 text-slate-800 rounded-bl-sm'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    
                    {/* Live Interim Typing Effect */}
                    {interimText && (
                      <div className="flex justify-end">
                        <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-br-sm italic opacity-70 notranslate shadow-sm">
                          {interimText}...
                        </div>
                      </div>
                    )}
                    
                    {/* Processing Indicator */}
                    {(micState === 'processing' || micState === 'speaking') && !interimText && (
                      <div className="flex justify-start">
                         <div className="w-fit rounded-2xl px-4 py-3.5 bg-white border border-slate-200 rounded-bl-sm shadow-sm flex items-center gap-1.5">
                            <div className="h-2 w-2 bg-[#8b5cf6] rounded-full animate-bounce"></div>
                            <div className="h-2 w-2 bg-[#8b5cf6] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                            <div className="h-2 w-2 bg-[#8b5cf6] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                         </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Status Text */}
                  <div className="absolute bottom-5 left-5 pointer-events-none">
                    <p className={`text-sm font-bold transition-colors ${micState === 'listening' ? 'text-indigo-600 animate-pulse' : 'text-slate-400'}`}>
                      {micState === 'listening' ? "Listening..." : micState === 'processing' ? "Thinking..." : micState === 'speaking' ? "Speaking..." : "Paused"}
                    </p>
                  </div>

                  {/* Floating Mic Button (Overlapping Bottom Right) */}
                  <button 
                    onClick={toggleMicManual}
                    className={`absolute -bottom-4 -right-4 h-16 w-16 rounded-full flex items-center justify-center transition-all shadow-xl z-50 ${
                      micState === 'listening' 
                        ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                        : 'bg-[#8b5cf6] hover:bg-purple-600 text-white hover:scale-105'
                    }`}
                  >
                    {micState === 'listening' ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                  </button>
                </div>
              )}

              {/* Floating Action Button (When Closed) */}
              {!isChatOpen && (
                <button 
                  onClick={toggleChatbot}
                  className="h-16 w-16 rounded-full bg-[#8b5cf6] text-white shadow-xl flex items-center justify-center hover:scale-105 transition-transform duration-300 group mr-4 mb-4"
                >
                  <Bot className="h-7 w-7 group-hover:animate-bounce" />
                </button>
              )}
              
            </div>

          </div>
        )}
      </body>
    </html>
  );
}