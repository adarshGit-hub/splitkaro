import React from 'react';
import Link from 'next/link';
import { Receipt, Users } from 'lucide-react';
import { Split } from '@/types';
import { format } from 'date-fns';

interface SplitCardProps {
  split: Split & { participants?: any[] };
}

export function SplitCard({ split }: SplitCardProps) {
  const participants = split.participants || [];
  const totalParticipants = participants.length;
  const paidCount = participants.filter(p => p.has_paid).length;
  const isSettled = split.is_settled === true || (totalParticipants > 0 && paidCount === totalParticipants);
  const percentPaid = totalParticipants > 0 ? (paidCount / totalParticipants) * 100 : 0;

  return (
    <Link href={`/split/${split.id}`}>
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{split.title}</h3>
              <p className="text-xs text-gray-500">{format(new Date(split.created_at), 'MMM d, yyyy')}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg text-gray-900">₹{split.total_amount.toFixed(2)}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isSettled ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
              {isSettled ? 'Settled' : 'Pending'}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 flex items-center gap-1">
              <Users className="w-4 h-4" /> {totalParticipants} people
            </span>
            <span className="text-gray-700 font-medium">{paidCount} of {totalParticipants} paid</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${isSettled ? 'bg-green-500' : 'bg-indigo-500'}`}
              style={{ width: `${percentPaid}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
