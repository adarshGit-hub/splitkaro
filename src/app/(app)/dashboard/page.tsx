"use client";

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Split } from '@/types';
import Link from 'next/link';
import { PlusCircle, Clock, CheckCircle, Receipt, ChevronRight } from 'lucide-react';

const supabase = createClient();

export default function DashboardPage() {
  const [splits, setSplits] = useState<Split[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'settled'>('all');

  const fetchSplits = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSplits([]);
        return;
      }

      const { data, error } = await supabase
        .from('splits')
        .select('*, participants(*)')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (data && !error) {
        setSplits(data as Split[]);
      }
    } catch (err) {
      console.error('Error fetching dashboard splits:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetchSplits();

    // Setup Supabase Realtime subscriptions for live dashboard updates
    const channel = supabase
      .channel('dashboard-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'participants' },
        () => {
          if (isMounted) fetchSplits();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'splits' },
        () => {
          if (isMounted) fetchSplits();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [fetchSplits]);

  const filteredSplits = splits.filter(s => {
    if (filter === 'active') return s.is_settled === false;
    if (filter === 'settled') return s.is_settled === true;
    return true;
  });

  // Calculate actual collected amount based on participant payments + settled status
  const totalCollected = splits.reduce((sum, s) => {
    if (s.is_settled) return sum + Number(s.total_amount);
    const paidSum = s.participants
      ?.filter(p => p.has_paid)
      .reduce((acc, p) => acc + Number(p.amount_owed), 0) || 0;
    return sum + paidSum;
  }, 0);

  // Calculate actual pending amount based on unpaid participants for unsettled splits
  const totalPending = splits.reduce((sum, s) => {
    if (s.is_settled) return sum;
    const unpaidSum = s.participants
      ?.filter(p => !p.has_paid)
      .reduce((acc, p) => acc + Number(p.amount_owed), 0) || 0;
    return sum + unpaidSum;
  }, 0);

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 pb-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back</p>
        </div>
        <Link 
          href="/split/new" 
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          New Split
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center text-gray-500 mb-2">
            <Receipt className="w-4 h-4 mr-2" />
            <span className="text-xs font-medium uppercase tracking-wider">Total Splits</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{splits.length}</p>
        </div>
        <div className="bg-green-50 p-5 rounded-2xl border border-green-100 shadow-sm">
          <div className="flex items-center text-green-600 mb-2">
            <CheckCircle className="w-4 h-4 mr-2" />
            <span className="text-xs font-medium uppercase tracking-wider">Collected</span>
          </div>
          <p className="text-2xl font-bold text-green-700">₹{totalCollected.toFixed(0)}</p>
        </div>
        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 shadow-sm col-span-2 md:col-span-1">
          <div className="flex items-center text-amber-600 mb-2">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-xs font-medium uppercase tracking-wider">Pending</span>
          </div>
          <p className="text-2xl font-bold text-amber-700">₹{totalPending.toFixed(0)}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex space-x-2 border-b border-gray-200 pb-px">
          {(['all', 'active', 'settled'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                filter === f 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Splits List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredSplits.length > 0 ? (
        <div className="space-y-3">
          {filteredSplits.map(split => {
            const totalParts = split.participants?.length || 0;
            const paidParts = split.participants?.filter(p => p.has_paid).length || 0;
            const isAllPaid = totalParts > 0 && paidParts === totalParts;

            return (
              <Link 
                key={split.id} 
                href={`/split/${split.id}`}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md transition-all flex items-center justify-between group block"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {split.title}
                    </h3>
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600">
                      {split.category || 'Other'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="font-bold text-gray-900 text-sm">
                      ₹{Number(split.total_amount).toFixed(2)}
                    </span>
                    <span>•</span>
                    {split.is_settled ? (
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                        Settled
                      </span>
                    ) : isAllPaid ? (
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                        All {totalParts} Paid
                      </span>
                    ) : (
                      <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
                        {paidParts} of {totalParts} paid
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-indigo-600 font-medium px-3 py-1.5 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                    View
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 border-dashed">
          <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No splits found</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">Create your first split to start collecting payments from friends easily via UPI.</p>
          <Link href="/split/new" className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
            <PlusCircle className="w-5 h-5 mr-2" />
            Create Split
          </Link>
        </div>
      )}
    </div>
  );
}
