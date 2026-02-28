'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  UploadCloud, Activity, Scale, AlertTriangle, CheckCircle, 
  Stethoscope, Calculator, Waves, MessageSquare, Printer, 
  Save, FileText, CalendarClock, Loader2, CheckCircle2,
  Syringe, ShieldAlert, X, ArrowRight, ArrowLeft, Mic, MicOff, Bug, Camera
} from 'lucide-react';

// --- COMPREHENSIVE VETERINARY DISEASE DATABASE ---
const diseasesData = [
  { 
    id: "lsd", name: "Lumpy Skin Disease (LSD)", species: ["Cattle", "Buffalo"], basicId: "Viral (Family: Poxviridae) - Primary: Cattle", 
    localNames: { hi: "Lampi / गाँठदार त्वचा रोग", te: "Lumpy Skin Vyadhi / లంపీ స్కిన్ వ్యాధి", ta: "Lumpy Thol Noi / லும்பி தோல் நோய்", mr: "Lumpy / लंपी", kn: "Lumpy Roga / ಲಂಪಿ ರೋಗ" },
    etiology: "Large double-stranded DNA virus. Survives in dried scabs for 3–6 months. Heat sensitive above 55°C.", transmission: "Vectors: Mosquitoes, Stable flies, Ticks. Incubation: 4–14 days. Not zoonotic.", pathogenesis: "Virus attacks endothelial cells causing vasculitis, edema, and skin necrosis.", clinical: "Fever > 40°C, firm nodules (2–5 cm diameter), swollen legs (pitting edema), drop in milk.", diagnosis: "Field: Fever, Hard nodules, Leg swelling. Lab: PCR.", treatment: "No antiviral. Oxytetracycline (10 mg/kg IM). Meloxicam (0.5 mg/kg IM).", prevention: "Vaccine above 4 months age. Movement restriction.", govPrograms: "National LSD Vaccination Drive.", economic: "Milk drop: 30–50%; Hide damage.", publicHealth: "Not zoonotic.", locations: "North & West India (Rajasthan, Gujarat, Punjab, UP)", season: "Monsoon (July-Oct)", caseStudy: "Rajasthan. 40-cow farm. 28 infected. 3 deaths." 
  },
  { 
    id: "fmd", name: "Foot-and-Mouth Disease (FMD)", species: ["Cattle", "Buffalo", "Sheep", "Goat"], basicId: "Viral (Picornaviridae) - Primary: Cloven-hoofed", 
    localNames: { hi: "Khurpaka-Muhpaka / खुरपका-मुंहपका", te: "Gali Kuntu / గాలి కుంటు వ్యాధి", ta: "Komari Noi / கோமாரி நோய்", mr: "Lalya / लाळ्या", kn: "Kaalu baayi roga / ಕಾಲು ಬಾಯಿ ರೋಗ" },
    etiology: "Single-stranded RNA virus. Serotypes O, A, Asia-1. Survives in cool moist conditions.", transmission: "Aerosol (airborne). Direct contact. Incubation: 2–14 days.", pathogenesis: "Replicates in pharynx, causes vesicle formation and painful ulcers.", clinical: "Excess salivation (rope-like drool), smacking lips, blisters on tongue & hooves, lameness.", diagnosis: "Field: Sudden salivation, mouth blisters, lameness. Lab: PCR.", treatment: "Potassium permanganate mouth wash (1:1000). Copper sulfate footbath.", prevention: "Trivalent FMD vaccine. First dose: 4 months, Booster every 6 months.", govPrograms: "National Animal Disease Control Programme (NADCP).", economic: "Severe milk loss (50-80%).", publicHealth: "Rare zoonotic cases.", locations: "Nationwide Endemic (संपूर्ण भारत)", season: "Winter & Post-Monsoon", caseStudy: "Uttar Pradesh. 60 cow dairy. 25 affected. Milk drop 70%." 
  },
  { 
    id: "hs", name: "Hemorrhagic Septicemia (HS)", species: ["Buffalo", "Cattle"], basicId: "Bacterial (Septicemic) - Primary: Buffalo", 
    localNames: { hi: "Gal-Ghotu / गलघोटू", te: "Gontuka Vaapu / గొంతుక వాపు", ta: "Thondai adaappan / தொண்டை அடைப்பான்", mr: "Ghatsarp / घटसर्प", kn: "Gantu roga / ಗಂಟಲು ರೋಗ" },
    etiology: "Pasteurella multocida. Survives days in moist soil. Peak in Monsoon.", transmission: "Inhalation of infected droplets. Incubation: 6 hours – 3 days.", pathogenesis: "Rapid multiplication causes massive vascular damage and throat edema.", clinical: "Sudden high fever, severe throat swelling, brisket edema, grunting breathing sound. Death in 24-48 hrs.", diagnosis: "Field: Sudden monsoon outbreak, neck swelling.", treatment: "Immediate Oxytetracycline or Ceftiofur. Meloxicam.", prevention: "HS vaccine before monsoon.", govPrograms: "Mass vaccination drives.", economic: "Extremely high mortality if untreated.", publicHealth: "Avoid handling without gloves.", locations: "River basins & flooded plains (Assam, UP, Bihar, MP)", season: "Monsoon (July-Sept)", caseStudy: "Bihar. 30 buffalo herd. 12 died within 3 days." 
  },
  { 
    id: "ringworm", name: "Ringworm (Dermatophytosis)", species: ["Cattle", "Buffalo", "Goat", "Sheep", "Camel", "Horse"], basicId: "Fungal disease", 
    localNames: { hi: "Daad / दाद", te: "Tamara / తామర", ta: "Padai / படை", mr: "Gajkarna / गजकर्ण", kn: "Huzhu / ಹುಳು" },
    etiology: "Trichophyton spp. Survives in wood for 6–12 months.", transmission: "Direct skin contact. Zoonotic: Yes.", pathogenesis: "Spores invade keratin layer, creating characteristic ring shape.", clinical: "Circular grayish-white crust, hair falls off, dry scaly center.", diagnosis: "Field: Circular patches. Lab: Fungal culture.", treatment: "Enilconazole (0.2% spray). 2–5% Tincture iodine.", prevention: "Disinfect with 1% formalin.", govPrograms: "Farm biosecurity.", economic: "Hide rejection.", publicHealth: "Highly zoonotic. Farmers commonly infected.", locations: "Humid regions (Maharashtra, Karnataka, UP)", season: "Monsoon & Winter", caseStudy: "Maharashtra. 12 calves infected through shared brush." 
  },
  { 
    id: "mange", name: "Mange (Sarcoptic / Psoroptic)", species: ["Cattle", "Buffalo", "Goat", "Sheep", "Camel", "Horse"], basicId: "Parasitic - Burrowing Mites", 
    localNames: { hi: "Khujli / खुजली", te: "Gajjhi / గజ్జి", ta: "Sori / சொறி", mr: "Khaj / खाज", kn: "Kajji / ಕಜ್ಜಿ" },
    etiology: "Sarcoptes scabiei. Highly contagious.", transmission: "Direct contact. Zoonotic: Temporary itching.", pathogenesis: "Mite burrows into epidermis causing intense allergic reaction.", clinical: "Patchy hair loss, thick gray crusts, wrinkled bleeding skin, severe rubbing.", diagnosis: "Field: Severe itching, thick crusts. Lab: Skin scraping.", treatment: "Ivermectin (0.2 mg/kg SC). Amitraz spray.", prevention: "Isolate affected, disinfect sheds.", govPrograms: "Routine biosecurity.", economic: "Milk drop: 20–40%, Weight loss.", publicHealth: "Causes temporary itching in humans.", locations: "Dry and cold regions (Rajasthan, MP, UP)", season: "Winter (Nov-Feb)", caseStudy: "UP. 15 dairy cows. 9 developed mange." 
  },
  { 
    id: "papillomatosis", name: "Bovine Papillomatosis (Warts)", species: ["Cattle", "Buffalo"], basicId: "Viral (Bovine Papillomavirus)", 
    localNames: { hi: "Masse / मस्से", te: "Puli pirulu / పులిపిరులు", ta: "Maru / மரு", mr: "Mas / मस", kn: "Naru / ನರು" },
    etiology: "DNA virus. Highly resistant in environment.", transmission: "Direct skin contact, Milking equipment. Not zoonotic.", pathogenesis: "Uncontrolled benign tumor formation.", clinical: "Solid cauliflower-like growths protruding from skin on head, neck, teats.", diagnosis: "Field: Visible cauliflower growth.", treatment: "Autogenous Vaccine. Surgical removal.", prevention: "Disinfect equipment.", govPrograms: "None.", economic: "Milk drop (teat cases), hide damage.", publicHealth: "Not zoonotic.", locations: "Punjab, Haryana, UP", season: "Year-round", caseStudy: "Punjab. 8 cows developed teat papillomas." 
  },
  { 
    id: "ibr", name: "Infectious Bovine Rhinotracheitis (IBR)", species: ["Cattle"], basicId: "Viral (Bovine Herpesvirus-1)", 
    localNames: { hi: "Laal Naak (Red Nose) / लाल नाक", te: "Erra Mukku / ఎర్ర ముక్కు", ta: "Sivappu Mooku / சிவப்பு மூக்கு", mr: "Lal Naak / लाल नाक", kn: "Kempu Moogu / ಕೆಂಪು ಮೂಗು" },
    etiology: "Establishes lifelong latent infection.", transmission: "Aerosol, Semen. Not zoonotic.", pathogenesis: "Infects nasal mucosa, causes abortion.", clinical: "Red inflamed nostrils ('Red Nose'), yellow nasal discharge, late-term abortions.", diagnosis: "Field: Red nose, abortion storm. Lab: PCR.", treatment: "Oxytetracycline for secondary bacteria. Meloxicam.", prevention: "Vaccination at 4-6 months age.", govPrograms: "Mandatory semen testing.", economic: "Loss per abortion ₹15,000–₹40,000.", publicHealth: "Not zoonotic.", locations: "High-density dairy zones (Punjab, Gujarat)", season: "Winter & Transport", caseStudy: "Haryana. 8 abortions in 2 weeks." 
  },
  { 
    id: "brd", name: "Bovine Respiratory Disease (Pneumonia)", species: ["Cattle", "Buffalo"], basicId: "Multifactorial (Viral + Bacterial + Stress)", 
    localNames: { hi: "Nimoniya / निमोनिया", te: "Nimmuniya / నిమోనియా", ta: "Nuraiyeeral thotru / நுரையீரல் தொற்று", mr: "Pneumonia / न्यूमोनिया", kn: "Pneumonia / ನ್ಯುಮೋನಿಯಾ" },
    etiology: "Primary Viruses + Pasteurella + Transport stress.", transmission: "Aerosol droplets.", pathogenesis: "Stress weakens immunity, bacteria invade lungs causing consolidation.", clinical: "Thick yellow nasal discharge, drooping ears, rapid shallow breathing.", diagnosis: "Field: Nasal discharge + rapid breathing.", treatment: "Ceftiofur or Enrofloxacin. Meloxicam.", prevention: "BRD vaccines. Minimize transport stress.", govPrograms: "Biosecurity.", economic: "Major calf mortality.", publicHealth: "Not zoonotic.", locations: "Nationwide (संपूर्ण भारत)", season: "Winter & Monsoon", caseStudy: "Haryana. 15 calves developed pneumonia after transport." 
  },
  { 
    id: "rabies", name: "Rabies (Mad Dog Disease)", species: ["Cattle", "Buffalo", "Goat", "Sheep", "Camel", "Horse"], basicId: "Viral (Neurological)", 
    localNames: { hi: "Pagalpan / पागलपन (Halakwa)", te: "Pichi Kukka Kaatu / పిచ్చి కుక్క కాటు", ta: "Veri naai kadi / வெறிநாய் கடி", mr: "Pissalela / पिसाळलेला", kn: "Huchu Nayi Roga / ಹುಚ್ಚು ನಾಯಿ ರೋಗ" },
    etiology: "Rhabdoviridae.", transmission: "Bite from infected dog. Highly Zoonotic.", pathogenesis: "Travels along nerves to brain causing fatal encephalitis.", clinical: "Aggression, excessive bellowing, salivation, hind limb paralysis.", diagnosis: "Field: Dog bite history + neurological signs.", treatment: "100% fatal. Humanely euthanize.", prevention: "Raksharab vaccination.", govPrograms: "National Rabies Control Programme.", economic: "Death of animal.", publicHealth: "Fatal to humans.", locations: "Rural open-grazing areas", season: "Year-round", caseStudy: "UP. Cow bitten by stray dog. Workers received PEP." 
  },
  { 
    id: "brucellosis", name: "Brucellosis", species: ["Cattle", "Buffalo", "Goat", "Sheep"], basicId: "Bacterial (Reproductive)", 
    localNames: { hi: "Garbhpaat / संक्रामक गर्भपात", te: "Garbhasrava Vyadhi / గర్భస్రావ వ్యాధి", ta: "Karucchithaivu / கருச்சிதைவு", mr: "Garbhapaat / गर्भपात", kn: "Garbhapatha / ಗರ್ಭಪಾತ" },
    etiology: "Brucella abortus. Intracellular.", transmission: "Contact with aborted fetus. Highly Zoonotic.", pathogenesis: "Causes placentitis and fetal death.", clinical: "Abortion in last trimester, retained placenta, swollen testicles in bulls.", diagnosis: "Field: Abortion storm. Lab: RBT, PCR.", treatment: "Treatment NOT recommended. Cull or isolate.", prevention: "S19 vaccine for female calves.", govPrograms: "NADCP.", economic: "Abortion loss.", publicHealth: "Causes Undulant fever in humans.", locations: "Nationwide Dairy Herds", season: "Year-round", caseStudy: "Rajasthan. 6 abortions in 2 months." 
  },
  { 
    id: "blackquarter", name: "Black Quarter (BQ)", species: ["Cattle", "Buffalo"], basicId: "Bacterial (Clostridial)", 
    localNames: { hi: "Langda Bukhar / लंगड़ा बुखार", te: "Jabba Vaapu / జబ్బ వాపు", ta: "Chappai noi / சப்பை நோய்", mr: "Farya / फऱ्या", kn: "Chappey roga / ಚಪ್ಪೆ ರೋಗ" },
    etiology: "Clostridium chauvoei. Spores in soil.", transmission: "Ingestion of spores. Triggered by muscle injury.", pathogenesis: "Causes muscle necrosis, gas production, and toxemia.", clinical: "Sudden lameness. Hot, painful muscle swelling, crackling sound (crepitus).", diagnosis: "Field: Young animal, gas-filled swelling.", treatment: "High-Dose Penicillin.", prevention: "BQ Vaccine annually.", govPrograms: "Deep burial protocols.", economic: "Sudden loss of young animals.", publicHealth: "Not zoonotic.", locations: "Flood plains & Black cotton soil (MP, AP)", season: "Monsoon (July-Sept)", caseStudy: "MP. 3 young bulls died within 24 hrs." 
  },
  { 
    id: "milkfever", name: "Milk Fever (Hypocalcemia)", species: ["Cattle"], basicId: "Metabolic", 
    localNames: { hi: "Sutika Rog / मिल्क फीवर", te: "Paala Jvaram / పాల జ్వరం", ta: "Paal Kaaichal / பால் காய்ச்சல்", mr: "Milk Fever / दुधाचा ताप", kn: "Halu Jwara / ಹಾಲು ಜ್ವರ" },
    etiology: "Sudden drop in blood calcium at calving.", transmission: "Not infectious.", pathogenesis: "Nerve transmission impaired, causing paralysis.", clinical: "Recumbent cow, S-shaped neck bent to side, cold ears.", diagnosis: "Field: Recent calving, cold ears.", treatment: "Calcium Borogluconate IV.", prevention: "Oral Calcium at calving.", govPrograms: "Nutritional advisories.", economic: "Milk loss.", publicHealth: "Not zoonotic.", locations: "Intensive Dairy Zones (Punjab, Haryana)", season: "0-72 hrs post-calving", caseStudy: "Punjab. 3 Jersey cows recumbent. Recovered post IV." 
  },
  { 
    id: "ticks", name: "Tick Infestations", species: ["Cattle", "Buffalo", "Goat", "Sheep", "Camel", "Horse"], basicId: "Parasitic", 
    localNames: { hi: "Kilni / किल्ली (Chichadi)", te: "Pidu / పిడుదులు", ta: "Unni / உண்ணி", mr: "Gochid / गोचीड", kn: "Unne / ಉಣ್ಣೆ" },
    etiology: "Rhipicephalus microplus.", transmission: "Pasture grazing.", pathogenesis: "Sucks blood, transmits fevers.", clinical: "Visible ticks, pale gums (anemia).", diagnosis: "Field: Visual tick presence.", treatment: "Ivermectin or Deltamethrin Spray.", prevention: "Rotate grazing.", govPrograms: "Pest control.", economic: "Tick fever mortality.", publicHealth: "Transmits diseases.", locations: "Nationwide (संपूर्ण भारत)", season: "Monsoon & Post-monsoon", caseStudy: "AP. 6 developed Babesiosis." 
  },
  { 
    id: "worms", name: "Gastrointestinal Parasites (Worms)", species: ["Goat", "Sheep", "Camel"], basicId: "Parasitic (Nematodes)", 
    localNames: { hi: "Pet ke Kide / पेट के कीड़े", te: "Kadupu Purugulu / కడుపు పురుగులు", ta: "Kudal puzhukkal / குடல் புழுக்கள்", mr: "Potatil Kide / पोटातील किडे", kn: "Hotte Hulu / ಹೊಟ್ಟೆ ಹುಳು" },
    etiology: "Haemonchus contortus.", transmission: "Grazing.", pathogenesis: "Sucks blood from stomach.", clinical: "Pale eyelids (anemia), Bottle jaw, sudden death.", diagnosis: "Field: Bottle jaw. Lab: FEC.", treatment: "Albendazole or Ivermectin.", prevention: "FAMACHA deworming.", govPrograms: "Deworming advisory.", economic: "Kid mortality.", publicHealth: "Hygiene required.", locations: "Humid grazing zones", season: "Monsoon", caseStudy: "Telangana. 40 kids severely anemic." 
  },
  { 
    id: "goatpox", name: "Goat Pox / Sheep Pox", species: ["Goat", "Sheep"], basicId: "Viral (Poxviridae)", 
    localNames: { hi: "Bakri Mata / बकरी चेचक", te: "Meka Ammavaru / మేక అమ్మవారు", ta: "Vellaadu Ammai / வெள்ளாடு அம்மை", mr: "Devi / देवी", kn: "Meke Sidu / ಮೇಕೆ ಸಿಡುಬು" },
    etiology: "DNA virus.", transmission: "Aerosol droplets.", pathogenesis: "Targets skin forming nodules.", clinical: "Red spots, raised firm nodules on muzzle, ears, underbelly. High kid mortality.", diagnosis: "Field: Nodular skin lesions.", treatment: "Oxytetracycline for secondary infection.", prevention: "Live Vaccine.", govPrograms: "Vaccination campaigns.", economic: "Kid mortality.", publicHealth: "Not zoonotic.", locations: "Arid & Semi-arid zones (Rajasthan, Gujarat)", season: "Winter & Post-Monsoon", caseStudy: "Rajasthan. 10 kid deaths." 
  },
  { 
    id: "ppr", name: "Peste des Petits Ruminants (PPR)", species: ["Goat", "Sheep"], basicId: "Viral (Morbillivirus)", 
    localNames: { hi: "Bakri Plague / बकरी प्लेग (Kata)", te: "PPR / Kata (కట వ్యాధి)", ta: "Aattu plague / ஆட்டு பிளேக்", mr: "PPR / बकरी प्लेग", kn: "PPR Roga / ಪಿಪಿಆರ್ ರೋಗ" },
    etiology: "Fragile RNA virus.", transmission: "Aerosol.", pathogenesis: "Immunosuppression, severe pneumonia, enteritis.", clinical: "High fever, thick yellow nasal discharge, mouth ulcers, foul-smelling diarrhea.", diagnosis: "Field: Fever + mouth ulcers + diarrhea.", treatment: "Broad-Spectrum Antibiotics. IV fluids.", prevention: "PPR Vaccine.", govPrograms: "National PPR Control Programme.", economic: "Massive kid mortality.", publicHealth: "Not zoonotic.", locations: "Nationwide Goat Flocks", season: "Winter & Post-Monsoon", caseStudy: "UP. 35 kid deaths." 
  },
  { 
    id: "colic", name: "Equine Colic", species: ["Horse"], basicId: "Gastrointestinal emergency", 
    localNames: { hi: "Pet Dard / पेट दर्द", te: "Kadupu Noppi / కడుపు నొప్పి", ta: "Vayiru vali / வயிறு வலி", mr: "Pot Dukhne / पोटदुखी", kn: "Hotte Novu / ಹೊಟ್ಟೆ ನೋವು" },
    etiology: "Impaction, Gas, Torsion.", transmission: "Not contagious.", pathogenesis: "Gas accumulation, intestinal stretching.", clinical: "Pawing ground, looking at flank, violent rolling, sweating profusely.", diagnosis: "Field: Heart rate, gut sounds.", treatment: "Flunixin. Buscopan. IV fluids.", prevention: "Avoid sudden diet change.", govPrograms: "Emergency care.", economic: "Leading cause of death.", publicHealth: "Not zoonotic.", locations: "Nationwide (संपूर्ण भारत)", season: "Summer dehydration", caseStudy: "Pune. Racehorse rolling & sweating." 
  }
];

