'use client';

import { useState, useEffect, ChangeEvent } from "react";
import { createClient } from '@/utils/supabase/client';
import { 
  Settings, Save, User, CheckCircle2, AlertTriangle, 
  Lock, Bell, LogOut, Camera, Shield, Laptop, Loader2, Info
} from "lucide-react";
import { useRouter } from "next/navigation";

// --- INDIAN STATES & CITIES DATA ---
const INDIA_DATA: Record<string, string[]> = {
  "Andaman and Nicobar Islands": ["Port Blair", "Nicobar", "South Andaman"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati", "Kurnool", "Rajahmundry", "Kakinada", "Anantapur", "Kadapa"],
  "Arunachal Pradesh": ["Itanagar", "Tawang", "Naharlagun", "Pasighat", "Roing"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Ara", "Begusarai"],
  "Chandigarh": ["Chandigarh"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon", "Raigarh", "Jagdalpur", "Ambikapur"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Anand"],
  "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Rohtak", "Karnal", "Hisar", "Sonipat", "Panchkula"],
  "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Solan", "Mandi", "Palampur"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Kathua"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Phusro", "Hazaribagh"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi", "Davangere", "Ballari", "Vijayapura", "Shivamogga"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur", "Kannur", "Alappuzha", "Kottayam"],
  "Ladakh": ["Leh", "Kargil"],
  "Lakshadweep": ["Kavaratti", "Agatti", "Amini", "Andrott"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa", "Kothri Kalan"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Solapur", "Kalyan", "Navi Mumbai"],
  "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur"],
  "Meghalaya": ["Shillong", "Tura", "Nongstoin", "Jowai"],
  "Mizoram": ["Aizawl", "Lunglei", "Saiha", "Champhai"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur", "Puri", "Balasore"],
  "Puducherry": ["Puducherry", "Ozhukarai", "Karaikal", "Mahe", "Yanam"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Sikar"],
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Tiruppur", "Salem", "Erode", "Vellore"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam", "Khammam", "Mahbubnagar"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj", "Bareilly", "Aligarh", "Noida"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Rishikesh"],
  "West Bengal": ["Kolkata", "Asansol", "Siliguri", "Durgapur", "Bardhaman", "Malda", "Baharampur", "Howrah", "Darjeeling"]
};

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  // --- TAB STATE ---
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');

  // --- PROFILE STATES ---
  const [fullName, setFullName] = useState("");
  const [farmName, setFarmName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  // --- DEMOGRAPHIC STATES ---
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState<number | ''>('');
  
  // --- SECURITY STATES ---
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- UI STATES ---
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // 1. Fetch User Data on Load
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setEmail(user.email || "");
        setFullName(user.user_metadata?.full_name || "");
        setFarmName(user.user_metadata?.organization || "");
        setPhone(user.user_metadata?.phone || "");
        setRole(user.user_metadata?.role || "Farmer");
        setAvatarUrl(user.user_metadata?.avatar_url || null);
        
        // Load Location string and parse it back to City and State Dropdowns
        const locString = user.user_metadata?.location || "";
        if (locString) {
          const parts = locString.split(", ");
          if (parts.length >= 2) {
            setSelectedCity(parts[0]);
            setSelectedState(parts[1]);
          }
        }

        setDob(user.user_metadata?.dob || "");
        setAge(user.user_metadata?.age || "");
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  // --- AGE CALCULATION LOGIC FOR SETTINGS ---
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setDob(selectedDate);
    
    if (selectedDate) {
      const today = new Date();
      const birthDate = new Date(selectedDate);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge >= 0 ? calculatedAge : 0);
    } else {
      setAge('');
    }
  };

  // 2. Handle Avatar Upload (Fixed RLS & Upsert)
  const uploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingAvatar(true);
      setStatus(null);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
          throw new Error('Image size exceeds 2MB limit.');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication failed.");

      const fileExt = file.name.split('.').pop();
      const fileName = `avatar_${Date.now()}.${fileExt}`;
      // Security fix: Group files by user ID
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true }); // upsert true prevents duplicate errors

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateUserError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateUserError) throw updateUserError;

      setAvatarUrl(publicUrl);
      setStatus({ type: 'success', text: 'Profile picture updated successfully!' });
      router.refresh(); 

    } catch (error: any) {
      setStatus({ type: 'error', text: error.message || 'Failed to upload image. Please check bucket RLS policies.' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // 3. Save Profile Updates
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    // Combine location state
    const fullLocation = selectedCity && selectedState ? `${selectedCity}, ${selectedState}, India` : '';

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          organization: farmName,
          phone: phone,
          location: fullLocation,
          dob: dob,
          age: age
        }
      });
      if (error) throw error;
      
      setStatus({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setStatus(null), 3000);
      router.refresh(); 
    } catch (error: any) {
      setStatus({ type: 'error', text: error.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  // 4. Update Password Logic
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', text: 'Passwords do not match.' });
      setSaving(false);
      return;
    }
    if (newPassword.length < 6) {
      setStatus({ type: 'error', text: 'Password must be at least 6 characters.' });
      setSaving(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      
      setStatus({ type: 'success', text: 'Password changed securely!' });
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setStatus(null), 3000);
    } catch (error: any) {
      setStatus({ type: 'error', text: error.message || 'Failed to change password.' });
    } finally {
      setSaving(false);
    }
  };

  // 5. Handle Logout
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-slate-500 font-medium text-lg">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-vet-blue-600" /> Loading settings...
        </div>
      </div>
    );
  }

  const initials = fullName ? fullName.substring(0, 2).toUpperCase() : 'US';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-16">
      
      {/* --- HEADER --- */}
      <div>
        <h1 className="text-3xl font-extrabold text-vet-blue-900 flex items-center gap-3 tracking-tight">
          <Settings className="h-8 w-8 text-vet-blue-600" /> Account Settings
        </h1>
        <p className="text-slate-500 mt-2 text-base">Manage your personal profile, security, and application preferences.</p>
      </div>

      {/* --- STACKED PILL MENU --- */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-2 w-full">
        <button 
          onClick={() => {setActiveTab('profile'); setStatus(null);}}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all text-sm ${activeTab === 'profile' ? 'bg-vet-blue-600 text-white shadow-md' : 'bg-transparent text-slate-600 hover:bg-slate-50'}`}
        >
          <User className="h-5 w-5" /> Personal Info
        </button>
        
        <button 
          onClick={() => {setActiveTab('security'); setStatus(null);}}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all text-sm ${activeTab === 'security' ? 'bg-vet-blue-600 text-white shadow-md' : 'bg-transparent text-slate-600 hover:bg-slate-50'}`}
        >
          <Lock className="h-5 w-5" /> Security
        </button>
        
        <button 
          onClick={() => {setActiveTab('preferences'); setStatus(null);}}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all text-sm ${activeTab === 'preferences' ? 'bg-vet-blue-600 text-white shadow-md' : 'bg-transparent text-slate-600 hover:bg-slate-50'}`}
        >
          <Bell className="h-5 w-5" /> Notifications
        </button>
        
        <button 
          onClick={handleSignOut}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold bg-transparent text-red-600 hover:bg-red-50 transition-all text-sm"
        >
          <LogOut className="h-5 w-5" /> Sign Out
        </button>
      </div>

      {/* --- BOTTOM CONTENT AREA --- */}
      <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-10">
        
        {/* Floating Status Message */}
        {status && (
          <div className={`mb-8 p-4 rounded-xl text-sm font-bold flex items-center gap-3 animate-in fade-in border ${status.type === 'success' ? 'bg-vet-green-50 text-vet-green-800 border-vet-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            {status.type === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertTriangle className="h-5 w-5 shrink-0" />}
            {status.text}
          </div>
        )}

        {/* =========================================
            TAB 1: PROFILE DETAILS
        ========================================= */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-8 animate-in fade-in duration-300">
            
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Profile Details</h2>
              <p className="text-slate-500 text-sm">Update your personal information and farm identity.</p>
            </div>
            
            {/* --- IMPROVED AVATAR SECTION --- */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 py-4">
              <div className="relative shrink-0">
                <input 
                  type="file" 
                  id="avatarUpload" 
                  accept="image/png, image/jpeg"
                  onChange={uploadAvatar}
                  disabled={uploadingAvatar}
                  className="hidden"
                />
                
                <div className="h-40 w-40 rounded-full overflow-hidden border-[5px] border-white shadow-xl bg-vet-blue-50 flex items-center justify-center relative z-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-5xl font-extrabold text-vet-blue-600">{initials}</span>
                  )}
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center transition-opacity z-20 backdrop-blur-sm">
                        <Loader2 className="h-10 w-10 text-white animate-spin" />
                    </div>
                  )}
                </div>

                <label htmlFor="avatarUpload" className={`absolute bottom-1 right-1 z-10 bg-slate-800/90 p-3.5 rounded-full text-white hover:bg-vet-blue-600 transition-all shadow-lg border-2 border-white cursor-pointer backdrop-blur-md ${uploadingAvatar ? 'opacity-50 pointer-events-none' : 'hover:scale-105 active:scale-95'}`}>
                  <Camera className="h-6 w-6" />
                </label>
              </div>

              <div className="flex flex-col items-center sm:items-start pt-2 gap-3">
                <div className="text-center sm:text-left">
                  <h3 className="font-extrabold text-slate-900 text-3xl">{fullName || 'User'}</h3>
                  <span className="inline-block bg-vet-blue-100 text-vet-blue-800 font-bold px-4 py-1 rounded-full text-sm capitalize mt-2">
                    {role || 'Farmer'}
                  </span>
                </div>
                
                <div className="text-sm font-semibold text-slate-500 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 flex items-center gap-2 mt-2">
                  <Info className="h-4 w-4 text-slate-400 shrink-0" />
                  Format: JPG or PNG. Max size: 2MB.
                </div>
              </div>
            </div>

            {/* UNBREAKABLE FORM GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Full Legal Name</label>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="block w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white focus:border-vet-blue-500 focus:ring-2 focus:ring-vet-blue-500/20 transition-all text-slate-900 font-medium text-sm" 
                    />
                </div>
                
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-slate-700">Email Address</label>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Read Only</span>
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      disabled
                      className="block w-full h-12 px-4 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed outline-none font-medium text-sm" 
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Date of Birth</label>
                    <input 
                      type="date" 
                      value={dob}
                      onChange={handleDobChange}
                      max={new Date().toISOString().split("T")[0]}
                      required
                      className="block w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white focus:border-vet-blue-500 focus:ring-2 focus:ring-vet-blue-500/20 transition-all text-slate-900 font-medium text-sm" 
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-slate-700">Calculated Age</label>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Auto</span>
                    </div>
                    <input 
                      type="text" 
                      value={age !== '' ? `${age} Years Old` : ''}
                      disabled
                      className="block w-full h-12 px-4 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed outline-none font-medium text-sm" 
                    />
                </div>

                {/* --- DYNAMIC CASCADING STATE/CITY DROPDOWN IN SETTINGS --- */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">State (India)</label>
                  <select 
                    required 
                    value={selectedState} 
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedCity(''); 
                    }} 
                    className="w-full px-4 h-12 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white focus:border-vet-blue-500 focus:ring-2 focus:ring-vet-blue-500/20 transition-all cursor-pointer text-slate-700 text-sm font-medium"
                  >
                    <option value="" disabled>Select State</option>
                    {Object.keys(INDIA_DATA).sort().map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">City / District</label>
                  <select 
                    required 
                    disabled={!selectedState}
                    value={selectedCity} 
                    onChange={(e) => setSelectedCity(e.target.value)} 
                    className="w-full px-4 h-12 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white focus:border-vet-blue-500 focus:ring-2 focus:ring-vet-blue-500/20 transition-all cursor-pointer text-slate-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="" disabled>Select City</option>
                    {selectedState && INDIA_DATA[selectedState].sort().map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Phone Number</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="block w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white focus:border-vet-blue-500 focus:ring-2 focus:ring-vet-blue-500/20 transition-all text-slate-900 font-medium text-sm" 
                    />
                </div>
                
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-slate-700">Account Role</label>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Read Only</span>
                    </div>
                    <input 
                      type="text" 
                      value={role.charAt(0).toUpperCase() + role.slice(1)}
                      disabled
                      className="block w-full h-12 px-4 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed outline-none font-medium text-sm" 
                    />
                </div>
                
                <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Farm or Clinic Name</label>
                    <input 
                      type="text" 
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      className="block w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white focus:border-vet-blue-500 focus:ring-2 focus:ring-vet-blue-500/20 transition-all text-slate-900 font-medium text-sm" 
                    />
                </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100">
                <button 
                  type="submit" 
                  disabled={saving || uploadingAvatar}
                  className="bg-vet-blue-600 hover:bg-vet-blue-700 text-white font-bold h-12 px-8 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:bg-slate-400 w-full sm:w-auto text-sm sm:text-base"
                >
                    {saving ? <> <Loader2 className="h-5 w-5 animate-spin"/> Saving... </> : <><Save className="h-5 w-5" /> Save Profile</>}
                </button>
            </div>
          </form>
        )}

        {/* =========================================
            TAB 2: SECURITY
        ========================================= */}
        {activeTab === 'security' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Security & Access</h2>
              <p className="text-slate-500 text-sm">Manage your password and secure your account.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-slate-50 border border-slate-200 rounded-xl gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm border border-slate-200">
                  <Shield className="h-6 w-6 text-vet-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Two-Factor Authentication</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Add an extra layer of security.</p>
                </div>
              </div>
              <button type="button" className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 shadow-sm transition-colors text-sm whitespace-nowrap">
                Enable 2FA
              </button>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-6 pt-4">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">New Password</label>
                    <input 
                      type="password" 
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-vet-blue-500 focus:ring-2 focus:ring-vet-blue-500/20 transition-all text-slate-900 text-sm" 
                      placeholder="••••••••"
                    />
                </div>
                
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Confirm New Password</label>
                    <input 
                      type="password" 
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-vet-blue-500 focus:ring-2 focus:ring-vet-blue-500/20 transition-all text-slate-900 text-sm" 
                      placeholder="••••••••"
                    />
                </div>
              </div>

              <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-bold h-12 px-8 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:bg-slate-400 w-full sm:w-auto text-sm sm:text-base"
                  >
                      {saving ? <> <Loader2 className="h-5 w-5 animate-spin"/> Updating... </> : <><Lock className="h-5 w-5" /> Update Password</>}
                  </button>
              </div>
            </form>

            <div className="pt-8 mt-8 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Active Sessions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <Laptop className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">Windows PC • Chrome</p>
                      <p className="text-xs text-slate-500 mt-0.5">India • Active now</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-vet-green-100 text-vet-green-800 px-3 py-1 rounded-full border border-vet-green-200">Current</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* =========================================
            TAB 3: PREFERENCES
        ========================================= */}
        {activeTab === 'preferences' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Notifications & Alerts</h2>
              <p className="text-slate-500 text-sm">Choose how JeevRaksha communicates with you.</p>
            </div>
            
            <div className="space-y-4 pt-2">
              {/* Toggle 1 */}
              <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <p className="font-bold text-slate-800 text-sm sm:text-base">Email Summaries</p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Receive daily or weekly reports of scanned livestock.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vet-blue-600"></div>
                </label>
              </div>

              {/* Toggle 2 */}
              <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <p className="font-bold text-slate-800 text-sm sm:text-base">Critical Disease SMS Alerts</p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Immediate text alerts if highly contagious diseases are detected.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </div>
            
            <div className="pt-8 mt-4 border-t border-slate-100">
                <button className="bg-vet-blue-600 hover:bg-vet-blue-700 text-white font-bold h-12 px-8 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 min-w-[200px] w-full sm:w-auto text-sm sm:text-base">
                    <Save className="h-5 w-5" /> Save Preferences
                </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}