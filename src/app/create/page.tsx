import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';
import { CreateSplitForm } from '@/components/split/CreateSplitForm';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function CreatePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/create');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 font-bold transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-lg text-indigo-600 font-black tracking-tight">SplitKaro</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard" 
              className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3.5 py-1.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-200"
            >
              Dashboard
            </Link>
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200">
                {(profile?.name || user.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="max-w-xl mx-auto px-4 py-8 md:py-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200/60 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" /> Direct Split & Collect via UPI
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Create a New Split
          </h1>
          <p className="text-sm text-slate-600 font-medium max-w-sm mx-auto">
            Friends simply tap your link to pay with GPay, PhonePe, or Paytm with pre-filled amounts.
          </p>
        </div>

        <CreateSplitForm />

        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 pt-2 pb-8">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Money never touches our servers — sent directly to your UPI ID</span>
        </div>
      </main>
    </div>
  );
}
