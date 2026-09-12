import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CreateSplitForm } from '@/components/split/CreateSplitForm';

export default function CreateSplitPage() {
  return (
    <div className="max-w-xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/dashboard" 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Split</h1>
      </div>
      
      <CreateSplitForm />
    </div>
  );
}
