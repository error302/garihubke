// WhatsApp helper — builds wa.me deep links with prefilled inquiry messages.
// Format: https://wa.me/<international-number>?text=<url-encoded-message>

// Default GariHub KE business number (used when a dealer phone isn't available).
// Replace with the real number when going live.
export const DEFAULT_WHATSAPP_NUMBER = '254700000000'

/**
 * Strip a phone number to digits only, then ensure it starts with a country code.
 * Handles Kenyan formats: 07XX, +2547XX, 2547XX, 7XX.
 */
export function normalizePhone(phone: string | null | undefined): string {
  if (!phone) return DEFAULT_WHATSAPP_NUMBER
  let digits = phone.replace(/[^\d]/g, '')
  // Kenyan local format 07XX / 01XX → 2547XX / 2541XX
  if (digits.startsWith('0')) digits = '254' + digits.slice(1)
  // Already international
  if (digits.startsWith('254')) return digits
  // Bare 7XX (no leading 0) → assume Kenyan
  if (digits.length === 9 && digits.startsWith('7')) return '254' + digits
  if (digits.length === 10 && digits.startsWith('0')) return '254' + digits.slice(1)
  return digits || DEFAULT_WHATSAPP_NUMBER
}

/**
 * Build a WhatsApp deep link with a prefilled message.
 */
export function buildWaLink(opts: {
  phone?: string | null
  vehicleTitle?: string
  vehiclePrice?: number
  vehicleSlug?: string
  dealerName?: string
  customMessage?: string
}): string {
  const phone = normalizePhone(opts.phone)
  let message: string

  if (opts.customMessage) {
    message = opts.customMessage
  } else if (opts.vehicleTitle) {
    const lines = [
      `Hello ${opts.dealerName || 'GariHub'} 👋`,
      ``,
      `I'm interested in the *${opts.vehicleTitle}*${opts.vehiclePrice ? ` listed at KES ${opts.vehiclePrice.toLocaleString()}` : ''}.`,
      ``,
      `Is it still available? I'd like to:`,
      `• Get more details`,
      `• Schedule a test drive`,
      `• Discuss financing options`,
      ``,
      `Thank you!`,
    ]
    message = lines.join('\n')
  } else {
    message = `Hello GariHub 👋\n\nI'd like to inquire about a vehicle on your marketplace.\n\nThank you!`
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

/**
 * Open WhatsApp in a new tab with the given options.
 */
export function openWhatsApp(opts: Parameters<typeof buildWaLink>[0]) {
  const url = buildWaLink(opts)
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
