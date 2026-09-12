'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSplit } from '@/hooks/useSplit';
import { Share2, CheckCircle, Clock, ArrowLeft, Trash2, IndianRupee, MessageCircle, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import { shareLink, generateWhatsAppLink, copyToClipboard } from '@/lib/share';
import { generateUPIQR } from '@/lib/qr';
import { generateUPILink } from '@/lib/upi';
import Image from 'next/image';

const supabase = createClient();

export default function SplitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { getSplit, deleteSplit } = useSplit();
  
  const [split, setSplit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    fetchSplitData();
  }, [id]);

  const fetchSplitData = async () => {
    const data = await getSplit(id);
    if (data) {
      setSplit(data);
      // Use collector_upi_id from split first, then fallback to profile
      const payeeVPA = data.collector_upi_id || data.profiles?.upi_id;
      const payeeName = data.collector_name || data.profiles?.name || '';
      if (payeeVPA) {
        generateUPIQR({ payeeVPA, payeeName, amount: Number(data.total_amount), note: `Split: ${data.title}` }).then(setQrCodeUrl);
      }
    }
    setLoading(false);
  };

  const handleTogglePaid = async (participantId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('participants')
      .update({ 
        has_paid: !currentStatus,
        paid_at: !currentStatus ? new Date().toISOString() : null,
        marked_paid_by: !currentStatus ? 'collector' : null,
      })
      .eq('id', participantId);
      
    if (!error) {
      setSplit((prev: any) => ({
        ...prev,
        participants: prev.participants.map((p: any) => 
          p.id === participantId ? { ...p, has_paid: !currentStatus, paid_at: !currentStatus ? new Date().toISOString() : null, marked_paid_by: !currentStatus ? 'collector' : null } : p
        )
      }));
    }
  };

  const handleMarkAsSettled = async () => {
    const { error } = await supabase
      .from('splits')
      .update({ is_settled: true })
      .eq('id', id);
    if (!error) {
      setSplit((prev: any) => ({ ...prev, is_settled: true }));
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this split? This cannot be undone.')) {
      setIsDeleting(true);
      try {
        await deleteSplit(id);
        router.push('/dashboard');
      } catch (err) {
        console.error('Delete failed:', err);
      }
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  if (!split) {
    return <div className="text-center py-12">Split not found</div>;
  }

  const shareUrl = `${origin}/s/${split.share_slug}`;
  const shareText = `Pay your share for "${split.title}" (Total: ₹${Number(split.total_amount)}) using SplitKaro:`;

  const totalParticipants = split.participants?.length || 0;
  const paidParticipants = split.participants?.filter((p: any) => p.has_paid).length || 0;
  const isAllPaid = paidParticipants === totalParticipants && totalParticipants > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Split Info Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mb-3">
          {split.category}
        </span>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{split.title}</h1>
        <p className="text-sm text-gray-500 mb-6">{format(new Date(split.created_at), 'MMMM d, yyyy')}</p>
        
        <div className="flex items-center justify-center gap-1 text-4xl font-extrabold text-gray-900 mb-4">
          <IndianRupee className="w-8 h-8" />
          {Number(split.total_amount).toFixed(2)}
        </div>

        <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
          <div 
            className="bg-indigo-600 h-full transition-all duration-500 rounded-full"
            style={{ width: `${totalParticipants > 0 ? (paidParticipants/totalParticipants)*100 : 0}%` }}
          />
        </div>
        <p className="text-sm font-medium text-gray-600">
          {paidParticipants} of {totalParticipants} paid
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => setShowShareOptions(!showShareOptions)}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          <Share2 className="w-5 h-5" /> Share Request
        </button>
        {split.is_settled !== true && isAllPaid ? (
          <button 
            onClick={handleMarkAsSettled}
            className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="w-5 h-5" /> Mark Settled
          </button>
        ) : (
          <button 
            disabled
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-400 py-3 rounded-xl font-medium"
          >
            {split.is_settled === true ? 'Settled' : 'Waiting for payments'}
          </button>
        )}
      </div>

      {/* Share Options Drawer/Section */}
      {showShareOptions && (
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm animate-in slide-in-from-top-2">
          <h3 className="font-semibold mb-4 text-gray-800">Share via</h3>
          <div className="grid grid-cols-3 gap-4">
            <button 
              onClick={() => {
                const url = generateWhatsAppLink(`${shareText} ${shareUrl}`);
                window.open(url, '_blank');
              }}
              className="flex flex-col items-center gap-2 text-green-600 hover:bg-green-50 p-3 rounded-xl transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs font-medium">WhatsApp</span>
            </button>
            <button 
              onClick={() => {
                copyToClipboard(shareUrl);
                alert('Link copied to clipboard!');
              }}
              className="flex flex-col items-center gap-2 text-indigo-600 hover:bg-indigo-50 p-3 rounded-xl transition-colors"
            >
              <LinkIcon className="w-6 h-6" />
              <span className="text-xs font-medium">Copy Link</span>
            </button>
            <button 
              onClick={() => {
                shareLink({ text: shareText, url: shareUrl, title: 'SplitKaro' });
              }}
              className="flex flex-col items-center gap-2 text-gray-600 hover:bg-gray-50 p-3 rounded-xl transition-colors"
            >
              <Share2 className="w-6 h-6" />
              <span className="text-xs font-medium">More</span>
            </button>
          </div>
          
          {qrCodeUrl && (
            <div className="mt-6 text-center border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-500 mb-2">Or show QR Code to scan & pay directly via UPI</p>
              <div className="inline-block p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                <Image src={qrCodeUrl} alt="UPI QR Code" width={150} height={150} className="mx-auto" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Participants List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Participants</h2>
          <span className="text-sm text-gray-500">{totalParticipants} people</span>
        </div>
        <div className="divide-y divide-gray-100">
          {split.participants?.map((p: any) => (
            <div key={p.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{p.name}</p>
                <p className="text-sm font-semibold text-gray-700">₹{Number(p.amount_owed).toFixed(2)}</p>
              </div>
              <button
                onClick={() => handleTogglePaid(p.id, p.has_paid)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  p.has_paid 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                }`}
              >
                {p.has_paid ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                {p.has_paid ? 'Paid' : 'Pending'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
