'use client';

import { useSession, signOut } from 'next-auth/react';
import { Shield, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Shield className="w-6 h-6 text-indigo-500" />
        <span className="text-xl font-bold">Secure Portal</span>
      </div>
      {session?.user && (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
            <User className="w-4 h-4 text-slate-400" />
            <span>{session.user.name}</span>
            <span className="text-xs bg-indigo-600 px-2 py-0.5 rounded font-bold">
              {(session.user as any).role}
            </span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-sm bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-md transition"
          >
            <LogOut className="w-4 h-4 inline mr-1" /> Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}