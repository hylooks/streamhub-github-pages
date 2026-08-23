export function cleanString(value: unknown, max = 500) {
  return String(value ?? '').trim().slice(0, max)
}
export function validStatus(value: unknown): value is 'live'|'upcoming'|'vod' { return value === 'live' || value === 'upcoming' || value === 'vod' }
export function validStreamUrl(value: unknown) {
  if (!value) return true
  try { const u = new URL(String(value)); return (u.protocol === 'https:' || u.protocol === 'http:') && u.username === '' && u.password === '' }
  catch { return false }
}
export function validDate(value: unknown) { return typeof value === 'string' && value.length > 0 && !Number.isNaN(Date.parse(value)) }
