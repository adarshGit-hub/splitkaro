"use client";

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import Image from 'next/image';
import { Download } from 'lucide-react';

interface QRGeneratorProps {
  value: string;
  size?: number;
  label?: string;
}

export default function QRGenerator({ value, size = 200, label }: QRGeneratorProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const generate = async () => {
      try {
        const url = await QRCode.toDataURL(value, {
          width: size,
          margin: 1,
          color: {
            dark: '#1e1b4b',
            light: '#ffffff',
          },
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error('Error generating QR code', err);
      }
    };
    
    generate();
  }, [value, size]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'splitkaro-qr.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!qrDataUrl) {
    return <div 
      className="animate-pulse bg-gray-100 rounded-xl" 
      style={{ width: size, height: size }}
    />;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
        <Image src={qrDataUrl} alt="QR Code" width={size} height={size} className="rounded-xl" />
      </div>
      {label && <p className="mt-3 text-sm font-medium text-gray-600">{label}</p>}
      <button 
        onClick={handleDownload}
        className="mt-3 flex items-center text-sm text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
      >
        <Download className="w-4 h-4 mr-1.5" />
        Save QR
      </button>
    </div>
  );
}
