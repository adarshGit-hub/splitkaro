"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useRealtimeParticipants } from '@/hooks/useRealtime';
import { Split, Participant } from '@/types';
import { generateUPILink } from '@/lib/upi';
import { generateQRDataURL } from '@/lib/qr';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, Smartphone, Info, QrCode, Share2, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const supabase = createClient();

export default function SettlementPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [split, setSplit] = useState<Split | null>(null);
  const [loadingSplit, setLoadingSplit] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    const fetchSplit = async () => {
      const { data, error } = await supabase
        .from('splits')
        .select('*')
        .eq('share_slug', slug)
        .single();
      
      if (data && !error && isMounted) {
        setSplit(data);
      }
      if (isMounted) setLoadingSplit(false);
    };
    fetchSplit();

    return () => { isMounted = false; };
  }, [slug]);

  const { participants, loading: loadingParticipants } = useRealtimeParticipants(split?.id || null);

  const handleMarkPaid = async (participantId: string) => {
    const { error } = await supabase
      .from('participants')
      .update({ has_paid: true, marked_paid_by: 'self', paid_at: new Date().toISOString() })
      .eq('id', participantId);
    if (error) {
      alert('Failed to update payment status. Please try again.');
    }
  };

  const getQRCode = async (participant: Participant) => {
    if (!split) return;
    if (qrCode[participant.id]) return qrCode[participant.id];
    
    const upiLink = generateUPILink({
      payeeVPA: split.collector_upi_id || '',
      payeeName: split.collector_name || '',
      amount: participant.amount_owed,
      note: `SplitKaro: ${split.title}`,
    });
    
    const qr = await generateQRDataURL(upiLink);
    setQrCode((prev) => ({ ...prev, [participant.id]: qr }));
    return qr;
  };

  if (loadingSplit || loadingParticipants) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading Bill...</p>
        </div>
      </div>
    );
  }

  if (!split) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mb-4">
          <Info className="h-8 w-8 text-rose-500" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Split Not Found</h1>
        <p className="text-slate-600 text-sm mb-6 max-w-sm">The bill you are looking for does not exist or the link has expired.</p>
        <Link href="/" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-colors shadow-sm">
          Go to SplitKaro Home
        </Link>
      </div>
    );
  }

  const paidCount = participants.filter(p => p.has_paid).length;
  const progressPercent = participants.length > 0 ? (paidCount / participants.length) * 100 : 0;
  const totalPaidAmount = participants.filter(p => p.has_paid).reduce((acc, p) => acc + Number(p.amount_owed), 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Brand Bar */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-base font-black text-indigo-600 tracking-tight">
            SplitKaro
          </Link>
          <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Sync</span>
          </div>
        </div>
      </header>

      <div className="max-w-md w-full mx-auto flex-1 flex flex-col p-4 pb-20 space-y-5">
        {/* Bill Summary Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-2">
          <div className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-extrabold rounded-full uppercase tracking-wider">
            {split.category || 'Bill Split'}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {split.title}
          </h1>
          <div className="text-4xl font-black text-slate-900 tracking-tight">
            ₹{Number(split.total_amount).toLocaleString('en-IN')}
          </div>
          <div className="text-xs font-semibold text-slate-500 pt-1">
            Organized by <span className="text-slate-900 font-bold">{split.collector_name}</span>
            {split.collector_upi_id && (
              <span className="block text-[11px] text-emerald-700 font-mono mt-0.5 font-bold">
                UPI: {split.collector_upi_id}
              </span>
            )}
          </div>
        </div>

        {/* Live Progress Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-600 uppercase tracking-wider">Collection Progress</span>
            <span className="text-emerald-700 font-extrabold">
              ₹{totalPaidAmount.toFixed(0)} of ₹{Number(split.total_amount).toFixed(0)} ({paidCount}/{participants.length} paid)
            </span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Participant List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Tap your name to pay
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">Auto-prefills UPI</span>
          </div>

          {participants.map((p) => {
            const isExpanded = expandedId === p.id;
            const upiLink = generateUPILink({
              payeeVPA: split.collector_upi_id || '',
              payeeName: split.collector_name || '',
              amount: p.amount_owed,
              note: `SplitKaro: ${split.title}`,
            });

            return (
              <div 
                key={p.id}
                className={cn(
                  "bg-white rounded-2xl border transition-all overflow-hidden shadow-xs",
                  p.has_paid 
                    ? "border-slate-200/80 bg-slate-50/40 opacity-90" 
                    : isExpanded 
                    ? "border-indigo-600 ring-2 ring-indigo-100" 
                    : "border-slate-200 hover:border-slate-300 cursor-pointer"
                )}
                onClick={() => {
                  if (!p.has_paid) {
                    setExpandedId(isExpanded ? null : p.id);
                    if (!isExpanded) getQRCode(p);
                  }
                }}
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full font-bold flex items-center justify-center text-sm shadow-2xs",
                      p.has_paid 
                        ? "bg-emerald-100 text-emerald-800" 
                        : "bg-indigo-600 text-white"
                    )}>
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-base">{p.name}</p>
                      <p className="font-extrabold text-slate-900 text-sm">
                        ₹{Number(p.amount_owed).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {p.has_paid ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <Clock className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                    {!p.has_paid && (
                      <span className="text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded Payment Drawer */}
                {isExpanded && !p.has_paid && (
                  <div className="px-5 pb-5 pt-3 border-t border-slate-100 bg-slate-50/70 space-y-4">
                    <div className="flex flex-col items-center">
                      {qrCode[p.id] ? (
                        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm mb-3">
                          <Image 
                            src={qrCode[p.id]} 
                            alt={`UPI QR code for ${p.name}`} 
                            width={180} 
                            height={180} 
                            className="rounded-xl"
                          />
                        </div>
                      ) : (
                        <div className="h-44 w-44 bg-slate-200 animate-pulse rounded-2xl mb-3"></div>
                      )}
                      
                      <p className="text-xs font-semibold text-slate-600 text-center max-w-xs">
                        Scan with Google Pay, PhonePe, Paytm, or BHIM to pay <span className="text-slate-900 font-bold">{split.collector_name}</span>
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      <a 
                        href={upiLink}
                        className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-200 transition-all cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>Pay ₹{Number(p.amount_owed).toFixed(2)} via UPI App</span>
                      </a>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkPaid(p.id);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>I&apos;ve already paid</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-400 pt-4">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Peer-to-peer UPI transfer. No fees, no middlemen.</span>
        </div>
      </div>
      
      <footer className="py-6 text-center text-xs font-semibold text-slate-400">
        Built with{' '}
        <Link href="/" className="text-indigo-600 hover:underline font-bold">
          SplitKaro
        </Link>
        {' '}— Friends never install anything.
      </footer>
    </div>
  );
}
