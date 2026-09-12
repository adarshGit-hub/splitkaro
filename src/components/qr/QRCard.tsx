"use client";

import QRGenerator from './QRGenerator';
import { generateUPILink } from '@/lib/upi';

interface QRCardProps {
  participantName: string;
  amount: number;
  payeeVPA: string;
  payeeName: string;
  splitTitle: string;
}

export default function QRCard({ participantName, amount, payeeVPA, payeeName, splitTitle }: QRCardProps) {
  const upiLink = generateUPILink({
    payeeVPA: payeeVPA,
    payeeName: payeeName,
    amount: amount,
    note: `Split ${splitTitle}`,
  });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center max-w-sm w-full mx-auto">
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500 mb-1">Payment for {participantName}</p>
        <p className="text-3xl font-bold text-gray-900">₹{amount}</p>
      </div>
      
      <div className="mb-4">
        <QRGenerator value={upiLink} size={220} />
      </div>
      
      <div className="text-center w-full">
        <p className="text-xs text-gray-400 mb-1">Paying to</p>
        <p className="font-semibold text-gray-700">{payeeName}</p>
        <p className="text-xs text-gray-500">{payeeVPA}</p>
      </div>
    </div>
  );
}
