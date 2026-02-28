'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from '@/utils/supabase/client';
import { 
  ClipboardList, Activity, Stethoscope, ArrowRight, 
  CalendarClock, AlertTriangle, CheckCircle, Loader2, 
  PieChart, MapPin, Calendar, ShieldAlert, 
  ThermometerSnowflake, Sun, CloudRain, Mic, Bot
} from "lucide-react";

interface ScanRecord {
  id: string;
  created_at: string;
  species: string;
  vision_disease: string;
  audio_status: string;
}

export default function HomeDashboard() {
  const [currentDate, setCurrentDate] = useState("");
  const [firstName, setFirstName] = useState("");
  const [userLocation, setUserLocation] = useState("India");
  
  // Database States
  const [loading, setLoading] = useState(true);
  const [recentScans, setRecentScans] = useState<ScanRecord[]>([]);
  const [totalScans, setTotalScans] = useState(0);
  const [healthyRate, setHealthyRate] = useState(0);

  useEffect(() => {
    const today = new Date();
    setCurrentDate(today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

    const fetchDashboardData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        if (user.user_metadata?.full_name) {
          setFirstName(user.user_metadata.full_name.split(' ')[0]);
        }
        if (user.user_metadata?.location) {
          setUserLocation(user.user_metadata.location);
        }

        const { data, error } = await supabase
          .from('scan_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setTotalScans(data.length);
          setRecentScans(data.slice(0, 3)); 

          if (data.length > 0) {
            let healthyCount = 0;
            data.forEach(scan => {
              const vHealthy = !scan.vision_disease || scan.vision_disease.toLowerCase().includes('healthy');
              const aHealthy = !scan.audio_status || scan.audio_status.toLowerCase().includes('healthy');
              if (vHealthy && aHealthy) healthyCount++;
            });
            setHealthyRate(Math.round((healthyCount / data.length) * 100));
          }
        }
      }
      setLoading(false);
    };
    
    fetchDashboardData();
  }, []);

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return date.toLocaleDateString();
  };

  // --- DYNAMIC SEASONAL LOGIC ---
  const date = new Date();
  const monthIndex = date.getMonth(); 
  const monthName = date.toLocaleString('default', { month: 'long' });
  
  let seasonName = "Winter";
  let SeasonIcon = ThermometerSnowflake;
  let seasonalDiseases = [];

  if (monthIndex >= 2 && monthIndex <= 5) { 
    seasonName = "Summer";
    SeasonIcon = Sun;
    seasonalDiseases = [
      { id: "colic", name: "Equine Colic", risk: "Severe", type: "Horse", reason: "Summer dehydration" },
      { id: "sweetitch", name: "Sweet Itch", risk: "High", type: "Horse", reason: "Summer midge breeding" },
      { id: "strangles", name: "Strangles", risk: "Moderate", type: "Horse", reason: "Early summer outbreaks" }
    ];
  } else if (monthIndex >= 6 && monthIndex <= 9) { 
    seasonName = "Monsoon";
    SeasonIcon = CloudRain;
    seasonalDiseases = [
      { id: "hs", name: "Hemorrhagic Septicemia", risk: "Severe", type: "Buffalo", reason: "Peak survival during Monsoon" },
      { id: "lsd", name: "Lumpy Skin Disease", risk: "Severe", type: "Cattle", reason: "Peak: July–October" },
      { id: "worms", name: "Gastrointestinal Worms", risk: "High", type: "Sheep/Goat", reason: "Monsoon humidity" },
      { id: "ticks", name: "Tick Infestations", risk: "High", type: "Multi", reason: "Warm humid climate" }
    ];
  } else { 
    seasonName = "Winter";
    SeasonIcon = ThermometerSnowflake;
    seasonalDiseases = [
      { id: "fmd", name: "Foot-and-Mouth (FMD)", risk: "High", type: "Cattle", reason: "Peak Seasons: Winter" },
      { id: "ppr", name: "PPR / Goat Plague", risk: "Severe", type: "Goat", reason: "Winter, Post-monsoon" },
      { id: "mange", name: "Sarcoptic Mange", risk: "High", type: "Camel/Cattle", reason: "Peak Season: Winter" },
      { id: "sheeppox", name: "Sheep Pox", risk: "High", type: "Sheep", reason: "Winter spreads" }
    ];
  }

  // --- DYNAMIC REGIONAL LOGIC ---
  const getRegionalDiseases = (loc: string) => {
    const l = loc.toLowerCase();
    
    if (l.includes('madhya pradesh') || l.includes('mp')) {
      return [
        { id: "hs", name: "Hemorrhagic Septicemia (HS)", reason: "High Risk State" },
        { id: "mange", name: "Sarcoptic Mange", reason: "High Risk State" },
        { id: "blackquarter", name: "Black Quarter (BQ)", reason: "Flood-prone areas, Black cotton soil" }
      ];
    } else if (l.includes('rajasthan')) {
      return [
        { id: "lsd", name: "Lumpy Skin Disease (LSD)", reason: "Major Affected State" },
        { id: "camelpox", name: "Camel Pox", reason: "Endemic to camel-rearing regions" },
        { id: "brucellosis", name: "Brucellosis", reason: "High Prevalence State" }
      ];
    } else if (l.includes('uttar pradesh') || l.includes('up')) {
      return [
        { id: "lsd", name: "Lumpy Skin Disease (LSD)", reason: "Major Affected State" },
        { id: "ppr", name: "PPR / Goat Plague", reason: "Widespread" },
        { id: "rabies", name: "Rabies", reason: "Widespread rural areas" }
      ];
    } else if (l.includes('punjab') || l.includes('haryana')) {
      return [
        { id: "ibr", name: "Infectious Bovine Rhinotracheitis", reason: "High Prevalence State" },
        { id: "btb", name: "Bovine Tuberculosis (bTB)", reason: "High Risk State" },
        { id: "papillomatosis", name: "Bovine Papillomatosis", reason: "High Prevalence State" }
      ];
    } else if (l.includes('maharashtra')) {
       return [
        { id: "ringworm", name: "Ringworm", reason: "High-Risk State" },
        { id: "buffalopox", name: "Buffalo Pox", reason: "Widespread in buffalo rearing states" },
        { id: "sarcoids", name: "Equine Sarcoids", reason: "Fly-infested environments" }
      ];
    } else if (l.includes('karnataka') || l.includes('telangana') || l.includes('andhra')) {
       return [
        { id: "bluetongue", name: "Bluetongue", reason: "Irrigated agricultural zones, river basins" },
        { id: "worms", name: "Gastrointestinal Parasites", reason: "Highly active in humid zones" },
        { id: "rainscald", name: "Rain Scald", reason: "Flood-prone areas" }
      ];
    }
    return [
      { id: "fmd", name: "Foot-and-Mouth Disease", reason: "Nationwide endemic risk" },
      { id: "ticks", name: "Tick Infestations", reason: "Widespread rural risk" },
      { id: "brd", name: "Bovine Respiratory Disease", reason: "Widespread (Endemic across India)" }
    ];
  };

  const regionalDiseases = getRegionalDiseases(userLocation);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-vet-blue-600 to-vet-green-600">{firstName || 'Farmer'}</span>!
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Here is your herd's daily health and diagnostic summary.</p>
        </div>
        <p className="text-sm font-bold text-slate-600 flex items-center gap-2 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm shrink-0">
          <CalendarClock className="h-5 w-5 text-vet-blue-600" /> 
          {currentDate || "Loading date..."}
        </p>
      </div>

      {/* --- NEW VOICE ASSISTANT INSTRUCTION BANNER --- */}
      <div className="bg-gradient-to-r from-purple-600 to-vet-blue-700 p-6 sm:p-8 rounded-3xl shadow-lg text-white flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <Bot className="absolute -left-6 -bottom-6 h-32 w-32 text-white/10" />
        <div className="relative z-10">
          <h2 className="text-2xl font-extrabold mb-1 flex items-center gap-3">
            <Mic className="h-7 w-7 text-purple-200" /> Voice Navigation is Active!
          </h2>
          <p className="text-purple-100 font-medium text-sm sm:text-base">
            Tap the floating purple AI button in the bottom right corner of your screen to navigate the app hands-free. Try saying: <strong className="text-white">"Open Diagnostics"</strong> or <strong className="text-white">"Show History"</strong>.
          </p>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-center relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -right-6 -top-6 bg-vet-blue-50 h-32 w-32 rounded-full blur-2xl group-hover:bg-vet-blue-100 transition-colors"></div>
          <div className="bg-vet-blue-100 p-3.5 rounded-2xl w-fit mb-4 relative z-10">
            <ClipboardList className="h-7 w-7 text-vet-blue-700" />
          </div>
          <div className="relative z-10">
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Total Scans Performed</p>
            <p className="text-5xl font-extrabold text-slate-900">
              {loading ? <Loader2 className="h-8 w-8 animate-spin text-slate-400 mt-2"/> : totalScans}
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-center relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -right-6 -top-6 bg-vet-green-50 h-32 w-32 rounded-full blur-2xl group-hover:bg-vet-green-100 transition-colors"></div>
          <div className="bg-vet-green-100 p-3.5 rounded-2xl w-fit mb-4 relative z-10">
            <Activity className="h-7 w-7 text-vet-green-700" />
          </div>
          <div className="relative z-10">
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Herd Health Status</p>
            <p className="text-5xl font-extrabold text-slate-900">
              {loading ? <Loader2 className="h-8 w-8 animate-spin text-slate-400 mt-2"/> : `${healthyRate}%`}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-vet-blue-700 to-[#1e3a8a] p-8 rounded-3xl shadow-xl text-white flex flex-col justify-between relative overflow-hidden hover:scale-[1.02] transition-transform">
           <Stethoscope className="absolute -right-4 -bottom-4 h-40 w-40 text-white/10 rotate-12" />
          <div className="relative z-10">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-sm">Quick Action</span>
            <h3 className="text-2xl font-extrabold mt-4 mb-2">Run Diagnostics</h3>
            <p className="text-vet-blue-100 text-sm font-medium leading-relaxed">Start a new multimodal AI scan to detect skin diseases or respiratory anomalies instantly.</p>
          </div>
          <Link href="/diagnose" className="mt-6 bg-white text-vet-blue-900 hover:bg-slate-50 h-12 rounded-xl text-sm font-extrabold transition-all shadow-lg flex items-center justify-center gap-2 z-10">
            Open AI Center <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* --- DYNAMIC RISK DASHBOARD (REGIONAL & SEASONAL COLUMNS) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Column 1: Regional Location Alerts */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <MapPin className="text-slate-100 absolute -right-8 -top-8 h-48 w-48 opacity-50 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-red-50 p-2.5 rounded-xl border border-red-100">
                <ShieldAlert className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">Regional Threat Radar</h3>
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-6 pl-1">
              Location: <span className="text-slate-800">{userLocation}</span>
            </p>

            <ul className="space-y-4">
              {regionalDiseases.map((disease, i) => (
                <Link href={`/guide?disease=${disease.id}`} key={i} className="block group">
                  <li className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-vet-blue-300 group-hover:bg-vet-blue-50/50 group-hover:shadow-md transition-all cursor-pointer">
                    <div className="mt-1 bg-white p-1.5 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-tight group-hover:text-vet-blue-700 transition-colors">{disease.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 font-medium">{disease.reason}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-vet-blue-500 transition-colors self-center" />
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        </div>

        {/* Column 2: Seasonal Pathogen Watch */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <SeasonIcon className="text-slate-100 absolute -right-6 -top-6 h-48 w-48 opacity-50 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-vet-blue-50 p-2.5 rounded-xl border border-vet-blue-100">
                <Calendar className="h-5 w-5 text-vet-blue-600" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">Seasonal Pathogen Watch</h3>
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-6 pl-1">
              Current Cycle: <span className="text-slate-800">{seasonName} ({monthName})</span>
            </p>

            <ul className="space-y-4">
              {seasonalDiseases.map((disease, i) => (
                <Link href={`/guide?disease=${disease.id}`} key={i} className="block group">
                  <li className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-vet-blue-300 group-hover:bg-vet-blue-50/50 group-hover:shadow-md transition-all cursor-pointer">
                    <div className="flex flex-col gap-1 pr-4">
                      <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-tight group-hover:text-vet-blue-700 transition-colors">{disease.name}</h4>
                      <span className="text-[11px] font-bold text-slate-500">{disease.reason}</span>
                    </div>
                    <span className={`shrink-0 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-lg border ${
                      disease.risk === 'Severe' ? 'bg-red-50 text-red-700 border-red-200' :
                      disease.risk === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                      {disease.risk}
                    </span>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Main Banner */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-vet-blue-500 via-purple-500 to-vet-green-500"></div>
        <div className="lg:flex-1 z-10 text-center lg:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">Maintain biosecurity protocols for your herd.</h2>
          <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
            JeevRaksha utilizes advanced neural networks to identify early signs of dermatological anomalies and respiratory pathogens. Early detection prevents widespread outbreaks.
          </p>
        </div>
        <Link href="/guide" className="z-10 bg-slate-100 hover:bg-slate-200 text-slate-800 px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center gap-3 whitespace-nowrap shrink-0">
          View Clinical Guide
        </Link>
      </div>

      {/* Recent Activity Section */}
      <div>
        <div className="flex items-center justify-between mb-5 px-2">
            <h2 className="text-2xl font-extrabold text-slate-900">Recent Diagnostic Activity</h2>
            <Link href="/history" className="text-vet-blue-600 font-bold hover:text-vet-blue-800 transition-colors flex items-center gap-1">
              View History <ArrowRight className="h-4 w-4"/>
            </Link>
        </div>
        
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-slate-300" /></div>
          ) : recentScans.length === 0 ? (
            <div className="p-12 text-center">
              <PieChart className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium text-lg">No scans performed yet.</p>
              <Link href="/diagnose" className="text-vet-blue-600 font-bold mt-2 inline-block">Start your first scan</Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentScans.map((scan) => {
                const isHealthy = (!scan.vision_disease || scan.vision_disease.toLowerCase().includes('healthy')) && 
                                  (!scan.audio_status || scan.audio_status.toLowerCase().includes('healthy'));
                
                const finding = scan.vision_disease && !scan.vision_disease.toLowerCase().includes('healthy') 
                  ? scan.vision_disease 
                  : scan.audio_status && !scan.audio_status.toLowerCase().includes('healthy')
                  ? scan.audio_status
                  : "Healthy / Normal";

                return (
                  <div key={scan.id} className="p-6 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50/80 transition-colors group">
                    <div className="flex items-center gap-5">
                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border ${isHealthy ? 'bg-vet-green-50 border-vet-green-100 text-vet-green-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
                            {isHealthy ? <CheckCircle className="h-7 w-7" /> : <AlertTriangle className="h-7 w-7" />}
                        </div>
                        <div>
                            <p className="font-extrabold text-slate-900 text-lg sm:text-xl capitalize flex items-center gap-2">
                                {scan.species} 
                                <span className="text-slate-300 font-normal">|</span> 
                                <span className={isHealthy ? 'text-vet-green-600' : 'text-red-600'}>{finding}</span>
                            </p>
                            <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                                <CalendarClock className="h-4 w-4" /> {timeAgo(scan.created_at)}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <span className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-widest border ${isHealthy ? 'bg-vet-green-50 text-vet-green-700 border-vet-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {isHealthy ? 'Clear' : 'Action Required'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}