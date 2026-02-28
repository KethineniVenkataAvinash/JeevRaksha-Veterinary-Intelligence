'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Loader2, AlertTriangle } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [status, setStatus] = useState("Authenticating...");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      // 1. Check for 'code' (PKCE flow) or 'error' in URL
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const next = searchParams.get('next') ?? '/';

      if (error) {
        setErrorMsg("Authentication failed. Link may be expired.");
        return;
      }

      if (code) {
        // Exchange code for session explicitly on the client
        const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
        if (sessionError) {
          setErrorMsg(sessionError.message);
        } else {
          // Success!
          router.push(next);
        }
      } else {
        // 2. Fallback: Check if Supabase client auto-detected a session (e.g. from Hash fragment)
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push(next);
        } else {
          // Wait briefly for auto-recovery, else redirect to login
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
      }
    };

    handleAuth();
  }, [router, searchParams, supabase]);

  if (errorMsg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex items-center gap-4 max-w-sm">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          <div>
            <h3 className="font-bold text-slate-900">Login Failed</h3>
            <p className="text-sm text-slate-500 mt-1">{errorMsg}</p>
          </div>
        </div>
        <button onClick={() => router.push('/login')} className="mt-6 text-vet-blue-600 font-bold hover:underline">
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center animate-pulse">
        <Loader2 className="h-10 w-10 text-vet-blue-600 animate-spin mb-4" />
        <h2 className="text-xl font-extrabold text-slate-800">{status}</h2>
        <p className="text-sm text-slate-500 mt-2">Securing your session...</p>
      </div>
    </div>
  );
}