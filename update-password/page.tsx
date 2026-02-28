'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      // Supabase knows which user to update based on the secure session 
      // established by the link they clicked in their email.
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;
      
      setSuccess("Your password has been updated successfully!");
      
      // Optional: Redirect them back to the login page after a short delay
      setTimeout(() => {
        router.push('/login'); 
      }, 3000);

    } catch (err: any) {
      setError(err.message || "Failed to update password. Your link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8">
      {/* --- WHITE CARD CONTAINER --- */}
      <div className="w-full max-w-xl bg-white p-8 sm:p-12 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="mb-10 text-center">
           <h2 className="text-3xl font-extrabold text-vet-blue-900 mb-3">
             Set New Password
           </h2>
           <p className="text-slate-500 font-medium">
             Please enter your new secure password below.
           </p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-5">
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-vet-blue-500 focus:ring-2 focus:ring-vet-blue-500/20 transition-all" 
              placeholder="••••••••" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
            <input 
              type="password" 
              required 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-vet-blue-500 focus:ring-2 focus:ring-vet-blue-500/20 transition-all" 
              placeholder="••••••••" 
            />
          </div>

          {/* Notifications */}
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium flex items-center gap-3 border border-red-100">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="bg-vet-green-50 text-vet-green-700 p-4 rounded-xl text-sm font-medium flex items-center gap-3 border border-vet-green-100">
              <ShieldCheck className="h-5 w-5 flex-shrink-0" /> 
              <div>
                {success}
                <p className="text-xs mt-1 opacity-80">Redirecting to login...</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading || success !== null} 
            className="w-full bg-vet-blue-600 hover:bg-vet-blue-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-vet-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400 mt-6 text-lg"
          >
            {loading ? 'Updating...' : 'Save Password'} 
            {!loading && <ArrowRight className="h-5 w-5" />}
          </button>
        </form>

      </div>
    </div>
  );
}