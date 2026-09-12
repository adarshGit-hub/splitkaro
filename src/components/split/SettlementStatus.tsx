import { Participant } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock } from 'lucide-react';

interface SettlementStatusProps {
  participants: Participant[];
}

export default function SettlementStatus({ participants }: SettlementStatusProps) {
  const totalAmount = participants.reduce((sum, p) => sum + p.amount_owed, 0);
  const collectedAmount = participants.filter(p => p.has_paid).reduce((sum, p) => sum + p.amount_owed, 0);
  const pendingAmount = totalAmount - collectedAmount;
  
  const paidCount = participants.filter(p => p.has_paid).length;
  const progressPercent = participants.length > 0 ? (paidCount / participants.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <p className="text-xs text-green-600 font-medium mb-1 uppercase tracking-wider">Collected</p>
          <p className="text-2xl font-bold text-green-700">₹{collectedAmount}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
          <p className="text-xs text-amber-600 font-medium mb-1 uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-bold text-amber-700">₹{pendingAmount}</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-2 text-gray-600">
          <span>Settlement Progress</span>
          <span className="font-medium text-gray-900">{paidCount} of {participants.length} paid</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {participants.map(p => (
          <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-white">
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">{p.name}</span>
              <span className="text-sm text-gray-500">₹{p.amount_owed}</span>
            </div>
            <div>
              {p.has_paid ? (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Paid
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  Pending
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
