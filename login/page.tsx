'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { AlertTriangle, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';

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

export default function LoginPage() {
  // --- UI STATES ---
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  // --- FORM STATES ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Farmer');
  const [farmName, setFarmName] = useState('');
  
  // --- DEMOGRAPHIC STATES ---
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState<number | ''>('');
  
  // --- STATUS STATES ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  // --- AGE CALCULATION LOGIC ---
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

  // --- LOGIN & SIGN UP HANDLER ---
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isSignUp) {
        // Construct the full location string for the database
        const fullLocation = `${selectedCity}, ${selectedState}, India`;

        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
              role: role.toLowerCase(),
              organization: farmName,
              location: fullLocation,
              dob: dob,
              age: age
            }
          }
        });
        if (signUpError) throw signUpError;
        setSuccess("Account created successfully! Check your email to verify your account.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  // --- PASSWORD RESET HANDLER ---
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("Please enter your email address first.");
      setLoading(false);
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
      });
      if (resetError) throw resetError;
      setSuccess("Password reset link sent! Please check your email.");
    } catch (err: any) {
      setError(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  // --- VIEW TOGGLER ---
  const toggleMode = (mode: 'login' | 'signup' | 'forgot') => {
    setError(null);
    setSuccess(null);
    if (mode === 'login') {
      setIsSignUp(false);
      setIsForgotPassword(false);
    } else if (mode === 'signup') {
      setIsSignUp(true);
      setIsForgotPassword(false);
    } else if (mode === 'forgot') {
      setIsForgotPassword(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-8">
      
      {/* --- APP BRANDING HEADER --- */}
      <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-700 flex flex-col items-center">
        <img 
          src="/logo.png" 
          alt="JeevRaksha Logo" 
          className="h-28 w-28 rounded-[2rem] shadow-xl border-4 border-white mb-5 object-cover bg-white" 
        />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-vet-blue-900 tracking-tight">
          JeevRaksha
        </h1>
        <p className="text-vet-blue-600/80 font-bold mt-2 tracking-widest uppercase text-xs sm:text-sm">
          Intelligent Health For Every Herd
        </p>
      </div>

      {/* --- WHITE CARD CONTAINER --- */}
      <div className="w-full max-w-xl bg-white p-8 sm:p-12 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        
        {/* --- FORGOT PASSWORD VIEW --- */}
        {isForgotPassword ? (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <button 
              onClick={() => toggleMode('login')} 
              className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-vet-blue-600 transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" /> Back to login
            </button>
            
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-vet-blue-900 mb-3">Reset Password</h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Enter your email address and we'll send you a link to securely reset your password.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-vet-blue-500 focus:ring-2 focus:ring-vet-blue-500/20 transition-all" 
                  placeholder="farmer@example.com" 
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium flex items-center gap-3 border border-red-100">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" /> {error}
                </div>
              )}
              {success && (
                <div className="bg-vet-green-50 text-vet-green-700 p-4 rounded-xl text-sm font-medium flex items-center gap-3 border border-vet-green-100">
                  <ShieldCheck className="h-5 w-5 flex-shrink-0" /> {success}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-vet-blue-600 hover:bg-vet-blue-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-vet-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400 mt-6 text-lg"
              >
                {loading ? 'Sending...' : 'Send Reset Link'} 
                {!loading && <ArrowRight className="h-5 w-5" />}
              </button>
            </form>
          </div>
        ) : (
          
          /* --- LOGIN / SIGN UP VIEW --- */
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="mb-10 text-center">
               <h2 className="text-3xl font-extrabold text-vet-blue-900 mb-3">
                 {isSignUp ? 'Create your account' : 'Welcome back'}
               </h2>
               <p className="text-slate-500 font-medium">
                 {isSignUp ? 'Enter your details to join the platform.' : 'Enter your email and password to access your dashboard.'}
               </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
              
              {/* --- SIGN UP ONLY FIELDS --- */}
              {isSignUp && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-500 space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Legal Name</label>
                    <input 
                      type="text" 
                      required 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-vet-blue-500 focus:ring-2 focus:ring-vet-blue-500/20 transition-all" 
                      placeholder="e.g. Kethineni Venkata Avinash" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Date of Birth</label>
                      <input 
                        type="date" 
                        required 
                        value={dob} 
                        onChange={handleDobChange}
                        max={new Date().toISOString().split("T")[0]} 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-vet-blue-500 focus:ring-2 focus:ring-vet-blue-500/20 transition-all text-slate-700" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Calculated Age</label>
                      <input 
                        type="text" 
                        readOnly 
                        value={age !== '' ? `${age} Years Old` : ''} 
                        className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl outline-none text-slate-500 cursor-not-allowed font-medium" 
                        placeholder="Auto-calculated" 
                      />
                    </div>
                  </div>

                  {/* DYNAMIC CASCADING STATE/CITY DROPDOWN */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">State (India)</label>
                      <select 
                        required 
                        value={selectedState} 
                        onChange={(e) => {
                          setSelectedState(e.target.value);
                          setSelectedCity(''); // Reset city when state changes
                        }} 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-vet-blue-500 focus:ring-2 focus:ring-vet-blue-500/20 transition-all cursor-pointer text-slate-700"
                      >
                        <option value="" disabled>Select State</option>
                        {Object.keys(INDIA_DATA).sort().map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">City / District</label>
                      <select 
                        required 
                        disabled={!selectedState}
                        value={selectedCity} 
                        onChange={(e) => setSelectedCity(e.target.value)} 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-vet-blue-500 focus:ring-2 focus:ring-vet-blue-500/20 transition-all cursor-pointer text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="" disabled>Select City</option>
                        {selectedState && INDIA_DATA[selectedState].sort().map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        required 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-vet-blue-500 focus:ring-2 focus:ring-vet-blue-500/20 transition-all" 
                        placeholder="+91 98765..." 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Account Role</label>
                      <select 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)} 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-vet-blue-500 focus:ring-2 focus:ring-vet-blue-500/20 transition-all cursor-pointer"
                      >
                        <option>Farmer</option>
                        <option>Veterinarian</option>
                        <option>Admin</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Farm or Clinic Name</label>
                    <input 
                      type="text" 
                      required 
                      value={farmName} 
                      onChange={(e) => setFarmName(e.target.value)} 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-vet-blue-500 focus:ring-2 focus:ring-vet-blue-500/20 transition-all" 
                      placeholder="e.g. Avinash Dairy Farm" 
                    />
                  </div>
                </div>
              )}

              {/* --- STANDARD FIELDS (Both Login & Signup) --- */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-vet-blue-500 focus:ring-2 focus:ring-vet-blue-500/20 transition-all" 
                  placeholder="farmer@example.com" 
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-slate-700">Password</label>
                  {!isSignUp && (
                    <button 
                      type="button" 
                      onClick={() => toggleMode('forgot')}
                      className="text-sm font-semibold text-vet-blue-600 hover:text-vet-blue-800 transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-vet-blue-500 focus:ring-2 focus:ring-vet-blue-500/20 transition-all" 
                  placeholder="••••••••" 
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium flex items-center gap-3 border border-red-100">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" /> {error}
                </div>
              )}
              {success && (
                <div className="bg-vet-green-50 text-vet-green-700 p-4 rounded-xl text-sm font-medium flex items-center gap-3 border border-vet-green-100">
                  <ShieldCheck className="h-5 w-5 flex-shrink-0" /> {success}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-vet-blue-600 hover:bg-vet-blue-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-vet-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400 mt-6 text-lg"
              >
                {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Secure Log In')} 
                {!loading && <ArrowRight className="h-5 w-5" />}
              </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-slate-100">
              <p className="text-slate-600 font-medium">
                {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}
                <button 
                  type="button"
                  onClick={() => toggleMode(isSignUp ? 'login' : 'signup')} 
                  className="ml-2 font-bold text-vet-blue-600 hover:text-vet-blue-800 transition-colors underline underline-offset-4"
                >
                  {isSignUp ? 'Log in here' : 'Sign up now'}
                </button>
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 max-w-xl text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
        <p className="text-slate-500 text-sm leading-relaxed">
          <strong className="text-slate-700 font-bold">JeevRaksha</strong> is an offline-first Veterinary Intelligence System that utilizes Multimodal AI Fusion. It provides instant screening for rural farmers by simultaneously analyzing visual geometry and audio cues, completely autonomously without requiring an internet connection.
        </p>
      </div>

    </div>
  );
}