export default function DiagnosePage() {
  const supabase = createClient();
  const reportRef = useRef<HTMLDivElement>(null);

  const [userName, setUserName] = useState("Veterinary User");
  const [farmName, setFarmName] = useState("Unregistered Facility");
  const [userRole, setUserRole] = useState("Farmer");
  const [userLocation, setUserLocation] = useState("India");

  const [activeTab, setActiveTab] = useState('assistant'); 
  const [image, setImage] = useState<File | null>(null); 
  const [audio, setAudio] = useState<File | null>(null);
  const [selectedSpecies, setSelectedSpecies] = useState('cow');

  const [girth, setGirth] = useState('');
  const [length, setLength] = useState('');
  const [manualWeight, setManualWeight] = useState<string | null>(null);

  const [biometricImages, setBiometricImages] = useState<File[]>([]);
  const [fullInfectionImage, setFullInfectionImage] = useState<File | null>(null);
  const [fullStep, setFullStep] = useState(1);

  const [symptomText, setSymptomText] = useState('');
  const textRef = useRef(symptomText); 
  
  const [nlpLoading, setNlpLoading] = useState(false);
  const [nlpResult, setNlpResult] = useState<any>(null);
  
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  // --- CAMERA CAPTURE STATES & REFS ---
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<'biometric' | 'infection' | 'skin' | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRefCamera = useRef<MediaStream | null>(null);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingToDb, setSavingToDb] = useState(false);
  const [dbSaveSuccess, setDbSaveSuccess] = useState(false);

  useEffect(() => {
    textRef.current = symptomText;
  }, [symptomText]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.full_name || "Veterinary User");
        setFarmName(user.user_metadata?.organization || "Unregistered Facility");
        setUserRole(user.user_metadata?.role || "Farmer");
        
        // --- REAL LOCATION FETCHING ---
        if (user.user_metadata?.location) {
          setUserLocation(user.user_metadata.location);
        }
      }
    };
    fetchUser();

    return () => {
      stopAudioVisualizer();
      if (recognitionRef.current) recognitionRef.current.stop();
      if (streamRefCamera.current) {
        streamRefCamera.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const hasReportData = results || nlpResult || manualWeight;

  useEffect(() => {
    if (hasReportData && reportRef.current) {
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
    }
  }, [hasReportData]);

  // --- Dynamic Location to Language Mapping Logic ---
  const getLocalizedName = (disease: any, locationStr: string) => {
    if (!disease.localNames) return disease.name;
    const loc = (locationStr || "").toLowerCase();
    
    let lang = "hi"; // Default to Hindi
    if (loc.includes("telangana") || loc.includes("andhra") || loc.includes("hyderabad")) lang = "te";
    else if (loc.includes("tamil nadu") || loc.includes("chennai")) lang = "ta";
    else if (loc.includes("karnataka") || loc.includes("bangalore") || loc.includes("bengaluru")) lang = "kn";
    else if (loc.includes("maharashtra") || loc.includes("mumbai") || loc.includes("pune")) lang = "mr";
    else if (loc.includes("kerala")) lang = "ml";
    
    return disease.localNames[lang] || disease.localNames.hi || disease.name;
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setResults(null); setError(null); setImage(null); setAudio(null);
    setManualWeight(null); setGirth(''); setLength(''); setNlpResult(null); setDbSaveSuccess(false);
    setBiometricImages([]); setFullInfectionImage(null); setFullStep(1); 
    
    if (isListening) {
       if (recognitionRef.current) recognitionRef.current.stop();
       stopAudioVisualizer();
       setIsListening(false);
    }
    if (isCameraOpen) {
       closeCamera();
    }
  };

  // --- ROBUST CAMERA LOGIC ---
  const openCamera = (target: 'biometric' | 'infection' | 'skin') => {
    setCameraTarget(target);
    setIsCameraOpen(true);
    // Stream initialization is handled by useEffect when modal opens
  };

  useEffect(() => {
    let stream: MediaStream | null = null;

    const initCamera = async () => {
      try {
        if (isCameraOpen) {
          // Use 'environment' for rear camera on mobile
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: { ideal: "environment" } } 
          });
          streamRefCamera.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.error("Camera Error:", err);
        setError("Could not access camera. Please check permissions.");
        setIsCameraOpen(false);
      }
    };

    if (isCameraOpen) {
      initCamera();
    }

    return () => {
      // Cleanup stream when modal closes
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen]);

  const closeCamera = () => {
    setIsCameraOpen(false);
    setCameraTarget(null);
    if (streamRefCamera.current) {
       streamRefCamera.current.getTracks().forEach(track => track.stop());
       streamRefCamera.current = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `capture_${Date.now()}.jpg`, { type: "image/jpeg" });
      
      if (cameraTarget === 'biometric') {
        if (biometricImages.length < 5) {
          setBiometricImages(prev => [...prev, file]);
          setError(null);
        } else {
          setError("Maximum 5 biometric images allowed.");
        }
      } else if (cameraTarget === 'infection') {
        setFullInfectionImage(file);
        setError(null);
      } else if (cameraTarget === 'skin') {
        setImage(file);
        setError(null);
      }
      closeCamera();
    }, "image/jpeg", 0.9);
  };

  // --- API / AUDIO ---
  const fetchWithTimeout = async (url: string, options: any, timeout = 30000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  };

  const getApiHost = () => {
    if (typeof window !== 'undefined') {
        const host = window.location.hostname;
        return host === 'localhost' ? '127.0.0.1' : host;
    }
    return '127.0.0.1';
  };

  const stopAudioVisualizer = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
       audioCtxRef.current.close().catch(console.error);
    }
    
    audioCtxRef.current = null;
    analyserRef.current = null;
    streamRef.current = null;

    const canvas = canvasRef.current;
    if (canvas) {
       const ctx = canvas.getContext('2d');
       ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const startAudioVisualizer = async () => {
    try {
        if (!navigator.mediaDevices) return;
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioCtxRef.current = audioCtx;
        
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;
        
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            if (!canvas || !ctx) return;
            const WIDTH = canvas.width;
            const HEIGHT = canvas.height;

            animationRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, WIDTH, HEIGHT);

            const usableLength = Math.floor(bufferLength / 1.5);
            const barWidth = (WIDTH / usableLength) - 3;
            let x = 0;

            for (let i = 0; i < usableLength; i++) {
                const value = dataArray[i] / 255.0; 
                let barHeight = value * HEIGHT;
                if (barHeight < 3) barHeight = 3; 

                const gradient = ctx.createLinearGradient(0, HEIGHT/2 - barHeight/2, 0, HEIGHT/2 + barHeight/2);
                gradient.addColorStop(0, '#c084fc');   
                gradient.addColorStop(0.5, '#7e22ce'); 
                gradient.addColorStop(1, '#c084fc');   

                ctx.fillStyle = gradient;
                
                const y = (HEIGHT - barHeight) / 2;
                const radius = Math.min(barWidth / 2, barHeight / 2);

                ctx.beginPath();
                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + barWidth - radius, y);
                ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
                ctx.lineTo(x + barWidth, y + barHeight - radius);
                ctx.quadraticCurveTo(x + barWidth, y + barHeight, x + barWidth - radius, y + barHeight);
                ctx.lineTo(x + radius, y + barHeight);
                ctx.quadraticCurveTo(x, y + barHeight, x, y + barHeight - radius);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
                ctx.closePath();
                ctx.fill();

                x += barWidth + 3;
            }
        };
        draw();
    } catch (err) {
        console.error("Audio visualizer error", err);
    }
  };

  const toggleMic = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isListening) {
      recognitionRef.current?.stop();
      stopAudioVisualizer();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Microphone access is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; 
    recognition.interimResults = true;
    
    // --- SMART ASSISTANT: STRICTLY ENGLISH ---
    recognition.lang = 'en-IN'; 

    let baselineText = textRef.current; 

    recognition.onstart = () => {
      setIsListening(true);
      startAudioVisualizer(); 
    };
    
    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (final) {
        baselineText += (baselineText ? " " : "") + final.trim();
      }

      setSymptomText((baselineText + " " + interim).trim());
    };

    recognition.onerror = (event: any) => {
      if (event.error !== 'no-speech') {
         console.error(event);
         setError("Microphone error: " + event.error);
         stopAudioVisualizer();
         setIsListening(false);
      }
    };

    recognition.onend = () => {
      stopAudioVisualizer();
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSymptomAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomText.trim()) return setError("Please describe the symptoms first.");

    setNlpLoading(true); setError(null); setNlpResult(null); setDbSaveSuccess(false);

    try {
      const response = await fetchWithTimeout(`http://${getApiHost()}:5000/analyze_symptoms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: symptomText }),
      }, 15000);

      if (!response.ok) throw new Error("Server Error: NLP Engine failed.");
      
      const resData = await response.json();
      if (resData.success) setNlpResult(resData.data);
      else throw new Error(resData.error);
    } catch (err: any) {
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setError("Network Error: Could not reach the AI server. Ensure Flask (app.py) is running.");
      } else {
        setError(err.name === 'AbortError' ? "Request timed out." : err.message);
      }
    } finally {
      setNlpLoading(false);
    }
  };

  const handleManualCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setManualWeight(null); setDbSaveSuccess(false);
    const g = parseFloat(girth), l = parseFloat(length);
    if (g > 0 && l > 0) {
      const weightVal = (Math.pow(g, 2) * l) / 10840;
      setManualWeight(weightVal.toFixed(2));
    } else {
      setError("Please enter valid numbers greater than 0.");
    }
  };

  const handleMultiBiometricUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (biometricImages.length + files.length > 5) {
      setError("You can only upload a maximum of 5 images for biometrics.");
      return;
    }
    setError(null);
    setBiometricImages((prev) => [...prev, ...files].slice(0, 5));
  };

  const removeBiometricImage = (index: number) => {
    setBiometricImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'full') {
        if (biometricImages.length === 0) return setError("Upload or capture at least one biometric image.");
        if (!fullInfectionImage) return setError("Please upload or capture an infection/dermal image.");
        if (!audio) return setError("Please upload an audio file.");
    } else if (activeTab === 'weight') {
        if (biometricImages.length === 0) return setError("Upload or capture at least one biometric image.");
    } else {
        if (activeTab === 'skin' && !image) return setError("Please upload or capture an image.");
        if (activeTab === 'audio' && !audio) return setError("Please upload an audio file.");
    }

    setLoading(true); setError(null); setResults(null); setDbSaveSuccess(false);

    const formData = new FormData();
    
    if (activeTab === 'full') {
        biometricImages.forEach((img) => formData.append('images', img));
        if (fullInfectionImage) formData.append('image', fullInfectionImage);
        if (audio) formData.append('audio', audio);
    } else if (activeTab === 'weight') {
        biometricImages.forEach((img) => formData.append('images', img));
    } else {
        if (image) formData.append('image', image);
        if (audio) formData.append('audio', audio);
    }

    try {
      const API_URL = `http://${getApiHost()}:5000/analyze`; 
      const response = await fetchWithTimeout(API_URL, { method: 'POST', body: formData }, 90000);

      if (!response.ok) {
         const errData = await response.json().catch(() => null);
         throw new Error(errData?.error || "Server returned a critical error status.");
      }
      
      const resData = await response.json();
      if (resData.success) {
        setResults({ ...resData.data, apiUrl: `http://${getApiHost()}:5000` });
        if (activeTab === 'full') setFullStep(1); 
      } else {
        throw new Error(resData.error || "API returned an error");
      }
    } catch (err: any) {
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
         setError("Network Error: Could not connect to backend. Please check if app.py is running on port 5000.");
      } else {
         setError(err.name === 'AbortError' ? "AI processing timed out. Models might be taking longer to compute." : err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const displayAiWeight = results?.vision?.weight_kg ? (parseFloat(results.vision.weight_kg) / 6).toFixed(2) : 'N/A';

  const handleSaveToDatabase = async () => {
    setSavingToDb(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated.");

      let dbData: any = { user_id: user.id };
      
      if (results) {
        dbData.species = results.vision?.species || selectedSpecies || 'Unknown';
        dbData.vision_disease = activeTab === 'weight' ? null : (results.vision?.disease || null);
        dbData.audio_status = results.audio?.status || null;
        dbData.weight_kg = displayAiWeight !== 'N/A' ? displayAiWeight : null;
        dbData.bcs_score = results.vision?.bcs_proxy ? String(results.vision.bcs_proxy) : null;
      } else if (nlpResult) {
        dbData.species = 'Unknown';
        dbData.vision_disease = nlpResult.top_category;
      } else if (manualWeight) {
        dbData.species = selectedSpecies || 'Unknown';
        dbData.weight_kg = manualWeight; 
      }
      
      const { error: dbError } = await supabase.from('scan_history').insert(dbData);
      if (dbError) throw dbError;
      setDbSaveSuccess(true);
    } catch (err: any) {
      setError("Database Error: " + err.message);
    } finally {
      setSavingToDb(false);
    }
  };

  const getAccurateBCS = () => {
    if (!results?.vision?.bcs_proxy || !results?.vision?.species) return null;
    const raw = parseFloat(results.vision.bcs_proxy);
    const sp = results.vision.species.toLowerCase();

    if (sp.includes('horse')) {
      let hScore = Math.max(1, Math.min(9, Math.round((raw / 5) * 9)));
      let desc = "Moderate (Ideal)";
      if (hScore <= 2) desc = "Very Thin / Emaciated";
      else if (hScore === 3) desc = "Thin";
      else if (hScore === 4) desc = "Moderately Thin";
      else if (hScore === 5) desc = "Moderate (Ideal)";
      else if (hScore === 6) desc = "Moderately Fleshy";
      else if (hScore === 7) desc = "Fleshy";
      else if (hScore >= 8) desc = "Fat / Obese";
      return { score: hScore.toString(), max: 9, desc, ideal: "4.0 - 5.0 (Henneke Scale)" };
    } 
    else if (sp.includes('camel')) {
      let cScore = Math.max(0, Math.min(5, Math.round(raw)));
      let desc = "Good / Ideal";
      if (cScore <= 1) desc = "Very Thin / Skeletal";
      else if (cScore === 2) desc = "Lean / Skinny";
      else if (cScore === 3) desc = "Good / Ideal Body Condition";
      else if (cScore === 4) desc = "Excellent / Fat";
      else if (cScore === 5) desc = "Obese / Overweight";
      return { score: cScore.toString(), max: 5, desc, ideal: "3.0 (Hump & Rib Assessment)" };
    } 
    else if (sp.includes('goat') || sp.includes('sheep')) {
      let gsScore = (Math.round(raw * 2) / 2).toFixed(1);
      let desc = "Average (Ideal)";
      if (raw <= 1.5) desc = "Emaciated";
      else if (raw <= 2.5) desc = "Thin";
      else if (raw <= 3.5) desc = "Average (Ideal)";
      else if (raw <= 4.5) desc = "Fat";
      else desc = "Obese";
      return { score: gsScore, max: 5, desc, ideal: "2.5 - 3.5 (Lumbar Palpation)" };
    } 
    else {
      let cScore = (Math.round(raw * 4) / 4).toFixed(2); 
      let desc = "Good Condition";
      if (raw < 2.75) desc = "Under-conditioned";
      else if (raw > 4.0) desc = "Over-conditioned";
      return { score: cScore, max: 5, desc, ideal: "2.5 - 3.5 (Elanco V/U Scale)" };
    }
  };

  const bcsData = getAccurateBCS();

  const getMatchedDisease = () => {
    if (activeTab === 'assistant' && nlpResult?.disease_id) {
        return diseasesData.find(d => d.id === nlpResult.disease_id);
    } 
    if (results?.vision?.disease && results.vision.disease !== 'Healthy' && activeTab !== 'weight') {
        const v = results.vision.disease.toLowerCase();
        if (v.includes('lumpy')) return diseasesData.find(d => d.id === 'lsd');
        if (v.includes('foot') || v.includes('fmd')) return diseasesData.find(d => d.id === 'fmd');
        if (v.includes('ringworm')) return diseasesData.find(d => d.id === 'ringworm');
        if (v.includes('mange')) return diseasesData.find(d => d.id === 'mange');
        if (v.includes('wart') || v.includes('papilloma')) return diseasesData.find(d => d.id === 'papillomatosis');
        if (v.includes('tick')) return diseasesData.find(d => d.id === 'ticks');
        if (v.includes('pox') && (selectedSpecies === 'buffalo' || selectedSpecies === 'cow')) return diseasesData.find(d => d.id === 'buffalopox');
        if (v.includes('pox') && selectedSpecies === 'camel') return diseasesData.find(d => d.id === 'camelpox');
        if (v.includes('pox')) return diseasesData.find(d => d.id === 'goatpox'); 
    }
    if (results?.audio?.status && results.audio.status.includes('Anomaly')) {
        if (selectedSpecies === 'cow' || selectedSpecies === 'buffalo') return diseasesData.find(d => d.id === 'brd');
        if (selectedSpecies === 'goat' || selectedSpecies === 'sheep') return diseasesData.find(d => d.id === 'ccpp');
        if (selectedSpecies === 'horse') return diseasesData.find(d => d.id === 'equine_flu');
        if (selectedSpecies === 'camel') return diseasesData.find(d => d.id === 'crdc');
    }
    return null;
  };

  const matchedDisease = getMatchedDisease();

  return (
    <div className="space-y-8 text-slate-800 animate-in fade-in duration-500 pb-16 max-w-6xl mx-auto">
       <div className="print:hidden space-y-8">
         <div className="border-b border-slate-200 pb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-vet-blue-900 flex items-center gap-4 tracking-tight">
              <Stethoscope className="h-10 w-10 text-vet-blue-600" /> AI Diagnostic Center
            </h1>
            <p className="text-slate-500 mt-2 text-base sm:text-lg">Select a specialized multimodal tool to begin health screening.</p>
         </div>

         <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-2 w-full">
            <button onClick={() => handleTabChange('assistant')} className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold transition-all text-sm sm:text-base border ${activeTab === 'assistant' ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-transparent text-slate-600 border-transparent hover:bg-slate-50'}`}>
              <MessageSquare className="h-5 w-5 shrink-0" /> Smart Assistant
            </button>
            <button onClick={() => handleTabChange('full')} className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold transition-all text-sm sm:text-base border ${activeTab === 'full' ? 'bg-vet-blue-600 text-white border-vet-blue-600 shadow-md' : 'bg-transparent text-slate-600 border-transparent hover:bg-slate-50'}`}>
              <Stethoscope className="h-5 w-5 shrink-0" /> Full Diagnose
            </button>
            <button onClick={() => handleTabChange('skin')} className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold transition-all text-sm sm:text-base border ${activeTab === 'skin' ? 'bg-vet-blue-600 text-white border-vet-blue-600 shadow-md' : 'bg-transparent text-slate-600 border-transparent hover:bg-slate-50'}`}>
              <Activity className="h-5 w-5 shrink-0" /> Skin Disease
            </button>
            <button onClick={() => handleTabChange('audio')} className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold transition-all text-sm sm:text-base border ${activeTab === 'audio' ? 'bg-vet-green-600 text-white border-vet-green-600 shadow-md' : 'bg-transparent text-slate-600 border-transparent hover:bg-slate-50'}`}>
              <Waves className="h-5 w-5 shrink-0" /> Respiratory
            </button>
            <button onClick={() => handleTabChange('weight')} className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold transition-all text-sm sm:text-base border ${activeTab === 'weight' ? 'bg-vet-blue-600 text-white border-vet-blue-600 shadow-md' : 'bg-transparent text-slate-600 border-transparent hover:bg-slate-50'}`}>
              <Scale className="h-5 w-5 shrink-0" /> Biometrics
            </button>
            <button onClick={() => handleTabChange('manual')} className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold transition-all text-sm sm:text-base border ${activeTab === 'manual' ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-transparent text-slate-600 border-transparent hover:bg-slate-50'}`}>
              <Calculator className="h-5 w-5 shrink-0" /> Weight Calculator
            </button>
         </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-10">
          
          {activeTab === 'assistant' && (
            <form onSubmit={handleSymptomAnalysis} className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-purple-50 p-8 rounded-3xl border border-purple-200 mb-6 text-center shadow-inner">
                  <MessageSquare className="h-14 w-14 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-extrabold text-purple-900 text-2xl">Describe the Symptoms</h3>
                  <p className="text-lg text-purple-700 mt-2 font-medium">Tell us what you're seeing in your animals.</p>
              </div>

              <div className="relative">
                <textarea 
                  rows={6} 
                  value={symptomText} 
                  onChange={(e) => setSymptomText(e.target.value)} 
                  placeholder="e.g., 'My cow is coughing loudly, has a high fever of 105F...'" 
                  className="w-full border border-slate-300 rounded-2xl p-6 pr-20 bg-slate-50 outline-none focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 transition-all resize-none text-lg shadow-sm pb-16" 
                />
                
                <canvas 
                   ref={canvasRef} 
                   width={400} 
                   height={60} 
                   className={`absolute bottom-6 left-6 w-[calc(100%-120px)] h-[40px] pointer-events-none transition-opacity duration-300 ${isListening ? 'opacity-100' : 'opacity-0'}`} 
                />

                <button 
                  type="button"
                  onClick={toggleMic}
                  title={isListening ? "Stop listening" : "Start speaking"}
                  className={`absolute bottom-5 right-5 p-4 rounded-2xl text-white shadow-lg transition-all flex items-center justify-center ${isListening ? 'bg-red-500 animate-pulse hover:bg-red-600' : 'bg-purple-600 hover:bg-purple-700 hover:scale-105'}`}
                >
                  {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </button>
              </div>

              {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl font-bold border border-red-200 flex items-center gap-3"><AlertTriangle className="h-6 w-6 shrink-0"/>{error}</div>}
              
              <button type="submit" disabled={nlpLoading} className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white font-bold h-16 rounded-2xl transition-all shadow-xl flex justify-center items-center gap-3 text-xl mt-4">
                  {nlpLoading ? <><Loader2 className="h-6 w-6 animate-spin"/> Analyzing Text...</> : "Analyze Symptoms"}
              </button>
            </form>
          )}

          {activeTab === 'manual' && (
            <form onSubmit={handleManualCalculate} className="space-y-8 max-w-2xl mx-auto">
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 mb-6 text-center shadow-inner">
                  <Calculator className="h-14 w-14 text-slate-600 mx-auto mb-4" />
                  <h3 className="font-extrabold text-slate-900 text-2xl">Weight Calculator</h3>
              </div>

              <div className="flex flex-col gap-2">
                  <label className="text-base font-bold text-slate-700">Animal Species</label>
                  <select value={selectedSpecies} onChange={(e)=>setSelectedSpecies(e.target.value)} className="block w-full h-14 px-5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white focus:border-slate-800 focus:ring-4 focus:ring-slate-800/10 transition-all text-lg font-medium shadow-sm capitalize cursor-pointer">
                      <option value="cow">Cow</option>
                      <option value="buffalo">Buffalo</option>
                      <option value="sheep">Sheep</option>
                      <option value="goat">Goat</option>
                      <option value="horse">Horse</option>
                      <option value="camel">Camel</option>
                  </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                      <label className="text-base font-bold text-slate-700">Heart Girth (cm)</label>
                      <input type="number" step="0.1" value={girth} onChange={(e)=>setGirth(e.target.value)} required placeholder="e.g. 150" className="block w-full h-14 px-5 bg-slate-50 border border-slate-300 rounded-xl" />
                  </div>
                  <div className="flex flex-col gap-2">
                      <label className="text-base font-bold text-slate-700">Body Length (cm)</label>
                      <input type="number" step="0.1" value={length} onChange={(e)=>setLength(e.target.value)} required placeholder="e.g. 135" className="block w-full h-14 px-5 bg-slate-50 border border-slate-300 rounded-xl" />
                  </div>
              </div>
              {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl font-bold border border-red-200 flex items-center gap-3"><AlertTriangle className="h-6 w-6 shrink-0"/>{error}</div>}
              <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold h-16 rounded-2xl transition-all shadow-xl">Calculate Weight</button>
            </form>
          )}
          
          {(activeTab === 'full' || activeTab === 'skin' || activeTab === 'audio' || activeTab === 'weight') && (
            <form onSubmit={handleAnalyze} className="space-y-8 max-w-5xl mx-auto">
              
              {/* --- 3-STEP WIZARD: FULL DIAGNOSE --- */}
              {activeTab === 'full' ? (
                <div className="max-w-3xl mx-auto min-h-[400px]">
                   
                   {/* STEP 1: BIOMETRICS */}
                   {fullStep === 1 && (
                     <div className="animate-in fade-in slide-in-from-left-4 duration-500 space-y-6">
                        <div className="flex justify-between items-end border-b border-slate-200 pb-4">
                          <div>
                            <h3 className="text-2xl font-extrabold text-vet-blue-900 flex items-center gap-2"><Scale className="h-6 w-6"/> Step 1: Biometrics Capture</h3>
                            <p className="text-slate-500 font-medium">Upload or capture up to 5 side-profile images.</p>
                          </div>
                          <span className="bg-vet-blue-100 text-vet-blue-800 px-4 py-1.5 rounded-full font-bold text-sm mb-1">{biometricImages.length} / 5</span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                          <div className="flex-1 border-4 border-dashed border-vet-blue-300 bg-vet-blue-50/50 rounded-3xl p-8 text-center hover:bg-vet-blue-50 cursor-pointer relative shadow-sm transition-colors">
                            <input type="file" multiple accept="image/*" onChange={handleMultiBiometricUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                            <UploadCloud className="h-10 w-10 text-vet-blue-600 mx-auto mb-3" />
                            <p className="font-bold text-lg text-vet-blue-900 pointer-events-none">Upload Files</p>
                          </div>
                          <div onClick={() => openCamera('biometric')} className="flex-1 border-4 border-dashed border-slate-300 bg-slate-50/50 rounded-3xl p-8 text-center hover:bg-slate-100 cursor-pointer shadow-sm transition-colors flex flex-col justify-center items-center">
                            <Camera className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                            <p className="font-bold text-lg text-slate-800">Use Camera</p>
                          </div>
                        </div>

                        {biometricImages.length > 0 && (
                          <div className="flex flex-wrap gap-4 justify-center">
                            {biometricImages.map((file, idx) => (
                               <div key={idx} className="relative h-28 w-28 rounded-xl overflow-hidden border-2 border-vet-blue-200 shadow-sm group">
                                  <img src={URL.createObjectURL(file)} alt="preview" className="h-full w-full object-cover" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button type="button" onClick={() => removeBiometricImage(idx)} className="bg-red-500 text-white rounded-full p-2 hover:scale-110 transition-transform"><X className="h-5 w-5"/></button>
                                  </div>
                               </div>
                            ))}
                          </div>
                        )}

                        {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl font-bold border border-red-200 flex items-center gap-3"><AlertTriangle className="h-6 w-6 shrink-0"/>{error}</div>}

                        <div className="pt-4">
                          <button type="button" onClick={() => { if(biometricImages.length === 0) setError("Please provide at least one image to proceed."); else { setError(null); setFullStep(2); } }} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold h-16 rounded-2xl flex justify-center items-center gap-3 text-xl shadow-lg transition-all">
                            Next Step: Dermal Infection <ArrowRight className="h-6 w-6" />
                          </button>
                        </div>
                     </div>
                   )}

                   {/* STEP 2: DERMAL INFECTION */}
                   {fullStep === 2 && (
                     <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                        <div className="flex justify-between items-end border-b border-slate-200 pb-4">
                          <div>
                            <h3 className="text-2xl font-extrabold text-orange-600 flex items-center gap-2"><Activity className="h-6 w-6"/> Step 2: Dermal Infection</h3>
                            <p className="text-slate-500 font-medium">Upload or capture 1 clear, close-up image of the affected skin or lesions.</p>
                          </div>
                          <button type="button" onClick={() => setFullStep(1)} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold mb-1 transition-colors px-3 py-1 bg-slate-100 rounded-lg hover:bg-slate-200">
                            <ArrowLeft className="h-4 w-4" /> Back
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                          <div className="flex-1 border-4 border-dashed border-orange-300 bg-orange-50/50 rounded-3xl p-8 text-center hover:bg-orange-50 cursor-pointer relative shadow-sm transition-colors">
                            <input type="file" accept="image/*" onChange={(e) => setFullInfectionImage(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                            <UploadCloud className="h-10 w-10 text-orange-600 mx-auto mb-3" />
                            <p className="font-bold text-lg text-orange-900 pointer-events-none">Upload File</p>
                          </div>
                          <div onClick={() => openCamera('infection')} className="flex-1 border-4 border-dashed border-slate-300 bg-slate-50/50 rounded-3xl p-8 text-center hover:bg-slate-100 cursor-pointer shadow-sm transition-colors flex flex-col justify-center items-center">
                            <Camera className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                            <p className="font-bold text-lg text-slate-800">Use Camera</p>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <p className={`text-base font-bold py-2 px-6 rounded-full inline-block border-2 ${fullInfectionImage ? 'bg-orange-100 text-orange-800 border-orange-200' : 'bg-white text-slate-500 border-slate-200'}`}>{fullInfectionImage ? "✅ " + fullInfectionImage.name : "No image selected"}</p>
                        </div>

                        {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl font-bold border border-red-200 flex items-center gap-3"><AlertTriangle className="h-6 w-6 shrink-0"/>{error}</div>}

                        <div className="pt-4">
                          <button type="button" onClick={() => { if(!fullInfectionImage) setError("Please provide an infection image to proceed."); else { setError(null); setFullStep(3); } }} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold h-16 rounded-2xl flex justify-center items-center gap-3 text-xl shadow-lg transition-all">
                            Next Step: Respiratory Audio <ArrowRight className="h-6 w-6" />
                          </button>
                        </div>
                     </div>
                   )}

                   {/* STEP 3: AUDIO */}
                   {fullStep === 3 && (
                     <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                        <div className="flex justify-between items-end border-b border-slate-200 pb-4">
                          <div>
                            <h3 className="text-2xl font-extrabold text-vet-green-900 flex items-center gap-2"><Waves className="h-6 w-6"/> Step 3: Respiratory Audio</h3>
                            <p className="text-slate-500 font-medium">Upload audio for cough and lung anomaly detection.</p>
                          </div>
                          <button type="button" onClick={() => setFullStep(2)} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold mb-1 transition-colors px-3 py-1 bg-slate-100 rounded-lg hover:bg-slate-200">
                            <ArrowLeft className="h-4 w-4" /> Back
                          </button>
                        </div>

                        <div className="border-4 border-dashed border-vet-green-300 bg-vet-green-50/50 rounded-3xl p-10 sm:p-14 text-center hover:bg-vet-green-50 cursor-pointer relative shadow-sm transition-colors">
                          <input type="file" accept="audio/*" onChange={(e) => setAudio(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                          <Waves className="h-14 w-14 text-vet-green-600 mx-auto mb-4" />
                          <p className="font-extrabold text-2xl text-vet-green-900">Upload Audio</p>
                          <p className={`text-base font-bold mt-4 py-2 px-6 rounded-full inline-block pointer-events-none border-2 ${audio ? 'bg-vet-green-100 text-vet-green-800 border-vet-green-200' : 'bg-white text-slate-500 border-slate-200'}`}>{audio ? "✅ " + audio.name : "Tap to Select"}</p>
                        </div>

                        {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl font-bold border border-red-200 flex items-center gap-3"><AlertTriangle className="h-6 w-6 shrink-0"/>{error}</div>}

                        <div className="pt-4 flex gap-4">
                           <button type="button" onClick={() => setFullStep(2)} className="flex-1 bg-white border-2 border-slate-200 text-slate-700 font-bold h-16 rounded-2xl hover:bg-slate-50 transition-colors">Back</button>
                           <button type="submit" disabled={loading} className="flex-[2] bg-vet-blue-600 hover:bg-vet-blue-700 disabled:bg-slate-400 text-white font-bold h-16 rounded-2xl shadow-xl flex justify-center items-center gap-3 text-xl transition-all">
                             {loading ? <><Loader2 className="h-6 w-6 animate-spin"/> Processing Full AI Scan...</> : "Start Full AI Analysis"}
                           </button>
                        </div>
                     </div>
                   )}
                </div>
              ) : (
                <div className="grid grid-cols-1 max-w-2xl mx-auto gap-8">
                  {activeTab === 'audio' && (
                      <div className="flex flex-col gap-2 mb-2">
                          <label className="text-base font-bold text-slate-700">Animal Species</label>
                          <select value={selectedSpecies} onChange={(e)=>setSelectedSpecies(e.target.value)} className="block w-full h-14 px-5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white focus:border-vet-green-600 focus:ring-4 focus:ring-vet-green-600/10 transition-all text-lg font-medium shadow-sm capitalize cursor-pointer">
                              <option value="cow">Cow</option>
                              <option value="buffalo">Buffalo</option>
                              <option value="sheep">Sheep</option>
                              <option value="goat">Goat</option>
                              <option value="horse">Horse</option>
                              <option value="camel">Camel</option>
                          </select>
                      </div>
                  )}

                  {activeTab === 'weight' && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="flex justify-between items-end border-b border-slate-200 pb-4 mb-6">
                        <div>
                          <h3 className="text-xl font-extrabold text-vet-blue-900 flex items-center gap-2"><Scale className="h-5 w-5"/> Biometrics Capture</h3>
                          <p className="text-slate-500 font-medium text-sm">Upload or capture up to 5 side-profile images.</p>
                        </div>
                        <span className="bg-vet-blue-100 text-vet-blue-800 px-3 py-1 rounded-full font-bold text-xs mb-1">{biometricImages.length} / 5</span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <div className="flex-1 border-4 border-dashed border-vet-blue-300 bg-vet-blue-50/50 rounded-3xl p-8 text-center hover:bg-vet-blue-50 cursor-pointer relative shadow-sm transition-colors">
                          <input type="file" multiple accept="image/*" onChange={handleMultiBiometricUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                          <UploadCloud className="h-10 w-10 text-vet-blue-600 mx-auto mb-3" />
                          <p className="font-bold text-lg text-vet-blue-900 pointer-events-none">Upload Files</p>
                        </div>
                        <div onClick={() => openCamera('biometric')} className="flex-1 border-4 border-dashed border-slate-300 bg-slate-50/50 rounded-3xl p-8 text-center hover:bg-slate-100 cursor-pointer shadow-sm transition-colors flex flex-col justify-center items-center">
                          <Camera className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                          <p className="font-bold text-lg text-slate-800">Use Camera</p>
                        </div>
                      </div>

                      {biometricImages.length > 0 && (
                        <div className="flex flex-wrap gap-4 justify-center mt-6">
                          {biometricImages.map((file, idx) => (
                             <div key={idx} className="relative h-24 w-24 rounded-xl overflow-hidden border-2 border-vet-blue-200 shadow-sm group">
                                <img src={URL.createObjectURL(file)} alt="preview" className="h-full w-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button type="button" onClick={() => removeBiometricImage(idx)} className="bg-red-500 text-white rounded-full p-1.5 hover:scale-110 transition-transform"><X className="h-4 w-4"/></button>
                                </div>
                             </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'skin' && (
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                      <div className="flex-1 border-4 border-dashed border-vet-blue-300 bg-vet-blue-50/50 rounded-3xl p-8 text-center hover:bg-vet-blue-50 cursor-pointer relative shadow-sm transition-colors">
                        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="bg-white p-4 rounded-full inline-block mb-4 shadow-sm"><UploadCloud className="h-10 w-10 text-vet-blue-600" /></div>
                        <label className="block text-vet-blue-900 font-extrabold text-xl mb-1 pointer-events-none">Upload Image</label>
                        <p className={`text-sm font-bold mt-2 py-2 px-4 rounded-full inline-block pointer-events-none border-2 ${image ? 'bg-vet-green-100 text-vet-green-800 border-vet-green-200' : 'bg-white text-slate-500 border-slate-200 shadow-sm'}`}>
                          {image ? image.name : "Select File"}
                        </p>
                      </div>
                      
                      <div onClick={() => openCamera('skin')} className="flex-1 border-4 border-dashed border-slate-300 bg-slate-50/50 rounded-3xl p-8 text-center hover:bg-slate-100 cursor-pointer shadow-sm transition-colors flex flex-col justify-center items-center">
                        <div className="bg-white p-4 rounded-full inline-block mb-4 shadow-sm"><Camera className="h-10 w-10 text-slate-600" /></div>
                        <p className="font-extrabold text-xl text-slate-800 mb-1">Use Camera</p>
                        <p className="text-sm font-bold text-slate-500 mt-2 py-2 px-4 rounded-full bg-white border-2 border-slate-200 shadow-sm">Take a Photo</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'audio' && (
                    <div className="border-4 border-dashed border-vet-green-300 bg-vet-green-50/50 rounded-3xl p-10 sm:p-12 text-center hover:bg-vet-green-50 cursor-pointer relative shadow-sm transition-colors">
                      <input type="file" accept="audio/*" onChange={(e) => setAudio(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="bg-white p-5 rounded-full inline-block mb-6 shadow-sm"><Waves className="h-14 w-14 text-vet-green-600" /></div>
                      <label className="block text-vet-green-900 font-extrabold text-2xl mb-2 pointer-events-none">Upload Respiratory Audio</label>
                      <p className={`text-base font-bold mt-4 py-3 px-6 rounded-full inline-block pointer-events-none border-2 ${audio ? 'bg-vet-green-100 text-vet-green-800 border-vet-green-200' : 'bg-white text-slate-500 border-slate-200 shadow-sm'}`}>
                        {audio ? audio.name : "Tap or Drag & Drop"}
                      </p>
                    </div>
                  )}

                  {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl font-bold border border-red-200 flex items-center justify-center gap-3 max-w-2xl mx-auto"><AlertTriangle className="h-6 w-6 shrink-0"/>{error}</div>}

                  <button type="submit" disabled={loading} className={`w-full max-w-2xl mx-auto ${activeTab === 'audio' ? 'bg-vet-green-600 hover:bg-vet-green-700 shadow-vet-green-600/20' : 'bg-vet-blue-600 hover:bg-vet-blue-700 shadow-vet-blue-600/20'} disabled:bg-slate-300 text-white font-bold h-16 rounded-2xl transition-all shadow-xl flex justify-center items-center gap-3 text-xl`}>
                    {loading ? <><Loader2 className="h-6 w-6 animate-spin"/> Processing AI Pipeline...</> : "Start AI Analysis"}
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
       </div>

       {/* =========================================================
           CAMERA OVERLAY MODAL (UPDATED)
       ========================================================= */}
       {isCameraOpen && (
          <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-in fade-in duration-300">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover" 
            />
            
            <div className="absolute top-6 right-6 z-10">
              <button onClick={closeCamera} className="bg-white/20 p-3 rounded-full text-white hover:bg-white/40 transition-colors backdrop-blur-md">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10">
              <button 
                onClick={capturePhoto} 
                className="h-20 w-20 bg-transparent rounded-full border-4 border-slate-300 shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
              >
                <div className="h-16 w-16 bg-white border-2 border-slate-400 rounded-full"></div>
              </button>
            </div>
            
            <div className="absolute top-6 left-6 z-10">
               <span className="bg-black/50 text-white px-4 py-2 rounded-full font-bold backdrop-blur-md">
                 Capture {cameraTarget === 'biometric' ? 'Biometrics' : cameraTarget === 'infection' ? 'Infection' : 'Skin'} Image
               </span>
            </div>
          </div>
       )}

       {/* =========================================================
           UNIVERSAL PRINTABLE REPORT SECTION (ONE-PAGE OPTIMIZED)
       ========================================================= */}
       {hasReportData && (
        <div ref={reportRef} className="w-full animate-in fade-in slide-in-from-bottom-6 duration-700 print:m-0 print:p-2 print:text-black print:text-[10px] print:leading-snug print:w-full print:block print:overflow-visible">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-white p-5 rounded-2xl shadow-sm border border-slate-200 print:hidden">
             <div>
               <h3 className="font-extrabold text-slate-900 text-xl flex items-center gap-2"><CheckCircle2 className="h-7 w-7 text-vet-green-600" /> Result Generated Successfully</h3>
             </div>
             <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <button onClick={handleSaveToDatabase} disabled={savingToDb || dbSaveSuccess} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 h-14 rounded-xl font-bold text-lg transition-all shadow-sm ${dbSaveSuccess ? 'bg-vet-green-100 text-vet-green-800 border border-vet-green-200 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900 text-white'}`}>
                  {savingToDb ? <Loader2 className="h-6 w-6 animate-spin"/> : dbSaveSuccess ? <CheckCircle2 className="h-6 w-6"/> : <Save className="h-6 w-6" />} {dbSaveSuccess ? "Saved to History" : "Save to History"}
                </button>
                <button onClick={() => window.print()} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 h-14 bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold text-lg shadow-sm transition-all">
                  <Printer className="h-6 w-6" /> Print Report
                </button>
             </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden print:overflow-visible print:shadow-none print:border-0 print:w-full print:block">
            
            {/* PRINT HEADER */}
            <div className="bg-vet-blue-900 text-white p-8 sm:p-12 print:bg-transparent print:text-black print:border-b-2 print:border-black print:p-0 print:pb-2 print:mb-2">
               <div className="flex justify-between items-start">
                  <div className="flex items-center gap-5 print:gap-2">
                    <img src="/logo.png" alt="JeevRaksha Logo" className="hidden print:block h-12 w-12 object-contain" />
                    <div>
                      <h2 className="text-3xl sm:text-4xl font-extrabold flex items-center gap-3 tracking-tight uppercase print:text-lg">
                        <FileText className="h-10 w-10 text-vet-blue-400 print:hidden" /> 
                        Official Diagnostic Report
                      </h2>
                      <p className="text-vet-blue-200 mt-1.5 font-bold text-lg tracking-widest print:text-gray-600 print:text-[9px] print:mt-0">JEEVRAKSHA AI VETERINARY SYSTEM</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="bg-white/10 p-3 rounded-xl print:bg-transparent print:p-0 print:flex print:flex-col print:items-end">
                      <p className="hidden print:block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Generated On</p>
                      <p className="text-lg font-bold flex items-center justify-end gap-2 print:text-black print:text-xs">
                        <CalendarClock className="h-4 w-4 print:hidden" /> 
                        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
               </div>
               
               <div className="mt-8 grid grid-cols-2 gap-6 bg-white/5 p-6 rounded-2xl border border-white/10 print:border-none print:p-0 print:mt-2 print:text-black print:gap-2 print:flex print:justify-between">
                  <div>
                    <p className="text-xs font-bold text-vet-blue-300 uppercase tracking-wider print:text-gray-500 print:text-[8px]">Facility / Farm Location</p>
                    <p className="text-xl font-bold mt-1 print:text-black print:text-xs">{farmName}, {userLocation}</p>
                  </div>
                  <div className="print:text-right">
                    <p className="text-xs font-bold text-vet-blue-300 uppercase tracking-wider print:text-gray-500 print:text-[8px]">Authorized Personnel</p>
                    <p className="text-xl font-bold mt-1 print:text-black print:text-xs">{userName} <span className="text-base font-normal opacity-80 print:text-gray-600 print:text-[10px]">({userRole})</span></p>
                  </div>
               </div>
            </div>

            <div className="p-8 sm:p-12 space-y-10 print:p-0 print:space-y-3 print:mt-2">
              
              {/* UPLOADED ARTIFACTS ROW */}
              {(image || biometricImages.length > 0 || fullInfectionImage || audio) && activeTab !== 'assistant' && activeTab !== 'manual' && (
                <div className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl print:bg-transparent print:p-0 print:border-none print:mb-2">
                   <h4 className="font-extrabold text-slate-900 mb-4 uppercase tracking-widest text-sm border-b border-slate-200 pb-2 print:border-black print:mb-1 print:pb-0.5 print:text-[9px]">Provided Clinical Artifacts</h4>
                   <div className="flex flex-wrap gap-8 items-start print:gap-2 print:items-center">
                      {(image || biometricImages.length > 0 || fullInfectionImage) && (
                         <div className="print:flex print:items-center print:gap-2">
                           <p className="text-xs font-bold text-slate-500 mb-2 print:text-black print:mb-0 print:text-[8px]">Visual Files:</p>
                           <div className="flex flex-wrap gap-3 print:gap-1">
                             {activeTab === 'full' || activeTab === 'weight' ? (
                                <>
                                  {biometricImages.map((img, i) => (
                                    <img key={`bio-${i}`} src={URL.createObjectURL(img)} className="h-24 w-24 object-cover rounded-xl border border-slate-300 shadow-sm print:h-10 print:w-10 print:rounded-none print:shadow-none print:border-slate-500" />
                                  ))}
                                  {fullInfectionImage && (
                                    <img src={URL.createObjectURL(fullInfectionImage)} className="h-24 w-24 object-cover rounded-xl border-2 border-red-400 shadow-sm print:h-10 print:w-10 print:rounded-none print:shadow-none print:border-black" />
                                  )}
                                </>
                             ) : image ? (
                               <img src={URL.createObjectURL(image)} className="h-32 w-32 object-cover rounded-xl border border-slate-300 shadow-sm print:h-10 print:w-10 print:rounded-none print:shadow-none print:border-slate-500" />
                             ) : null}
                           </div>
                         </div>
                      )}
                      {audio && (
                         <div className="print:flex print:items-center print:gap-1 print:ml-auto">
                           <p className="text-xs font-bold text-slate-500 mb-2 print:text-black print:mb-0 print:text-[8px]">Acoustic File:</p>
                           <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl border border-slate-300 shadow-sm print:shadow-none print:border-none print:p-0">
                              <Waves className="h-5 w-5 text-vet-green-600 print:hidden" />
                              <span className="text-sm font-bold text-slate-700 print:text-black print:text-[9px]">{audio.name}</span>
                           </div>
                         </div>
                      )}
                   </div>
                </div>
              )}

              {/* DYNAMIC RESULTS LOGIC */}
              {(() => {
                 if (activeTab === 'manual') {
                     return (
                        <div className="space-y-6 print:break-inside-avoid print:space-y-2">
                           <h3 className="text-2xl font-extrabold text-slate-900 border-l-4 border-slate-800 pl-4 print:text-xs print:border-l-2 print:pl-2">Biometric Calculation</h3>
                           <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 print:bg-transparent print:border-none print:p-0">
                             <p className="font-bold text-xl mb-6 capitalize text-slate-900 print:text-[10px] print:mb-1">Species: {selectedSpecies}</p>
                             <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-slate-200 print:gap-2 print:mb-1 print:pb-1 print:border-black">
                                <div><p className="text-sm font-bold text-slate-500 uppercase mb-1 print:text-black print:text-[8px]">Measured Girth</p><p className="text-2xl font-bold print:text-xs">{girth} cm</p></div>
                                <div><p className="text-sm font-bold text-slate-500 uppercase mb-1 print:text-black print:text-[8px]">Measured Length</p><p className="text-2xl font-bold print:text-xs">{length} cm</p></div>
                             </div>
                             <div className="flex justify-between items-center print:justify-start print:gap-4">
                               <span className="text-slate-600 font-bold text-lg print:text-black print:text-[10px]">Calculated Weight</span>
                               <span className="font-extrabold text-3xl text-slate-900 print:text-sm">{manualWeight} kg</span>
                             </div>
                           </div>
                        </div>
                     )
                 }

                 if (activeTab === 'assistant' && nlpResult) {
                     return (
                        <div className="space-y-6 print:space-y-2">
                           <h3 className="text-2xl font-extrabold text-slate-900 border-l-4 border-purple-600 pl-4 print:border-slate-800 print:text-xs print:border-l-2 print:pl-2">NLP Symptom Analysis</h3>
                           <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 print:bg-transparent print:border-none print:p-0">
                             <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 print:text-slate-800 print:text-[8px] print:mb-0.5">Reported Clinical Signs</p>
                             <p className="text-lg font-medium text-slate-800 italic border-l-4 border-slate-300 pl-4 mb-8 print:text-[10px] print:mb-2 print:border-l-2 print:pl-2">"{symptomText}"</p>
                             <div className="flex justify-between items-center pt-6 border-t border-slate-200 print:border-black print:pt-1 print:justify-start print:gap-4">
                               <span className="text-slate-600 font-bold text-lg print:text-black print:text-[10px]">Predicted Disease</span>
                               <span className="font-extrabold text-2xl text-purple-700 bg-purple-100 px-4 py-1.5 rounded-lg print:border-none print:text-black print:bg-transparent print:p-0 print:text-xs">
                                 {getLocalizedName({name: nlpResult.top_category, localNames: diseasesData.find(d => d.id === nlpResult.disease_id)?.localNames}, userLocation)}
                               </span>
                             </div>
                           </div>
                        </div>
                     )
                 }

                 if (results) {
                     return (
                        <div className={`grid grid-cols-1 ${activeTab === 'full' ? 'lg:grid-cols-2' : ''} gap-10 print:grid print:grid-cols-2 print:gap-4`}>
                             
                             {/* VISUAL RESULTS */}
                             {(activeTab === 'full' || activeTab === 'skin' || activeTab === 'weight') && results.vision?.species && (
                               <div className="space-y-6 print:break-inside-avoid print:space-y-2">
                                  <h3 className="text-2xl font-extrabold text-slate-900 border-l-4 border-vet-blue-600 pl-4 print:border-slate-800 print:text-sm print:border-l-2 print:pl-2">Visual & Biometric Analysis</h3>
                                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 print:bg-transparent print:border-none print:p-0">
                                     <p className="font-bold text-xl mb-4 capitalize text-slate-900 print:text-[10px] print:mb-1">Species: {results.vision.species}</p>
                                     
                                     {(activeTab === 'full' || activeTab === 'skin') && (
                                       <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200 print:border-black print:mb-1 print:pb-1 print:justify-start print:gap-2">
                                         <span className="text-slate-600 font-bold print:text-black print:text-[9px]">Dermal Condition:</span>
                                         <span className={`font-extrabold px-4 py-1.5 rounded-lg print:p-0 print:border-none print:text-[9px] ${results.vision.disease === 'Healthy' ? 'bg-vet-green-100 text-vet-green-800 print:text-black' : 'bg-red-100 text-red-800 print:text-black'}`}>
                                           {results.vision.disease !== 'Healthy' && getMatchedDisease() 
                                             ? getLocalizedName(getMatchedDisease(), userLocation) 
                                             : results.vision.disease}
                                         </span>
                                       </div>
                                     )}
                                     
                                     {(activeTab === 'full' || activeTab === 'weight') && bcsData && (
                                       <>
                                         <div className="flex justify-between items-center pt-2 print:pt-0 print:justify-start print:gap-2">
                                           <span className="text-slate-600 font-bold print:text-black print:text-[9px]">Calculated Weight:</span>
                                           <span className="font-extrabold text-2xl print:text-black print:text-[10px]">{displayAiWeight} kg</span>
                                         </div>
                                         <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-200 print:border-none print:pt-1 print:mt-0 print:justify-start print:gap-2">
                                           <span className="text-slate-600 font-bold print:text-black print:text-[9px]">BCS Target Score:</span>
                                           <span className="font-extrabold text-xl print:text-black print:text-[10px]">{bcsData.score} / {bcsData.max} ({bcsData.desc})</span>
                                         </div>
                                         
                                         {/* Detailed BCS Clinical Appendix */}
                                         <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl print:mt-2 print:p-2 print:border-slate-300 print:bg-transparent print:break-inside-avoid">
                                           <p className="text-sm font-bold text-slate-800 print:text-black print:text-[9px]">Clinical BCS Context ({results.vision.species}):</p>
                                           <p className="text-xs text-slate-600 mt-1 print:text-black print:text-[8px] print:leading-tight">
                                             {results.vision.species.toLowerCase().includes('horse') ? "Scale 1-9 (Henneke). 1=Poor, 5=Moderate (Ideal), 9=Obese. Maintenance ideal is 4.0-5.0." :
                                              results.vision.species.toLowerCase().includes('camel') ? "Scale 0-5. 0=Skeletal, 3=Good/Ideal, 5=Obese. Assessed via hump fullness, ribs, and basin." :
                                              results.vision.species.toLowerCase().includes('goat') || results.vision.species.toLowerCase().includes('sheep') ? "Scale 1-5 (0.5 increments). 1=Emaciated, 3=Average (Ideal), 5=Obese. Optimal production score is 2.5-3.5." :
                                              "Scale 1-5 (Elanco System). 1=Emaciated, 3=Good, 5=Obese. Target 2.5-3.5 depending on lactation stage."}
                                           </p>
                                         </div>
                                       </>
                                     )}
                                  </div>
                                  
                                  {results.vision.measurement_img && (
                                    <div>
                                      <p className="text-base font-bold text-slate-500 mb-3 print:hidden">AI Measurement Layout Overlay</p>
                                      <img src={`${results.apiUrl}/${results.vision.measurement_img}`} alt="AI Layout Overlay" className="rounded-xl w-full border border-slate-200 print:border-slate-400 print:shadow-none shadow-sm print:max-h-[100px] print:w-auto print:object-contain print:bg-transparent"/>
                                    </div>
                                  )}
                               </div>
                             )}

                             {/* AUDIO RESULTS */}
                             {(activeTab === 'full' || activeTab === 'audio') && results.audio?.status && (
                               <div className="space-y-6 print:break-inside-avoid print:space-y-2">
                                  <h3 className="text-2xl font-extrabold text-slate-900 border-l-4 border-vet-green-600 pl-4 print:border-slate-800 print:text-sm print:border-l-2 print:pl-2">Acoustic Analysis</h3>
                                  
                                  {activeTab === 'audio' && (
                                     <p className="font-bold text-xl mb-4 capitalize text-slate-900 print:text-[10px] print:mb-1">Species: {selectedSpecies}</p>
                                  )}
                                  
                                  <div className="print:flex print:items-center print:gap-1">
                                    <div className={`p-6 rounded-2xl border-2 flex items-center gap-5 print:bg-transparent print:border-none print:p-0 print:gap-1 flex-1 ${results.audio.status === 'Healthy' ? 'bg-vet-green-50 border-vet-green-200' : 'bg-red-50 border-red-200'}`}>
                                      {results.audio.status === 'Healthy' ? <CheckCircle className="h-12 w-12 text-vet-green-600 flex-shrink-0 print:hidden" /> : <AlertTriangle className="h-12 w-12 text-red-600 flex-shrink-0 print:hidden" />}
                                      <div className="print:flex print:items-center print:gap-1">
                                        <p className="text-sm font-bold uppercase tracking-widest mb-1 print:text-slate-800 print:mb-0 print:text-[9px]">Status:</p>
                                        <h4 className={`font-extrabold text-3xl print:text-[10px] ${results.audio.status === 'Healthy' ? 'text-vet-green-800 print:text-black' : 'text-red-800 print:text-black'}`}>{results.audio.status}</h4>
                                      </div>
                                    </div>
                                    {results.audio.confidence && (
                                      <div className="mt-3 inline-block px-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm print:hidden">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Anomaly Confidence Score</p>
                                        <p className="text-xl font-extrabold text-slate-800">{results.audio.confidence}%</p>
                                      </div>
                                    )}
                                    {results.audio.confidence && (
                                      <span className="hidden print:inline-block ml-4 px-3 py-1 bg-white rounded-lg text-sm font-bold text-slate-600 border border-slate-200">
                                        Anomaly Score: {results.audio.confidence}%
                                      </span>
                                    )}
                                  </div>

                                  {results.audio.plots && (
                                    <div className="space-y-6 pt-2 print:space-y-0 print:pt-1 print:flex print:flex-row print:gap-2">
                                      {results.audio.plots.waveform && (
                                        <div className="print:flex-1">
                                          <p className="text-sm font-bold text-slate-500 mb-2 flex items-center gap-2 print:hidden"><Activity className="h-4 w-4"/> Audio Waveform</p>
                                          <img src={`${results.apiUrl}/${results.audio.plots.waveform}`} className="w-full rounded-xl border border-slate-200 print:border-slate-400 shadow-sm print:shadow-none print:h-16 print:w-auto print:object-contain" alt="Waveform" />
                                        </div>
                                      )}
                                      {results.audio.plots.mfcc && (
                                        <div className="print:flex-1">
                                          <p className="text-sm font-bold text-slate-500 mb-2 flex items-center gap-2 print:hidden"><Waves className="h-4 w-4"/> MFCC Spectrogram</p>
                                          <img src={`${results.apiUrl}/${results.audio.plots.mfcc}`} className="w-full rounded-xl border border-slate-200 print:border-slate-400 shadow-sm print:shadow-none print:h-16 print:w-auto print:object-contain" alt="MFCC Heatmap" />
                                        </div>
                                      )}
                                      {results.audio.plots.anomaly && (
                                        <div className="print:flex-1">
                                          <p className="text-sm font-bold text-slate-500 mb-2 flex items-center gap-2 print:hidden"><AlertTriangle className="h-4 w-4"/> Anomaly Score</p>
                                          <img src={`${results.apiUrl}/${results.audio.plots.anomaly}`} className="w-full rounded-xl border border-slate-200 print:border-slate-400 shadow-sm print:shadow-none print:h-16 print:w-auto print:object-contain" alt="Anomaly Plot" />
                                        </div>
                                      )}
                                    </div>
                                  )}
                               </div>
                             )}
                        </div>
                     )
                 }
                 return null;
              })()}

              {/* DYNAMIC CLINICAL APPENDICES FOR SICK ANIMALS */}
              {(() => {
                if (!matchedDisease) return null;

                return (
                  <div className="mt-12 border-t-4 border-red-600 pt-8 print:break-inside-avoid print:border-black print:mt-2 print:pt-2 print:border-t-2">
                    <div className="flex items-center gap-4 mb-6 print:mb-2 print:gap-2">
                      <ShieldAlert className="h-10 w-10 text-red-600 print:hidden" />
                      <div>
                        <h3 className="text-2xl font-extrabold text-slate-900 print:text-xs">
                          Official Clinical Context: {matchedDisease.name}
                        </h3>
                        <p className="text-lg font-bold text-vet-blue-700 mt-1 print:text-[10px]">
                          Local Name: {getLocalizedName(matchedDisease, userLocation)}
                        </p>
                        <p className="text-red-600 font-bold uppercase tracking-wider text-sm mt-1 print:text-black print:text-[8px] print:mt-0">Immediate Action Required • {matchedDisease.basicId}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2 print:gap-4">
                      <div className="bg-red-50 p-6 rounded-2xl border border-red-100 print:bg-transparent print:border-none print:p-0">
                        <h4 className="font-extrabold text-slate-900 text-lg mb-3 flex items-center gap-2 print:text-[10px] print:mb-1"><Bug className="h-5 w-5 text-red-600 print:hidden"/> Etiology & Transmission</h4>
                        <p className="text-slate-700 text-sm leading-relaxed mb-3 print:text-black print:text-[9px] print:mb-1 print:leading-tight"><strong className="text-slate-900 print:text-black">Agent: </strong>{matchedDisease.etiology}</p>
                        <div className="border-t border-red-200/50 my-2 print:hidden"></div>
                        <p className="text-slate-700 text-sm leading-relaxed print:text-black print:text-[9px] print:leading-tight"><strong className="text-slate-900 print:text-black">Spread: </strong>{matchedDisease.transmission}</p>
                        <div className="border-t border-red-200/50 my-2 print:hidden"></div>
                        <p className="text-slate-700 text-sm leading-relaxed print:text-black print:text-[9px] print:leading-tight"><strong className="text-slate-900 print:text-black">Endemic Areas: </strong>{matchedDisease.locations}</p>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 print:bg-transparent print:border-none print:p-0">
                        <h4 className="font-extrabold text-slate-900 text-lg mb-3 flex items-center gap-2 print:text-[10px] print:mb-1"><Syringe className="h-5 w-5 text-vet-blue-600 print:hidden"/> DAHD Treatment Protocol</h4>
                        <p className="text-slate-700 text-sm leading-relaxed mb-3 print:text-black print:text-[9px] print:mb-1 print:leading-tight">{matchedDisease.treatment}</p>
                        <div className="border-t border-slate-200/50 my-2 print:hidden"></div>
                        <p className="text-slate-700 text-sm leading-relaxed print:text-black print:text-[9px] print:leading-tight"><strong className="text-slate-900 print:text-black">Prevention: </strong>{matchedDisease.prevention}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
              
              <div className="mt-12 pt-8 border-t-2 border-slate-200 text-slate-500 text-sm font-medium leading-relaxed print:mt-2 print:border-black print:pt-1 print:text-black print:text-[8px] print:leading-tight">
                 <p className="mb-2 print:mb-0.5"><strong className="text-slate-700 print:text-black">System Disclaimer:</strong> This diagnostic report is generated autonomously by the JeevRaksha AI pipeline using neural networks and acoustic analysis.</p>
                 <p>While the system demonstrates high statistical accuracy, it operates as an assistive screening tool. <strong className="text-red-600 print:text-black">A definitive legal diagnosis must be executed exclusively under the supervision of a registered veterinary practitioner.</strong></p>
              </div>

              {/* OFFICIAL PRINT SIGNATURE FOOTER */}
              <div className="hidden print:flex justify-between items-end mt-10 pt-4 border-t-2 border-slate-800 print:break-inside-avoid print:mt-6 print:pt-2 print:border-black">
                 <div className="text-center">
                   <div className="w-32 border-b border-black mb-1"></div>
                   <p className="font-bold text-[8px] text-black uppercase tracking-widest">Authorized Signature</p>
                 </div>
                 <div className="text-center">
                   <div className="w-32 border-b border-black mb-1"></div>
                   <p className="font-bold text-[8px] text-black uppercase tracking-widest">Official Seal / Stamp</p>
                 </div>
              </div>

            </div>
          </div>
        </div>
       )}
    </div>
  );
}