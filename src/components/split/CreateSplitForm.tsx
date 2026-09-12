'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Receipt, IndianRupee, Users, Percent, Equal, Tag, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSplit } from '@/hooks/useSplit';
import { useAuth } from '@/hooks/useAuth';
import { FriendsPicker } from '@/components/friends/FriendsPicker';

const CATEGORIES = [
  { name: 'Food', icon: '🍕' },
  { name: 'Travel', icon: '✈️' },
  { name: 'Shopping', icon: '🛍️' },
  { name: 'Bills', icon: '📄' },
  { name: 'Entertainment', icon: '🍿' },
  { name: 'Other', icon: '✨' },
];

const UPI_REGEX = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

interface FormParticipant {
  id: string;
  name: string;
  amount: number;
  percent?: number;
  isSelf?: boolean;
}

export function CreateSplitForm() {
  const router = useRouter();
  const { createSplit } = useSplit();
  const { profile } = useAuth();
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  
  const [collectorUpiId, setCollectorUpiId] = useState('');
  const [collectorName, setCollectorName] = useState('');
  const [includeYourself, setIncludeYourself] = useState(true);
  
  const [participants, setParticipants] = useState<FormParticipant[]>([
    { id: 'self', name: 'You', isSelf: true, amount: 0, percent: 0 }
  ]);
  const [splitType, setSplitType] = useState<'equal' | 'exact' | 'percentage'>('equal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Auto-populate from logged-in profile
  useEffect(() => {
    if (profile) {
      if (profile.upi_id && !collectorUpiId) {
        setCollectorUpiId(profile.upi_id);
      }
      if (profile.name && !collectorName) {
        setCollectorName(profile.name);
        setParticipants(prev => prev.map(p => p.isSelf ? { ...p, name: profile.name } : p));
      }
    }
  }, [profile]);

  // Re-calculate amounts when split type, total amount, or active participants change
  useEffect(() => {
    const totalAmount = parseFloat(amount) || 0;
    const active = participants.filter(p => !p.isSelf || includeYourself);
    
    if (active.length === 0) return;

    if (splitType === 'equal') {
      const splitAmount = +(totalAmount / active.length).toFixed(2);
      const diff = +(totalAmount - (splitAmount * active.length)).toFixed(2);
      
      // Fix: move counter inside updater to avoid StrictMode double-invoke issue
      setParticipants(prev => {
        let activeCounter = 0;
        return prev.map(p => {
          if (p.isSelf && !includeYourself) return { ...p, amount: 0 };
          const amt = activeCounter === 0 ? +(splitAmount + diff).toFixed(2) : splitAmount;
          activeCounter++;
          return { ...p, amount: amt };
        });
      });
    } else if (splitType === 'percentage') {
      // When switching to percentage, initialize with equal percentages if all are 0
      const allZero = active.every(p => !p.percent || p.percent === 0);
      const defaultPercent = allZero ? +(100 / active.length).toFixed(1) : 0;
      
      setParticipants(prev => prev.map(p => {
        if (p.isSelf && !includeYourself) return { ...p, amount: 0, percent: 0 };
        const pct = (p.percent && p.percent > 0) ? p.percent : defaultPercent;
        return {
          ...p,
          percent: pct,
          amount: +((totalAmount * pct) / 100).toFixed(2)
        };
      }));
    }
  }, [amount, splitType, includeYourself, participants.length]);

  const handleAddParticipant = (name: string) => {
    const cleanName = name.trim();
    if (!cleanName) return;
    if (participants.some(p => p.name.toLowerCase() === cleanName.toLowerCase())) return;
    
    setParticipants(prev => [
      ...prev, 
      { id: `friend-${Date.now()}-${cleanName}`, name: cleanName, isSelf: false, amount: 0, percent: 0 }
    ]);
  };

  const handleRemoveParticipant = (name: string) => {
    setParticipants(prev => prev.filter(p => p.name !== name));
  };

  const handleUpdateExactAmount = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, amount: numValue } : p));
  };

  const handleUpdatePercentage = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const totalAmount = parseFloat(amount) || 0;
    setParticipants(prev => prev.map(p => p.id === id ? { 
      ...p, 
      percent: numValue,
      amount: +((totalAmount * numValue) / 100).toFixed(2)
    } : p));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const activeParticipants = participants.filter(p => !p.isSelf || includeYourself);
    const otherParticipants = participants.filter(p => !p.isSelf);
    
    if (!title.trim()) return setError('Please enter a description for the expense');
    if (!amount || parseFloat(amount) <= 0) return setError('Please enter a valid total amount');
    if (!collectorUpiId.trim()) return setError('Please provide your UPI ID so friends can pay you');
    if (!UPI_REGEX.test(collectorUpiId.trim())) return setError('Please enter a valid UPI ID (e.g. username@okhdfcbank or 9876543210@paytm)');
    if (otherParticipants.length < 1) return setError('Please add at least one friend to split with');

    const totalAmount = parseFloat(amount);
    const sum = activeParticipants.reduce((acc, p) => acc + p.amount, 0);

    if (Math.abs(sum - totalAmount) > 0.1) {
      return setError(`Amounts must sum up to ₹${totalAmount.toFixed(2)}. Currently the sum is ₹${sum.toFixed(2)}`);
    }

    if (splitType === 'percentage') {
      const sumPercent = activeParticipants.reduce((acc, p) => acc + (p.percent || 0), 0);
      if (Math.abs(sumPercent - 100) > 0.1) {
        return setError('Percentages must sum up to exactly 100%');
      }
    }

    // Use actual name, never literal "You"
    const actualCollectorName = collectorName.trim() || profile?.name || 'Organizer';

    setIsSubmitting(true);
    try {
      const split = await createSplit({
        title,
        total_amount: totalAmount,
        split_type: splitType,
        category,
        collector_upi_id: collectorUpiId.trim() || undefined,
        collector_name: actualCollectorName,
        participants: activeParticipants.map(p => ({ 
          name: p.isSelf ? actualCollectorName : p.name, 
          amount_owed: p.amount 
        }))
      });
      
      if (split) {
        // Redirect creator to their management view, not the public payer page
        router.push(`/split/${split.id}`);
      } else {
        setError('Failed to create split. Please check your connection.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the split');
    }
    setIsSubmitting(false);
  };

  const activeParticipants = participants.filter(p => !p.isSelf || includeYourself);
  const friendsList = participants.filter(p => !p.isSelf);
  const totalAmountNum = parseFloat(amount) || 0;
  const currentSum = activeParticipants.reduce((acc, p) => acc + p.amount, 0);
  const isSumMatched = Math.abs(currentSum - totalAmountNum) <= 0.1 && totalAmountNum > 0;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-7">
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-sm font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-600"></span>
          {error}
        </div>
      )}

      {/* Section 1: Bill Basic Info */}
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-indigo-600" /> What is this expense for?
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Goa Trip, Friday Dinner, Flat Groceries"
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-slate-900 font-semibold text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-2xs"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-600" /> Total Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 font-black text-lg">₹</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-9 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-slate-900 font-black text-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-2xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4 text-purple-600" /> Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-2xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-2xs"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.name} value={cat.name} className="text-slate-900">
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Receiving Money Details */}
      <div className="border-t border-slate-200 pt-6 space-y-4">
        <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded font-black">UPI</span>
              Where should friends pay you?
            </span>
            <span className="text-[11px] font-semibold text-emerald-700">Auto-prefilled in UPI apps</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                value={collectorUpiId}
                onChange={e => setCollectorUpiId(e.target.value)}
                placeholder="Your UPI ID (e.g. name@okhdfcbank)"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-2xs"
                required
              />
            </div>
            <div>
              <input
                type="text"
                value={collectorName}
                onChange={e => { 
                  const newName = e.target.value;
                  setCollectorName(newName); 
                  setParticipants(prev => prev.map(p => p.isSelf ? { ...p, name: newName || 'You' } : p));
                }}
                placeholder="Your Name (e.g. Adarsh)"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-2xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Participants */}
      <div className="border-t border-slate-200 pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" /> Split With
          </label>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors">
            <input 
              type="checkbox" 
              checked={includeYourself} 
              onChange={e => setIncludeYourself(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            />
            Include yourself ({collectorName || 'You'})
          </label>
        </div>
        
        <FriendsPicker 
          selectedParticipants={friendsList} 
          onAdd={handleAddParticipant}
          onRemove={handleRemoveParticipant}
        />
      </div>

      {/* Section 4: Split Calculation Breakdown */}
      {activeParticipants.length > 0 && totalAmountNum > 0 && (
        <div className="border-t border-slate-200 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">How to split?</label>
            {isSumMatched && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ₹{totalAmountNum.toFixed(2)} Balanced
              </span>
            )}
          </div>
          
          {/* Split Mode Buttons */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {(['equal', 'exact', 'percentage'] as const).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setSplitType(type)}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  splitType === type 
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/60' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type === 'equal' && <Equal className="w-3.5 h-3.5" />}
                {type === 'exact' && <IndianRupee className="w-3.5 h-3.5" />}
                {type === 'percentage' && <Percent className="w-3.5 h-3.5" />}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Breakdown Rows */}
          <div className="space-y-2 pt-1">
            {activeParticipants.map((p) => (
              <div 
                key={p.id} 
                className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{p.name}</span>
                    {p.isSelf && (
                      <span className="ml-2 text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold">You (Collector)</span>
                    )}
                  </div>
                </div>

                {splitType === 'equal' && (
                  <span className="font-extrabold text-slate-900 text-base">
                    ₹{p.amount.toFixed(2)}
                  </span>
                )}

                {splitType === 'exact' && (
                  <div className="relative w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      value={p.amount || ''}
                      onChange={e => handleUpdateExactAmount(p.id, e.target.value)}
                      className="w-full pl-7 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-right font-bold text-slate-900 text-sm focus:ring-2 focus:ring-indigo-600"
                      placeholder="0.00"
                    />
                  </div>
                )}

                {splitType === 'percentage' && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-600">₹{p.amount.toFixed(2)}</span>
                    <div className="relative w-24">
                      <input
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        value={p.percent || ''}
                        onChange={e => handleUpdatePercentage(p.id, e.target.value)}
                        className="w-full pr-7 pl-3 py-1.5 bg-white border border-slate-300 rounded-xl text-right font-bold text-slate-900 text-sm focus:ring-2 focus:ring-indigo-600"
                        placeholder="0"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">%</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || friendsList.length === 0 || !amount || !collectorUpiId}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold py-4 rounded-2xl transition-all shadow-md shadow-indigo-200 disabled:opacity-40 disabled:cursor-not-allowed text-base cursor-pointer"
      >
        {isSubmitting ? (
          'Generating Split Link...'
        ) : (
          <>
            <span>Create Split & Generate QR Link</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
}
