import QRCode from 'qrcode'
import { generateUPILink } from './upi'

export async function generateQRDataURL(text: string, options?: QRCode.QRCodeToDataURLOptions): Promise<string> {
  try {
    return await QRCode.toDataURL(text, options)
  } catch (err) {
    console.error('Failed to generate QR code', err)
    throw err
  }
}

interface UPIParams {
  payeeVPA: string
  payeeName: string
  amount?: number
  note?: string
}

export async function generateUPIQR(params: UPIParams): Promise<string> {
  const upiLink = generateUPILink(params)
  return generateQRDataURL(upiLink)
}
