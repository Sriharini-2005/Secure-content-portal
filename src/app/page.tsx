'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push('/dashboard');
  }, [session, router]);

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full text-center">
        <ShieldCheck className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Internal Portal Login</h1>
        <p className="text-slate-400 text-sm mb-6">Authenticate via Google OAuth to access documents and media.</p>
        <button
          onClick={() => signIn('google')}
          className="w-full bg-white text-slate-900 hover:bg-slate-200 font-bold py-3 rounded-lg transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}