interface UPIParams {
  payeeVPA: string;
  payeeName: string;
  amount?: number;
  note?: string;
}

/**
 * Generates a clean NPCI-compliant standard upi://pay URI.
 * Critical formatting rules for bank gateway compatibility:
 * 1. Literal '@' in pa (many banks/apps fail when @ is percent-encoded as %40)
 * 2. %20 for spaces in pn and tn (never '+' which breaks some PSPs)
 * 3. Strips punctuation like ':' or '/' from note (banks reject non-alphanumeric tn)
 * 4. Exactly 2 decimal places for amount (NPCI mandate)
 */
export function generateUPILink({ payeeVPA, payeeName, amount, note }: UPIParams): string {
  const cleanVPA = payeeVPA.trim();
  const cleanName = (payeeName || 'Organizer')
    .trim()
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+/g, ' ');

  const cleanNote = (note || 'Split bill')
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 50);

  const parts: string[] = [
    `pa=${cleanVPA}`,
    `pn=${encodeURIComponent(cleanName)}`,
  ];

  if (amount && amount > 0) {
    parts.push(`am=${amount.toFixed(2)}`);
  }

  if (cleanNote) {
    parts.push(`tn=${encodeURIComponent(cleanNote)}`);
  }

  parts.push('cu=INR');

  return `upi://pay?${parts.join('&')}`;
}

/**
 * Generates specific Android intent links for individual UPI apps.
 */
export function generateAppIntentLink(
  app: 'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'cred',
  params: UPIParams
): string {
  const upiUrl = generateUPILink(params);
  const queryString = upiUrl.split('?')[1];

  const packageMap: Record<string, string> = {
    gpay: 'com.google.android.apps.nbu.paisa.user',
    phonepe: 'com.phonepe.app',
    paytm: 'net.one97.paytm',
    bhim: 'in.org.npci.upiapp',
    cred: 'com.dreamplug.androidapp',
  };

  const pkg = packageMap[app];
  if (!pkg) return upiUrl;

  return `intent://pay?${queryString}#Intent;scheme=upi;package=${pkg};end`;
}
