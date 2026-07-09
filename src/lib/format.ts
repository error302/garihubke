// Currency + formatting helpers tuned for the Kenyan market.

export function formatKES(value: number): string {
  if (value >= 1000000) {
    return `KES ${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`
  }
  if (value >= 1000) {
    return `KES ${(value / 1000).toFixed(0)}K`
  }
  return `KES ${value.toLocaleString()}`
}

export function formatKESFull(value: number): string {
  return `KES ${value.toLocaleString('en-KE')}`
}

export function formatNumber(n: number | null | undefined): string {
  if (n == null) return '—'
  return n.toLocaleString('en-KE')
}

export function formatMileage(km: number | null | undefined): string {
  if (km == null) return '—'
  if (km === 0) return 'Brand new'
  return `${km.toLocaleString('en-KE')} km`
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

// Auto loan calculator: returns monthly payment + total interest
export function computeLoan(price: number, downPct: number, annualRatePct: number, months: number) {
  const down = (price * downPct) / 100
  const principal = price - down
  const r = annualRatePct / 100 / 12
  if (r === 0) {
    const monthly = principal / months
    return { down, principal, monthly, totalInterest: 0, total: principal }
  }
  const monthly = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
  const total = monthly * months
  return { down, principal, monthly, totalInterest: total - principal, total }
}

// Insurance estimate: ~3.5% of value per year (Kenyan comprehensive average)
export function computeInsurance(price: number) {
  const annual = price * 0.035
  return { annual, monthly: annual / 12 }
}

// Fuel cost estimate: annual km / consumption * price per litre
export function computeFuel(annualKm: number, consumptionKmPerL: number, pricePerL: number) {
  const litres = annualKm / consumptionKmPerL
  const cost = litres * pricePerL
  return { litres: Math.round(litres), cost: Math.round(cost) }
}
