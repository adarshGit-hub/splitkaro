"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Split } from '@/types';
import Link from 'next/link';
import { PlusCircle, IndianRupee, Clock, CheckCircle, Receipt } from 'lucide-react';
// import SplitCard from '@/components/split/SplitCard';

const supabase = createClient();

export default function DashboardPage() {
  const [splits, setSplits] = useState<Split[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'settled'>('all');

  useEffect(() => {
    let isMounted = true;
    const fetchSplits = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !isMounted) {
          if (isMounted) setSplits([]);
          return;
        }

        const { data, error } = await supabase
          .from('splits')
          .select('*')
          .eq('creator_id', user.id)
          .order('created_at', { ascending: false });

        if (data && !error && isMounted) {
          setSplits(data);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSplits();
    return () => { isMounted = false; };
  }, []);

  const filteredSplits = splits.filter(s => {
    if (filter === 'active') return s.is_settled === false;
    if (filter === 'settled') return s.is_settled === true;
    return true;
  });

  const totalCollected = splits.filter(s => s.is_settled === true).reduce((sum, s) => sum + Number(s.total_amount), 0);
  const totalPending = splits.filter(s => s.is_settled === false).reduce((sum, s) => sum + Number(s.total_amount), 0);

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
          <p className="text-2xl font-bold text-green-700">₹{totalCollected}</p>
        </div>
        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 shadow-sm col-span-2 md:col-span-1">
          <div className="flex items-center text-amber-600 mb-2">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-xs font-medium uppercase tracking-wider">Pending</span>
          </div>
          <p className="text-2xl font-bold text-amber-700">₹{totalPending}</p>
        </div>
      </div>

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

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredSplits.length > 0 ? (
        <div className="space-y-4">
          {filteredSplits.map(split => (
            <div key={split.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{split.title}</h3>
                <p className="text-sm text-gray-500">₹{Number(split.total_amount)}</p>
              </div>
              <Link href={`/split/${split.id}`} className="text-sm text-indigo-600 font-medium px-3 py-1.5 bg-indigo-50 rounded-lg hover:bg-indigo-100">
                View
              </Link>
            </div>
            // <SplitCard key={split.id} split={split} />
          ))}
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
