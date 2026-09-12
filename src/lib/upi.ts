interface UPIParams {
  payeeVPA: string;
  payeeName: string;
  amount?: number;
  note?: string;
  transactionRef?: string;
}

/**
 * Generates an NPCI-compliant query string and base URI.
 * Critical formatting rules for bank gateway compatibility:
 * 1. Literal '@' in pa (many banks/apps fail when @ is percent-encoded as %40)
 * 2. %20 for spaces in pn and tn (never '+' which breaks some PSPs)
 * 3. Strips punctuation like ':' or '/' from note (banks reject non-alphanumeric tn)
 * 4. Exactly 2 decimal places for amount (NPCI mandate)
 * 5. Includes a unique transaction reference (tr) for tracking
 */
export function generateUPIQueryString({ payeeVPA, payeeName, amount, note, transactionRef }: UPIParams): string {
  const cleanVPA = payeeVPA.trim();
  const cleanName = (payeeName || 'Organizer')
    .trim()
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+/g, ' ');

  const cleanNote = (note || 'Payment')
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 50);

  const cleanRef = (transactionRef || 'TRX' + Date.now().toString(36).toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 30);

  const parts: string[] = [
    `pa=${cleanVPA}`,
    `pn=${encodeURIComponent(cleanName)}`,
  ];

  if (amount && amount > 0) {
    parts.push(`am=${amount.toFixed(2)}`);
  }

  if (cleanRef) {
    parts.push(`tr=${cleanRef}`);
  }

  if (cleanNote) {
    parts.push(`tn=${encodeURIComponent(cleanNote)}`);
  }

  parts.push('cu=INR');

  return parts.join('&');
}

export function generateUPILink(params: UPIParams): string {
  const query = generateUPIQueryString(params);
  return `upi://pay?${query}`;
}

/**
 * Direct native app schemes (bypasses Chrome generic web-intent security blocking):
 * - Paytm: paytmmp://pay
 * - PhonePe: phonepe://pay
 * - Google Pay: tez://upi/pay
 * - BHIM: bhim://pay
 * - Cred: credpay://pay
 */
export function generateAppIntentLink(
  app: 'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'cred',
  params: UPIParams
): string {
  const query = generateUPIQueryString(params);

  switch (app) {
    case 'paytm':
      return `paytmmp://pay?${query}`;
    case 'phonepe':
      return `phonepe://pay?${query}`;
    case 'gpay':
      return `tez://upi/pay?${query}`;
    case 'bhim':
      return `bhim://pay?${query}`;
    case 'cred':
      return `credpay://pay?${query}`;
    default:
      return `upi://pay?${query}`;
  }
}
