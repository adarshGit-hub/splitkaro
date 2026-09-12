"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { LedgerEntry } from '@/types';

const supabase = createClient();

export default function LedgerPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement real ledger data from ledger_entries table or aggregate from splits/participants
    const fetchLedger = async () => {
      setLoading(false);
    };
    fetchLedger();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 pb-24">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Ledger</h1>
        <p className="text-gray-500 text-sm">Your balances across all splits</p>
      </div>

      <div className="bg-indigo-600 text-white rounded-2xl p-6 shadow-sm mb-8 flex items-center justify-between">
        <div>
          <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider mb-1">Net Balance</p>
          <p className="text-3xl font-bold">₹0</p>
        </div>
        <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center">
          <Wallet className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
            <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
            Owed to You
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-500">
            No one owes you money right now.
          </div>
        </section>

        <section>
          <h2 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
            <TrendingDown className="w-5 h-5 text-red-500 mr-2" />
            You Owe
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-500">
            You don&apos;t owe anyone money right now.
          </div>
        </section>
      </div>
    </div>
  );
}
