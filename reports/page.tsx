'use client';

import React, { useState, useEffect, useMemo } from "react";
import { createClient } from '@/utils/supabase/client';
import Link from "next/link";
import { 
  BarChart3, TrendingUp, Activity, ShieldAlert, 
  CheckCircle2, AlertTriangle, ChevronRight, Loader2,
  Stethoscope, Syringe, PieChart as PieChartIcon, Printer, Download, CalendarDays, PawPrint
} from "lucide-react";

// Import Recharts for highly interactive data visualization
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, CartesianGrid
} from 'recharts';

interface ScanRecord {
  id: string;
  created_at: string;
  species: string | null;
  vision_disease: string | null;
  audio_status: string | null;
}

const CHART_COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#64748b'];

export default function ReportsPage() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<"24h" | "7d" | "30d" | "all">("all");

  // User Data for Print Report
  const [userName, setUserName] = useState("Veterinary User");
  const [farmName, setFarmName] = useState("Unregistered Facility");
  
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setUserName(user.user_metadata?.full_name || "Veterinary User");
        setFarmName(user.user_metadata?.organization || "Unregistered Facility");

        const { data, error } = await supabase
          .from('scan_history')
          .select('id, created_at, species, vision_disease, audio_status')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setScans(data || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- DYNAMIC DATA AGGREGATION & GRAPH ENGINES ---
  const { 
    filteredScans, totalScans, healthyRate, criticalAlerts, 
    diseaseStats, speciesStats, trendData 
  } = useMemo(() => {
    
    // 1. Apply Time Filter
    const now = new Date().getTime();
    const filtered = scans.filter(scan => {
      if (timeFilter === "all") return true;
      const scanTime = new Date(scan.created_at).getTime();
      const diffHours = (now - scanTime) / (1000 * 3600);
      const diffDays = diffHours / 24;
      
      if (timeFilter === "24h") return diffHours <= 24;
      if (timeFilter === "7d") return diffDays <= 7;
      if (timeFilter === "30d") return diffDays <= 30;
      return true;
    });

    const total = filtered.length;
    let healthyCount = 0;
    let alertCount = 0;
    
    const diseaseMap: Record<string, number> = {};
    const speciesMap: Record<string, number> = {};
    const trendMap: Record<string, number> = {};

    // 2. Process Data
    filtered.forEach(scan => {
      // Timeline Aggregation for Interactive Bar Chart
      const d = new Date(scan.created_at);
      let timeLabel = '';
      if (timeFilter === '24h') {
        timeLabel = d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
      } else {
        timeLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      trendMap[timeLabel] = (trendMap[timeLabel] || 0) + 1;

      // Species & Disease Aggregation
      const vision = (scan.vision_disease || '').toLowerCase();
      const audio = (scan.audio_status || '').toLowerCase();
      
      const species = scan.species || 'Unknown';
      speciesMap[species] = (speciesMap[species] || 0) + 1;

      const isVisionHealthy = vision.includes('healthy') || vision.includes('normal') || vision === '';
      const isAudioHealthy = audio.includes('healthy') || audio.includes('normal') || audio.includes('clear') || audio === '';
      
      if (isVisionHealthy && isAudioHealthy) {
        healthyCount++;
      } else {
        alertCount++;
        if (!isVisionHealthy && scan.vision_disease) {
          diseaseMap[scan.vision_disease] = (diseaseMap[scan.vision_disease] || 0) + 1;
        }
      }
    });

    const rate = total === 0 ? 0 : Math.round((healthyCount / total) * 100);

    const formattedDiseases = Object.keys(diseaseMap).map(key => ({
      name: key,
      count: diseaseMap[key],
      percent: Math.round((diseaseMap[key] / alertCount) * 100)
    })).sort((a, b) => b.count - a.count).slice(0, 5);

    const formattedSpecies = Object.keys(speciesMap).map(key => ({
      name: key,
      value: speciesMap[key], // Recharts Pie uses 'value' property
      percent: Math.round((speciesMap[key] / total) * 100)
    })).sort((a, b) => b.value - a.value);

    // Format Trend Data (Reverse to show chronological order left-to-right)
    const formattedTrends = Object.keys(trendMap).map(label => ({
      label,
      scans: trendMap[label]
    })).reverse().slice(-14); 

    return {
      filteredScans: filtered,
      totalScans: total,
      healthyRate: rate,
      criticalAlerts: alertCount,
      diseaseStats: formattedDiseases,
      speciesStats: formattedSpecies,
      trendData: formattedTrends
    };
  }, [scans, timeFilter]);

  // --- CSV EXPORT ENGINE ---
  const exportToCSV = () => {
    let csvContent = "JeevRaksha AI Analytics Report\n\n";
    csvContent += `Timeframe:,${timeFilter === 'all' ? 'All Time' : timeFilter === '30d' ? 'Last 30 Days' : timeFilter === '7d' ? 'Last 7 Days' : 'Last 24 Hours'}\n`;
    csvContent += `Total Scans:,${totalScans}\n`;
    csvContent += `Healthy Rate:,${healthyRate}%\n`;
    csvContent += `Critical Alerts:,${criticalAlerts}\n\n`;

    csvContent += "--- Top Detected Anomalies ---\nDisease,Cases,Percentage\n";
    diseaseStats.forEach(d => csvContent += `"${d.name}",${d.count},${d.percent}%\n`);

    csvContent += "\n--- Species Distribution ---\nSpecies,Scans\n";
    speciesStats.forEach(s => csvContent += `"${s.name}",${s.value}\n`);

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `JeevRaksha_Analytics_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-slate-500 font-medium text-lg">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-vet-blue-600" /> 
          <p>Analyzing farm data...</p>
        </div>
      </div>
    );
  }

  // Custom Tooltip for Interactive Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-xl border border-slate-700">
          <p className="mb-1 text-slate-300">{label || payload[0].name}</p>
          <p className="text-sm">{`${payload[0].value} Scans`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16 print:p-0 print:m-0 print:space-y-0">
      
      {/* =========================================================
          WEB UI SECTION (HIDDEN ON PRINT)
      ========================================================= */}
      <div className="print:hidden space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-vet-blue-900 flex items-center gap-3 tracking-tight">
              <BarChart3 className="h-8 w-8 text-vet-blue-600" /> Analytics & Reports
            </h1>
            <p className="text-slate-500 mt-2 text-base">Comprehensive AI insights and herd health metrics.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 shrink-0">
             {/* Time Filter Toggle */}
             <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 mr-2 h-12">
               {[{id: '24h', label: '24 Hours'}, {id: '7d', label: '7 Days'}, {id: '30d', label: '30 Days'}, {id: 'all', label: 'All Time'}].map(tf => (
                 <button
                   key={tf.id}
                   onClick={() => setTimeFilter(tf.id as any)}
                   className={`px-4 h-full rounded-lg font-bold text-sm transition-all ${timeFilter === tf.id ? 'bg-white text-vet-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                 >
                   {tf.label}
                 </button>
               ))}
             </div>

            {scans.length > 0 && (
              <>
                <button onClick={exportToCSV} className="bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 px-4 h-12 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 text-sm">
                  <Download className="h-4 w-4" /> CSV
                </button>
                <button onClick={() => window.print()} className="bg-vet-blue-600 hover:bg-vet-blue-700 text-white px-5 h-12 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 text-sm">
                  <Printer className="h-4 w-4" /> Print
                </button>
              </>
            )}
          </div>
        </div>

        {scans.length === 0 ? (
          /* --- EMPTY STATE --- */
          <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-16 flex flex-col items-center justify-center text-center mt-8">
              <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border-4 border-slate-100">
                <PieChartIcon className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">No data to analyze</h3>
              <p className="text-slate-500 text-base max-w-md mb-8">
                Your analytics dashboard will automatically populate once you start scanning animals with the AI Diagnostic tool.
              </p>
              <Link href="/diagnose" className="bg-vet-blue-600 hover:bg-vet-blue-700 text-white font-bold h-12 px-8 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                <Stethoscope className="h-5 w-5" /> Start First Scan
              </Link>
          </div>
        ) : (
          /* --- POPULATED DASHBOARD --- */
          <div className="space-y-8">
            
            {/* TOP KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5 relative overflow-hidden transition-all hover:shadow-md hover:border-vet-blue-200 group">
                <div className="absolute -right-4 -top-4 p-4 opacity-5 group-hover:scale-110 transition-transform">
                   <Activity className="h-32 w-32 text-vet-blue-600" />
                </div>
                <div className="bg-vet-blue-50 p-4 rounded-xl shrink-0 z-10 border border-vet-blue-100">
                  <Activity className="h-8 w-8 text-vet-blue-600" />
                </div>
                <div className="z-10">
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Total AI Scans</p>
                  <p className="text-4xl font-extrabold text-slate-900">{totalScans}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5 relative overflow-hidden transition-all hover:shadow-md hover:border-vet-green-200 group">
                <div className="absolute -right-4 -top-4 p-4 opacity-5 group-hover:scale-110 transition-transform">
                   <CheckCircle2 className="h-32 w-32 text-vet-green-600" />
                </div>
                <div className="bg-vet-green-50 p-4 rounded-xl shrink-0 z-10 border border-vet-green-100">
                  <CheckCircle2 className="h-8 w-8 text-vet-green-600" />
                </div>
                <div className="z-10">
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Herd Health Rate</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-extrabold text-slate-900">{healthyRate}%</p>
                    <span className="text-sm font-bold text-vet-green-600 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-0.5" /> Normal
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5 relative overflow-hidden transition-all hover:shadow-md hover:border-red-200 group">
                 <div className="absolute -right-4 -top-4 p-4 opacity-5 group-hover:scale-110 transition-transform">
                   <ShieldAlert className="h-32 w-32 text-red-600" />
                </div>
                <div className="bg-red-50 p-4 rounded-xl shrink-0 z-10 border border-red-100">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <div className="z-10">
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Critical Alerts</p>
                  <p className="text-4xl font-extrabold text-slate-900">{criticalAlerts}</p>
                </div>
              </div>
            </div>

            {/* FULL WIDTH CHART: INTERACTIVE BAR CHART */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Scan Activity Trend</h3>
                  <p className="text-sm text-slate-500 mt-1">Diagnostic volume over the selected timeframe.</p>
                </div>
                <CalendarDays className="h-6 w-6 text-slate-400" />
              </div>
              
              {trendData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-400 italic">No activity recorded in this period.</div>
              ) : (
                <div className="w-full h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                      <Bar dataKey="scans" fill="url(#colorScans)" radius={[6, 6, 0, 0]} maxBarSize={40} animationDuration={1000} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* SPLIT CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Chart: Disease Breakdown (Progress Bars) */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">Disease Anomalies</h3>
                    <p className="text-sm text-slate-500 mt-1">Breakdown of detected conditions.</p>
                  </div>
                  <Syringe className="h-6 w-6 text-slate-400" />
                </div>

                {diseaseStats.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-300 min-h-[200px]">
                    <p className="font-medium text-slate-500 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-vet-green-600" /> No diseases detected in this period!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 flex-1 flex flex-col justify-center">
                    {diseaseStats.map((disease, idx) => (
                      <div key={idx} className="group cursor-default">
                        <div className="flex justify-between text-sm font-bold mb-2">
                          <span className="text-slate-800 capitalize truncate max-w-[65%] group-hover:text-red-600 transition-colors">{disease.name}</span>
                          <span className="text-slate-500 shrink-0 bg-slate-100 px-2 py-0.5 rounded-md group-hover:bg-red-50 group-hover:text-red-700 transition-colors">
                            {disease.count} cases ({disease.percent}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-red-500 group-hover:bg-red-600 h-3 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${disease.percent}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Chart: Species Interactive Recharts Donut */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">Scanned Species</h3>
                    <p className="text-sm text-slate-500 mt-1">Which animals are you scanning most?</p>
                  </div>
                  <PawPrint className="h-6 w-6 text-slate-400" />
                </div>

                {speciesStats.length === 0 ? (
                   <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-300 min-h-[200px] mt-4">
                     <p className="font-medium text-slate-500">No species data available.</p>
                   </div>
                ) : (
                  <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-8 mt-4 w-full">
                    
                    {/* Recharts Donut */}
                    <div className="h-[240px] w-[240px] relative shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <RechartsTooltip content={<CustomTooltip />} cursor={false} />
                          <Pie
                            data={speciesStats}
                            cx="50%"
                            cy="50%"
                            innerRadius={75}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={8}
                            animationDuration={1500}
                          >
                            {speciesStats.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Center Overlay Text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                         <span className="text-4xl font-extrabold text-slate-800 leading-none">{totalScans}</span>
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total</span>
                      </div>
                    </div>

                    {/* Interactive Legend */}
                    <div className="flex-1 w-full space-y-3 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                      {speciesStats.map((species, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors cursor-default">
                          <div className="flex items-center gap-3">
                            <div className="h-4 w-4 rounded-full shadow-inner" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}></div>
                            <p className="font-bold text-slate-800 capitalize text-sm">{species.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-extrabold text-slate-900 text-sm">{species.value} <span className="text-xs font-semibold text-slate-400 ml-1">({species.percent}%)</span></p>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                )}
              </div>

            </div>

            {/* RECOMMENDATIONS PANEL */}
            <div className="bg-gradient-to-r from-vet-blue-900 to-[#1e293b] rounded-3xl shadow-lg p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
               <Stethoscope className="absolute -left-10 -bottom-10 h-48 w-48 text-white/5 rotate-12" />
               <div className="z-10 relative">
                 <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block backdrop-blur-md">AI Recommendation</span>
                 <h3 className="text-2xl font-extrabold mb-2">Maintain Biological Security</h3>
                 <p className="text-vet-blue-100 max-w-xl text-base leading-relaxed">
                   Regular scans improve AI accuracy and help you catch viral outbreaks like Lumpy Skin Disease (LSD) before they spread to the rest of the herd.
                 </p>
               </div>
               <Link href="/diagnose" className="z-10 bg-white text-vet-blue-900 hover:bg-slate-50 h-14 px-8 rounded-xl font-bold transition-all shadow-xl flex items-center justify-center gap-2 shrink-0 whitespace-nowrap text-lg">
                 Run New Scan <ChevronRight className="h-5 w-5" />
               </Link>
            </div>

          </div>
        )}
      </div>

      {/* =========================================================
          OFFICIAL PRINTABLE REPORT (HIDDEN ON WEB, VISIBLE ON PRINT)
      ========================================================= */}
      <div className="hidden print:block print:w-full print:bg-white print:text-black">
        
        {/* Print Header */}
        <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="JeevRaksha Logo" className="h-16 w-16 object-contain" />
            <div>
              <h2 className="text-2xl font-extrabold uppercase tracking-tight text-black">Official Analytics Report</h2>
              <p className="text-xs font-bold tracking-widest text-gray-600 mt-1">JEEVRAKSHA AI VETERINARY SYSTEM</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <div className="border border-black p-2 rounded text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">Facility Location</p>
              <p className="text-sm font-bold text-black">{farmName}</p>
            </div>
            <p className="text-xs font-bold mt-2">Printed: {new Date().toLocaleString()}</p>
            <p className="text-xs font-bold">Report Period: {timeFilter === 'all' ? 'All Time' : timeFilter === '30d' ? 'Last 30 Days' : timeFilter === '7d' ? 'Last 7 Days' : 'Last 24 Hours'}</p>
          </div>
        </div>

        {/* Print KPIs */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="border border-black p-4 text-center">
             <p className="text-xs font-bold uppercase text-gray-600 mb-1">Total Scans</p>
             <p className="text-2xl font-extrabold">{totalScans}</p>
          </div>
          <div className="border border-black p-4 text-center">
             <p className="text-xs font-bold uppercase text-gray-600 mb-1">Herd Health Rate</p>
             <p className="text-2xl font-extrabold">{healthyRate}%</p>
          </div>
          <div className="border border-black p-4 text-center">
             <p className="text-xs font-bold uppercase text-gray-600 mb-1">Critical Alerts</p>
             <p className="text-2xl font-extrabold">{criticalAlerts}</p>
          </div>
        </div>

        {/* Print Tables */}
        <div className="grid grid-cols-2 gap-8 mt-8">
          
          <div>
            <h3 className="text-lg font-bold border-b border-black pb-2 mb-4 uppercase tracking-wider">Top Disease Anomalies</h3>
            {diseaseStats.length > 0 ? (
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-400">
                    <th className="py-2 font-bold">Disease</th>
                    <th className="py-2 font-bold text-right">Cases</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {diseaseStats.map(d => (
                    <tr key={d.name}>
                      <td className="py-2 capitalize">{d.name}</td>
                      <td className="py-2 text-right font-bold">{d.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm italic text-gray-600">No anomalies detected in this period.</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold border-b border-black pb-2 mb-4 uppercase tracking-wider">Species Scanned</h3>
            {speciesStats.length > 0 ? (
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-400">
                    <th className="py-2 font-bold">Species</th>
                    <th className="py-2 font-bold text-right">Total Scans</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {speciesStats.map(s => (
                    <tr key={s.name}>
                      <td className="py-2 capitalize">{s.name}</td>
                      <td className="py-2 text-right font-bold">{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm italic text-gray-600">No species data recorded.</p>
            )}
          </div>

        </div>

        {/* Print Footer / Signatures */}
        <div className="mt-24 pt-8 border-t-2 border-black flex justify-between items-end print:break-inside-avoid">
          <div className="text-center">
            <div className="w-48 border-b border-black mb-1"></div>
            <p className="font-bold text-[10px] uppercase tracking-widest">Authorized Signature</p>
          </div>
          <div className="text-center">
            <div className="w-48 border-b border-black mb-1"></div>
            <p className="font-bold text-[10px] uppercase tracking-widest">Official Facility Seal</p>
          </div>
        </div>

      </div>
    </div>
  );
}