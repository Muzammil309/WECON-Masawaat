/**
 * QR Code Generation Utilities
 * Handles QR code generation for tickets and check-in
 */

import QRCode from 'qrcode'
import { v4 as uuidv4 } from 'uuid'

/**
 * QR Code data structure for tickets
 */
export interface TicketQRData {
  ticketId: string
  eventId: string
  userId: string
  ticketTierId: string
  timestamp: number
  checksum: string
}

/**
 * Generate a unique QR code string for a ticket
 * Format: TICKET-{ticketId}-{eventId}-{timestamp}-{checksum}
 */
export function generateTicketQRString(
  ticketId: string,
  eventId: string,
  userId: string,
  ticketTierId: string
): string {
  const timestamp = Date.now()
  const checksum = generateChecksum(ticketId, eventId, userId, timestamp)
  
  return `TICKET-${ticketId}-${eventId}-${timestamp}-${checksum}`
}

/**
 * Generate a checksum for QR code validation
 * Simple hash function for verification
 */
function generateChecksum(
  ticketId: string,
  eventId: string,
  userId: string,
  timestamp: number
): string {
  const data = `${ticketId}${eventId}${userId}${timestamp}`
  let hash = 0
  
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(36).toUpperCase()
}

/**
 * Parse QR code string back to data object
 */
export function parseTicketQRString(qrString: string): TicketQRData | null {
  try {
    const parts = qrString.split('-')
    
    if (parts.length !== 5 || parts[0] !== 'TICKET') {
      return null
    }
    
    return {
      ticketId: parts[1],
      eventId: parts[2],
      userId: '', // Will be fetched from database
      ticketTierId: '', // Will be fetched from database
      timestamp: parseInt(parts[3]),
      checksum: parts[4]
    }
  } catch (error) {
    console.error('Error parsing QR code:', error)
    return null
  }
}

/**
 * Validate QR code checksum
 */
export function validateQRChecksum(
  ticketId: string,
  eventId: string,
  userId: string,
  timestamp: number,
  checksum: string
): boolean {
  const expectedChecksum = generateChecksum(ticketId, eventId, userId, timestamp)
  return checksum === expectedChecksum
}

/**
 * Generate QR code image as Data URL
 */
export async function generateQRCodeImage(
  qrString: string,
  options?: {
    width?: number
    margin?: number
    color?: {
      dark?: string
      light?: string
    }
  }
): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(qrString, {
      width: options?.width || 300,
      margin: options?.margin || 2,
      color: {
        dark: options?.color?.dark || '#000000',
        light: options?.color?.light || '#FFFFFF'
      },
      errorCorrectionLevel: 'H' // High error correction for better scanning
    })
    
    return dataUrl
  } catch (error) {
    console.error('Error generating QR code image:', error)
    throw new Error('Failed to generate QR code image')
  }
}

/**
 * Generate QR code as SVG string
 */
export async function generateQRCodeSVG(
  qrString: string,
  options?: {
    width?: number
    margin?: number
    color?: {
      dark?: string
      light?: string
    }
  }
): Promise<string> {
  try {
    const svg = await QRCode.toString(qrString, {
      type: 'svg',
      width: options?.width || 300,
      margin: options?.margin || 2,
      color: {
        dark: options?.color?.dark || '#000000',
        light: options?.color?.light || '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    })
    
    return svg
  } catch (error) {
    console.error('Error generating QR code SVG:', error)
    throw new Error('Failed to generate QR code SVG')
  }
}

/**
 * Generate QR code as Buffer (for server-side use)
 */
export async function generateQRCodeBuffer(
  qrString: string,
  options?: {
    width?: number
    margin?: number
  }
): Promise<Buffer> {
  try {
    const buffer = await QRCode.toBuffer(qrString, {
      width: options?.width || 300,
      margin: options?.margin || 2,
      errorCorrectionLevel: 'H'
    })
    
    return buffer
  } catch (error) {
    console.error('Error generating QR code buffer:', error)
    throw new Error('Failed to generate QR code buffer')
  }
}

/**
 * Validate ticket QR code format
 */
export function isValidTicketQRFormat(qrString: string): boolean {
  const pattern = /^TICKET-[a-f0-9-]+-[a-f0-9-]+-\d+-[A-Z0-9]+$/
  return pattern.test(qrString)
}

/**
 * Generate a barcode string (alternative to QR code)
 * Format: Simple numeric barcode based on ticket ID
 */
export function generateBarcodeString(ticketId: string): string {
  // Convert UUID to numeric string
  const numericId = ticketId.replace(/-/g, '').substring(0, 12)
  return numericId.toUpperCase()
}

/**
 * Validate barcode format
 */
export function isValidBarcodeFormat(barcode: string): boolean {
  const pattern = /^[A-F0-9]{12}$/
  return pattern.test(barcode)
}

