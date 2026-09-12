interface UPIParams {
  payeeVPA: string
  payeeName: string
  amount?: number
  note?: string
}

export function generateUPILink({ payeeVPA, payeeName, amount, note }: UPIParams): string {
  const url = new URL('upi://pay')
  url.searchParams.append('pa', payeeVPA)
  url.searchParams.append('pn', payeeName)
  if (amount) {
    url.searchParams.append('am', amount.toFixed(2))
  }
  if (note) {
    url.searchParams.append('tn', note)
  }
  url.searchParams.append('cu', 'INR')
  return url.toString()
}

export function generateUPIIntentLink(params: UPIParams): string {
  const upiLink = generateUPILink(params)
  // Simple fallback structure, but can be expanded based on specific Android needs
  return `intent://pay?${upiLink.split('?')[1]}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`
}
