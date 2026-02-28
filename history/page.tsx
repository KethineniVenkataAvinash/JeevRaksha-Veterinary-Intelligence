'use client';

import React, { useState, useEffect } from "react";
import { createClient } from '@/utils/supabase/client';
import Link from "next/link";
import { 
  ClipboardList, Search, Calendar, Filter, Activity, 
  CheckCircle2, AlertTriangle, ChevronRight, Stethoscope, Loader2,
  Printer, ShieldAlert, FileText, CheckCircle, Download, ChevronDown, ChevronUp, ArrowUpDown, PawPrint
} from "lucide-react";

interface ScanRecord {
  id: string;
  created_at: string;
  species: string | null;
  vision_disease: string | null;
  audio_status: string | null;
  weight_kg: string | null;
  bcs_score: string | null;
}

export default function HistoryPage() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- ADVANCED INTERACTIVITY STATES ---
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Healthy" | "Issues">("All");
  const [speciesFilter, setSpeciesFilter] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  
  // User Data for Print Report
  const [userName, setUserName] = useState("Veterinary User");
  const [farmName, setFarmName] = useState("Unregistered Facility");
  const [userRole, setUserRole] = useState("Farmer");

  const supabase = createClient();

  useEffect(() => {
    const fetchHistoryAndUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setUserName(user.user_metadata?.full_name || "Veterinary User");
        setFarmName(user.user_metadata?.organization || "Unregistered Facility");
        setUserRole(user.user_metadata?.role || "Farmer");

        const { data, error } = await supabase
          .from('scan_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setScans(data || []);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryAndUser();
  }, []);

  // --- HELPER LOGIC ---
  const isHealthy = (scan: ScanRecord) => {
    const vHealthy = !scan.vision_disease || scan.vision_disease.toLowerCase().includes('healthy');
    const aHealthy = !scan.audio_status || scan.audio_status.toLowerCase().includes('healthy');
    return vHealthy && aHealthy;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };
  };

  // Smart Mapper to link History accurately to the Clinical Guide
  const getDiseaseGuideId = (diseaseName: string | null) => {
    if (!diseaseName) return '';
    const v = diseaseName.toLowerCase();
    if (v.includes('lumpy')) return 'lsd';
    if (v.includes('foot') || v.includes('fmd')) return 'fmd';
    if (v.includes('ringworm')) return 'ringworm';
    if (v.includes('mange') || v.includes('khujli')) return 'mange';
    if (v.includes('wart') || v.includes('papilloma')) return 'papillomatosis';
    if (v.includes('tick')) return 'ticks';
    if (v.includes('pox')) return 'goatpox'; 
    if (v.includes('hs') || v.includes('hemorrhagic')) return 'hs';
    if (v.includes('brd') || v.includes('pneumonia')) return 'brd';
    return '';
  };

  // --- FILTERING & SORTING ENGINE ---
  const processedScans = scans.filter(scan => {
    const matchesSearch = 
      (scan.species || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (scan.vision_disease || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (scan.audio_status || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (statusFilter === "Healthy" && !isHealthy(scan)) return false;
    if (statusFilter === "Issues" && isHealthy(scan)) return false;
    if (speciesFilter !== "All" && scan.species?.toLowerCase() !== speciesFilter.toLowerCase()) return false;
    
    return true;
  }).sort((a, b) => {
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();
    return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
  });

  const uniqueSpecies = ["All", ...Array.from(new Set(scans.map(s => s.species?.toLowerCase() || 'unknown')))];
  const totalScans = scans.length;
  const healthyCount = scans.filter(isHealthy).length;
  const issueCount = totalScans - healthyCount;

  // --- CSV EXPORT ENGINE ---
  const exportToCSV = () => {
    const headers = ["Date", "Time", "Species", "Vision/Dermal Diagnosis", "Audio/Respiratory Status", "Weight (kg)", "BCS Score", "Overall Status"];
    const csvRows = processedScans.map(scan => {
      const dt = formatDate(scan.created_at);
      const status = isHealthy(scan) ? "Healthy" : "Action Required";
      return [
        `"${dt.date}"`,
        `"${dt.time}"`,
        `"${scan.species || 'Unknown'}"`,
        `"${scan.vision_disease || 'N/A'}"`,
        `"${scan.audio_status || 'N/A'}"`,
        `"${scan.weight_kg || 'N/A'}"`,
        `"${scan.bcs_score || 'N/A'}"`,
        `"${status}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `JeevRaksha_Ledger_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- UI BADGES ---
  const renderBadge = (text: string | null) => {
    if (!text || text === 'N/A') return <span className="text-slate-400 font-medium italic print:text-black">N/A</span>;
    
    const lowerText = text.toLowerCase();
    const healthy = lowerText.includes('healthy') || lowerText.includes('normal') || lowerText.includes('clear');
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border print:border-none print:p-0 print:text-[10px] ${
        healthy 
          ? 'bg-vet-green-100 text-vet-green-800 border-vet-green-200 print:bg-transparent print:text-black' 
          : 'bg-red-100 text-red-700 border-red-200 print:bg-transparent print:text-black'
      }`}>
        {healthy ? <CheckCircle2 className="h-3.5 w-3.5 print:hidden" /> : <AlertTriangle className="h-3.5 w-3.5 print:hidden" />} 
        <span className="print:font-bold">{text}</span>
      </span>
    );
  };

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-16 print:p-0 print:m-0 print:space-y-0">
      
      {/* =========================================================
          WEB UI SECTION (HIDDEN ON PRINT)
      ========================================================= */}
      <div className="print:hidden space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-vet-blue-900 flex items-center gap-3 tracking-tight">
              <ClipboardList className="h-8 w-8 text-vet-blue-600" /> Diagnostic Ledger
            </h1>
            <p className="text-slate-500 mt-2 text-base">Comprehensive history of your multimodal AI health scans.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button onClick={exportToCSV} className="bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 px-4 h-12 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 text-sm">
              <Download className="h-4 w-4" /> CSV
            </button>
            <button onClick={() => window.print()} className="bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 px-4 h-12 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 text-sm">
              <Printer className="h-4 w-4" /> Print
            </button>
            <Link href="/diagnose" className="bg-vet-blue-600 hover:bg-vet-blue-700 text-white px-6 h-12 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 text-sm">
              <Stethoscope className="h-5 w-5" /> New Scan
            </Link>
          </div>
        </div>

        {/* QUICK METRICS */}
        {!loading && totalScans > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center"><Activity className="h-6 w-6 text-slate-600"/></div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Scans</p>
                <p className="text-2xl font-extrabold text-slate-900">{totalScans}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-vet-green-50 border border-vet-green-100 flex items-center justify-center"><CheckCircle className="h-6 w-6 text-vet-green-600"/></div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Healthy Cleared</p>
                <p className="text-2xl font-extrabold text-vet-green-700">{healthyCount}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center"><ShieldAlert className="h-6 w-6 text-red-600"/></div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Action Required</p>
                <p className="text-2xl font-extrabold text-red-700">{issueCount}</p>
              </div>
            </div>
          </div>
        )}

        {/* INTERACTIVE SEARCH & FILTERS */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col lg:flex-row items-center gap-4 w-full">
          
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search diagnosis or species..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-vet-blue-500 focus:ring-2 focus:ring-vet-blue-500/20 transition-all font-medium text-slate-900 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Species Dropdown */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 h-12">
               <PawPrint className="h-4 w-4 text-slate-400 mr-2" />
               <select 
                 value={speciesFilter} 
                 onChange={(e) => setSpeciesFilter(e.target.value)}
                 className="bg-transparent outline-none font-bold text-sm text-slate-700 capitalize cursor-pointer pr-4"
               >
                 {uniqueSpecies.map(sp => (
                   <option key={sp} value={sp}>{sp === 'All' ? 'All Species' : sp}</option>
                 ))}
               </select>
            </div>

            {/* Status Pills */}
            <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 h-12">
              {["All", "Healthy", "Issues"].map((filter) => (
                <button 
                  key={filter}
                  onClick={() => setStatusFilter(filter as any)}
                  className={`px-4 h-full rounded-lg font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                    statusFilter === filter 
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Sort Button */}
            <button 
              onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
              className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 hover:bg-slate-100 transition-colors text-slate-700 font-bold text-sm"
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
            </button>
          </div>
        </div>

        {/* EXPANDABLE DATA TABLE */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-32 text-slate-500">
              <Loader2 className="h-10 w-10 animate-spin text-vet-blue-600 mb-4" />
              <p className="font-medium text-lg">Loading clinical ledger...</p>
            </div>
          ) : processedScans.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-32 text-center px-4">
              <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border-4 border-slate-100">
                <Activity className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">No scans found</h3>
              <p className="text-slate-500 text-base max-w-md mb-8">
                {searchQuery || statusFilter !== "All" || speciesFilter !== "All" 
                  ? "No results match your current filters." 
                  : "You haven't run any AI diagnostics yet. Start your first scan."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200">
                    <th className="py-4 px-6 font-bold text-slate-500 text-xs uppercase tracking-widest whitespace-nowrap">Date & Time</th>
                    <th className="py-4 px-6 font-bold text-slate-500 text-xs uppercase tracking-widest whitespace-nowrap">Subject Species</th>
                    <th className="py-4 px-6 font-bold text-slate-500 text-xs uppercase tracking-widest whitespace-nowrap">Dermal / Vision</th>
                    <th className="py-4 px-6 font-bold text-slate-500 text-xs uppercase tracking-widest whitespace-nowrap">Respiratory Audio</th>
                    <th className="py-4 px-6 font-bold text-slate-500 text-xs uppercase tracking-widest whitespace-nowrap">Biometrics</th>
                    <th className="py-4 px-6 font-bold text-slate-500 text-xs uppercase tracking-widest whitespace-nowrap text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {processedScans.map((scan) => {
                    const dt = formatDate(scan.created_at);
                    const isExpanded = expandedRow === scan.id;
                    const healthy = isHealthy(scan);
                    const guideId = getDiseaseGuideId(scan.vision_disease);

                    return (
                      <React.Fragment key={scan.id}>
                        <tr 
                          onClick={() => toggleRow(scan.id)}
                          className={`cursor-pointer transition-colors group ${isExpanded ? 'bg-vet-blue-50/30' : 'hover:bg-slate-50/50'}`}
                        >
                          <td className="py-5 px-6 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800">{dt.date}</span>
                              <span className="text-xs font-medium text-slate-500">{dt.time}</span>
                            </div>
                          </td>
                          <td className="py-5 px-6">
                            <span className="font-extrabold text-slate-900 capitalize text-sm bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                              {scan.species || 'Unknown'}
                            </span>
                          </td>
                          <td className="py-5 px-6">{renderBadge(scan.vision_disease)}</td>
                          <td className="py-5 px-6">{renderBadge(scan.audio_status)}</td>
                          <td className="py-5 px-6">
                            {scan.weight_kg || scan.bcs_score ? (
                              <div className="flex flex-col gap-1">
                                {scan.weight_kg && <span className="text-sm font-bold text-slate-800">{scan.weight_kg} kg</span>}
                                {scan.bcs_score && <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">BCS: {scan.bcs_score}</span>}
                              </div>
                            ) : (
                              <span className="text-slate-400 font-medium italic text-sm">-</span>
                            )}
                          </td>
                          <td className="py-5 px-6 text-right">
                            <button className="p-2 bg-slate-50 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            </button>
                          </td>
                        </tr>

                        {/* EXPANDED ROW DETAILS */}
                        {isExpanded && (
                          <tr className="bg-slate-50/50 border-b-2 border-slate-200">
                            <td colSpan={6} className="p-6">
                              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-6 animate-in slide-in-from-top-2 duration-300">
                                
                                <div className="flex-1">
                                  <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-vet-blue-600" /> Clinical AI Summary
                                  </h4>
                                  <p className="text-sm text-slate-600 leading-relaxed">
                                    This scan was performed on <strong className="text-slate-800">{dt.date}</strong> at {dt.time}. 
                                    The subject is identified as a <strong className="capitalize text-slate-800">{scan.species}</strong>. 
                                    Dermal/Vision analysis concluded: <strong className={scan.vision_disease === 'Healthy' ? 'text-vet-green-600' : 'text-red-600'}>{scan.vision_disease || 'No visual data'}</strong>.
                                    Acoustic respiratory analysis concluded: <strong className={scan.audio_status === 'Healthy' ? 'text-vet-green-600' : 'text-red-600'}>{scan.audio_status || 'No audio data'}</strong>.
                                  </p>
                                  
                                  <div className="mt-4 flex items-center gap-3">
                                    <span className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-widest border ${
                                      healthy ? 'bg-vet-green-100 text-vet-green-800 border-vet-green-200' : 'bg-red-100 text-red-700 border-red-200'
                                    }`}>
                                      {healthy ? 'Herd Clearance Granted' : 'Quarantine / Treat Required'}
                                    </span>
                                    
                                    {!healthy && guideId && (
                                      <Link href={`/guide?disease=${guideId}`} className="text-xs font-bold text-vet-blue-600 hover:text-vet-blue-800 hover:underline transition-colors flex items-center gap-1">
                                        View Treatment Protocol <ChevronRight className="h-3 w-3" />
                                      </Link>
                                    )}
                                  </div>
                                </div>

                                {(scan.weight_kg || scan.bcs_score) && (
                                  <div className="lg:w-1/3 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-center">
                                     <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-200 pb-2">Biometrics Log</h4>
                                     <div className="flex justify-between items-center py-1">
                                       <span className="text-sm font-medium text-slate-600">Calculated Mass:</span>
                                       <span className="font-bold text-slate-900">{scan.weight_kg} kg</span>
                                     </div>
                                     <div className="flex justify-between items-center py-1">
                                       <span className="text-sm font-medium text-slate-600">Condition Score:</span>
                                       <span className="font-bold text-slate-900">{scan.bcs_score}</span>
                                     </div>
                                  </div>
                                )}
                                
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          OFFICIAL PRINTABLE LEDGER (HIDDEN ON WEB, VISIBLE ON PRINT)
      ========================================================= */}
      <div className="hidden print:block print:w-full print:bg-white print:text-black">
        
        {/* Print Header */}
        <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
          <div className="flex items-center gap-4">
            {/* Provide a reliable absolute URL for the logo in print if possible, or relative */}
            <img src="/logo.png" alt="JeevRaksha Logo" className="h-16 w-16 object-contain" />
            <div>
              <h2 className="text-2xl font-extrabold uppercase tracking-tight text-black">Official Clinical Ledger</h2>
              <p className="text-xs font-bold tracking-widest text-gray-600 mt-1">JEEVRAKSHA AI VETERINARY SYSTEM</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <div className="border border-black p-2 rounded text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">Facility Location</p>
              <p className="text-sm font-bold text-black">{farmName}</p>
            </div>
            <p className="text-xs font-bold mt-2">Printed: {new Date().toLocaleString()}</p>
            <p className="text-xs font-bold">Authorized By: {userName}</p>
          </div>
        </div>

        {/* Print Table */}
        <div className="w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="py-2 pr-2 font-bold uppercase tracking-wider w-32">Date & Time</th>
                <th className="py-2 px-2 font-bold uppercase tracking-wider w-24">Species</th>
                <th className="py-2 px-2 font-bold uppercase tracking-wider">Dermal / Vision Status</th>
                <th className="py-2 px-2 font-bold uppercase tracking-wider">Acoustic / Respiratory Status</th>
                <th className="py-2 pl-2 font-bold uppercase tracking-wider text-right">Weight & BCS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {processedScans.map((scan) => {
                const dt = formatDate(scan.created_at);
                return (
                  <tr key={scan.id} className="print:break-inside-avoid">
                    <td className="py-3 pr-2">
                      <span className="block font-bold">{dt.date}</span>
                      <span className="block text-[10px] text-gray-600">{dt.time}</span>
                    </td>
                    <td className="py-3 px-2 font-bold capitalize">
                      {scan.species || 'Unknown'}
                    </td>
                    <td className="py-3 px-2 font-bold">
                      {scan.vision_disease || 'N/A'}
                    </td>
                    <td className="py-3 px-2 font-bold">
                      {scan.audio_status || 'N/A'}
                    </td>
                    <td className="py-3 pl-2 text-right">
                      {scan.weight_kg && <span className="block font-bold">{scan.weight_kg} kg</span>}
                      {scan.bcs_score && <span className="block text-[10px] text-gray-600">BCS: {scan.bcs_score}</span>}
                      {!scan.weight_kg && !scan.bcs_score && <span>-</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {processedScans.length === 0 && (
            <div className="text-center py-10 border-b border-gray-300">
              <p className="font-bold text-gray-500 italic">No diagnostic records found for this period.</p>
            </div>
          )}
        </div>

        {/* Print Footer / Signatures */}
        <div className="mt-16 pt-8 border-t-2 border-black flex justify-between items-end print:break-inside-avoid">
          <div className="text-center">
            <div className="w-48 border-b border-black mb-1"></div>
            <p className="font-bold text-[10px] uppercase tracking-widest">Veterinary Officer Signature</p>
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