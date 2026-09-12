"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  Smartphone, 
  ShieldCheck, 
  Zap, 
  QrCode, 
  Receipt, 
  Users, 
  Share2, 
  Copy, 
  Sparkles, 
  Clock, 
  Check, 
  ExternalLink,
  MessageCircle,
  ChevronRight,
  TrendingUp,
  X
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function LandingPage() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Interactive Calculator State
  const [calcAmount, setCalcAmount] = useState<number>(2400);
  const [calcPeople, setCalcPeople] = useState<number>(4);
  const [activeTab, setActiveTab] = useState<"preview" | "compare">("preview");
  const [demoPaid, setDemoPaid] = useState<{ [key: string]: boolean }>({
    "1": true,
    "2": false,
    "3": true,
  });
  const [copiedVPA, setCopiedVPA] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then((res: { data: { user: any } }) => {
      setUser(res.data.user);
      setAuthLoading(false);
    });
  }, []);

  const perPerson = Math.round(calcAmount / (calcPeople || 1));

  const toggleDemoPaid = (id: string) => {
    setDemoPaid(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyDemoVPA = () => {
    navigator.clipboard.writeText("adarsh@okhdfcbank");
    setCopiedVPA(true);
    setTimeout(() => setCopiedVPA(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      
      {/* Announcement Pill */}
      <div className="bg-slate-900 text-slate-300 py-2 px-4 text-center text-xs font-medium border-b border-slate-800 flex items-center justify-center gap-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          NEW
        </span>
        <span>Native UPI deep-linking for PhonePe, GPay, Paytm & BHIM</span>
        <span className="text-slate-500 hidden sm:inline">•</span>
        <span className="text-slate-400 hidden sm:inline">0% fees, 100% direct bank transfer</span>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-black text-xl text-slate-900 tracking-tight">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-sm shadow-indigo-300">
                ₹
              </span>
              <span>SplitKaro</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <a href="#demo" className="hover:text-slate-900 transition-colors">Interactive Demo</a>
              <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it Works</a>
              <a href="#compare" className="hover:text-slate-900 transition-colors">Why Not Splitwise?</a>
              <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {authLoading ? (
              <div className="w-20 h-9 bg-slate-100 rounded-lg animate-pulse" />
            ) : user ? (
              <Link 
                href="/dashboard" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-xs transition-all"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Log in
                </Link>
                <Link 
                  href="/login" 
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-xs transition-all"
                >
                  <span>Start a Split</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 relative overflow-hidden">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>The Modern Indian Expense Splitter</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-950 tracking-tight leading-[1.08]">
            Split the bill.<br className="hidden sm:inline" />
            <span className="text-indigo-600"> Nobody installs an app.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Create a split in 30 seconds. Share 1 link on WhatsApp. Your friends tap their name and pay directly to your UPI ID via Google Pay, PhonePe, or Paytm with the exact amount pre-filled.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link 
              href={user ? "/split/new" : "/login"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-bold bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-2xl shadow-lg shadow-indigo-200 transition-all cursor-pointer"
            >
              <span>{user ? "Create a New Split" : "Create a Split — It's Free"}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a 
              href="#demo" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 rounded-2xl shadow-xs transition-all"
            >
              <span>See How Friends Pay</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Social Proof / Guarantee Strip */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero App Installs for Friends</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Direct Bank-to-Bank UPI</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Real-Time Payment Sync</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Mockup & Playground Section */}
      <section id="demo" className="py-12 sm:py-20 px-4 sm:px-6 bg-white border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Interactive Preview
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              This is what your friends actually see
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              No login walls, no ads, no friction. Tap any participant below to see how easy payment is.
            </p>
          </div>

          {/* Mockup Card Container */}
          <div className="max-w-md mx-auto bg-slate-50 rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xl shadow-slate-100 space-y-4">
            
            {/* Header of the mock split */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs text-center space-y-2">
              <div className="inline-block px-3 py-1 bg-amber-50 text-amber-800 text-[11px] font-extrabold rounded-full uppercase tracking-wider border border-amber-200/60">
                Dinner & Drinks
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Friday Night at Social
              </h3>
              <div className="text-3xl font-black text-slate-900">
                ₹3,600.00
              </div>
              <div className="text-xs font-semibold text-slate-500">
                Organized by <span className="text-slate-900 font-bold">Adarsh</span> • UPI: <span className="font-mono text-emerald-700 font-bold">adarsh@okhdfcbank</span>
              </div>
            </div>

            {/* Live Progress Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600 uppercase tracking-wider">Settlement Progress</span>
                <span className="text-emerald-700">
                  {Object.values(demoPaid).filter(Boolean).length} of 3 Paid
                </span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${(Object.values(demoPaid).filter(Boolean).length / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Mock Participant List */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center px-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Participants</span>
                <span className="text-[11px] text-indigo-600 font-semibold">Interactive — tap to toggle</span>
              </div>

              {/* Participant 1 */}
              <div 
                onClick={() => toggleDemoPaid("1")}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm">
                    A
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Aman Sharma</p>
                    <p className="font-extrabold text-slate-800 text-xs">₹1,200.00</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {demoPaid["1"] ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      <Clock className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                </div>
              </div>

              {/* Participant 2 (Interactive Open Drawer) */}
              <div className="bg-white rounded-2xl border-2 border-indigo-600 shadow-sm overflow-hidden">
                <div 
                  onClick={() => toggleDemoPaid("2")}
                  className="p-4 flex items-center justify-between cursor-pointer bg-indigo-50/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center text-sm">
                      P
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Priya Verma</p>
                      <p className="font-extrabold text-slate-900 text-xs">₹1,200.00</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {demoPaid["2"] ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <Clock className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Simulated Payment Action Drawer */}
                {!demoPaid["2"] && (
                  <div className="p-4 pt-2 border-t border-indigo-100 bg-slate-50/80 space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert("In live split, this launches Google Pay with ₹1,200 pre-filled to adarsh@okhdfcbank!");
                        }}
                        className="py-2.5 px-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-2xs transition-all text-center"
                      >
                        Google Pay
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert("In live split, this launches PhonePe with ₹1,200 pre-filled to adarsh@okhdfcbank!");
                        }}
                        className="py-2.5 px-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-2xs transition-all text-center"
                      >
                        PhonePe
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert("In live split, this launches Paytm with ₹1,200 pre-filled to adarsh@okhdfcbank!");
                        }}
                        className="py-2.5 px-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-2xs transition-all text-center"
                      >
                        Paytm
                      </button>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Or Copy UPI ID:</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            copyDemoVPA();
                          }}
                          className="font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                        >
                          {copiedVPA ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedVPA ? "Copied!" : "adarsh@okhdfcbank"}</span>
                        </button>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={() => toggleDemoPaid("2")}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                    >
                      Simulate "I&apos;ve Paid" Tap
                    </button>
                  </div>
                )}
              </div>

              {/* Participant 3 (Self / Creator) */}
              <div 
                onClick={() => toggleDemoPaid("3")}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-black flex items-center justify-center text-sm">
                    You
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Adarsh (Organizer)</p>
                    <p className="font-extrabold text-slate-800 text-xs">₹1,200.00</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Paid (Organizer)
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-center text-slate-500 font-medium pt-1">
              ✨ As friends pay on their phone, the organizer&apos;s screen updates in real time.
            </p>
          </div>
        </div>
      </section>

      {/* Real-Life Comparison Section */}
      <section id="compare" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              The Reality Check
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Why group expense splitting has been broken
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Here is how SplitKaro compares to the clumsy alternatives we all suffer through today.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Splitwise Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-lg">
                ✕
              </div>
              <h3 className="text-lg font-black text-slate-900">Splitwise</h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span>Requires <strong>everyone</strong> to download an app and create an account.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span>Forces 10-second countdown ads on free tier.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span>Doesn&apos;t initiate UPI payments directly in India.</span>
                </li>
              </ul>
            </div>

            {/* WhatsApp Screenshots Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
                ⚠️
              </div>
              <h3 className="text-lg font-black text-slate-900">WhatsApp Screenshots</h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold shrink-0">✕</span>
                  <span>"Bro how much do I owe?" repeated 15 times in the group.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold shrink-0">✕</span>
                  <span>Lost screenshot proofs and manual math errors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold shrink-0">✕</span>
                  <span>Friends forget or transfer wrong partial amounts.</span>
                </li>
              </ul>
            </div>

            {/* SplitKaro Card */}
            <div className="bg-indigo-900 text-white rounded-3xl p-6 shadow-xl shadow-indigo-100 space-y-4 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/30 text-emerald-400 flex items-center justify-center font-bold text-lg">
                ✓
              </div>
              <h3 className="text-lg font-black text-white">SplitKaro</h3>
              <ul className="space-y-3 text-xs sm:text-sm text-indigo-100">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>Zero downloads for friends.</strong> Just open the web link.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>Auto-prefills exact amount</strong> in GPay, PhonePe, or Paytm.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>Live real-time dashboard</strong> shows instant payment status.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Simple 3-Step Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              From receipt to settlement in 2 minutes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <span className="font-mono text-3xl font-black text-indigo-600 block">01</span>
              <h4 className="text-lg font-bold text-slate-900">Create the Split</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Enter the bill amount, pick friends, and choose equal, exact, or percentage splitting. Your UPI ID is linked automatically.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <span className="font-mono text-3xl font-black text-indigo-600 block">02</span>
              <h4 className="text-lg font-bold text-slate-900">Share 1 WhatsApp Link</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Click the 1-tap WhatsApp button to post the smart link to your group. Everyone accesses the bill without signing up.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <span className="font-mono text-3xl font-black text-indigo-600 block">03</span>
              <h4 className="text-lg font-bold text-slate-900">Friends Tap & Pay via UPI</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Friends tap their name. Their UPI app opens with your UPI ID and their exact amount pre-filled. You receive money directly in your bank.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Calculator / Try it widget */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-md">
              <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full">
                Try Quick Math
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Calculate an upcoming bill right now
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                See how effortless splitting is when everyone pays their exact share directly to your UPI.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm w-full md:w-80 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Bill Amount (₹)
                </label>
                <input 
                  type="number"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  People Splitting ({calcPeople})
                </label>
                <input 
                  type="range"
                  min="2"
                  max="12"
                  value={calcPeople}
                  onChange={(e) => setCalcPeople(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500">Each person pays:</span>
                <span className="text-2xl font-black text-indigo-600">₹{perPerson}</span>
              </div>

              <Link 
                href={user ? "/split/new" : "/login"}
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <span>Create this Split &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Answers & Assurance
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <h4 className="font-bold text-slate-900 text-base">
                Do my friends need to create an account or download an app?
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                No. They only open the link you share in their browser. They tap their name and their existing UPI app (Google Pay, PhonePe, Paytm, BHIM) opens directly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <h4 className="font-bold text-slate-900 text-base">
                Does SplitKaro hold or touch my money?
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Never. SplitKaro has zero custody over any money. We generate standard NPCI-compliant UPI payment intents. Money travels directly peer-to-peer from your friend&apos;s bank account to your bank account via UPI.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <h4 className="font-bold text-slate-900 text-base">
                What if a bank blocks browser links due to UPI risk policy?
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                We have built-in native app schemes for PhonePe, Paytm, and Google Pay, plus 1-tap &ldquo;Copy UPI ID&rdquo; buttons and on-screen QR codes so payments never fail.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <h4 className="font-bold text-slate-900 text-base">
                Is SplitKaro really free forever?
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Yes. Since we leverage India&apos;s free public UPI infrastructure and don&apos;t process transactions through expensive third-party payment gateways, SplitKaro is completely free with zero commission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-900 text-white text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready to split your next bill?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            No more awkward follow-up texts. Create your first split in 30 seconds.
          </p>
          <div className="pt-2">
            <Link 
              href={user ? "/split/new" : "/login"}
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-base shadow-lg transition-all cursor-pointer"
            >
              <span>{user ? "Go to Dashboard" : "Get Started Now"}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 bg-slate-950 text-slate-500 text-xs border-t border-slate-900">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-300">
            <span className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs font-black">
              ₹
            </span>
            <span>SplitKaro</span>
            <span className="text-slate-600 font-normal">
              • Built for India&apos;s UPI Ecosystem
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
            <span>•</span>
            <Link href="/create" className="hover:text-white transition-colors">Create Split</Link>
            <span>•</span>
            <a href="#demo" className="hover:text-white transition-colors">Demo</a>
          </div>

          <p>&copy; {new Date().getFullYear()} SplitKaro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
