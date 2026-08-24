import db from '~/server/utils/db'
import { ensureProductionAdmin, setSession, verifyPassword } from '~/server/utils/auth'

const attempts = new Map<string, { count: number; reset: number }>()
const WINDOW = 15 * 60 * 1000
const LIMIT = 10

export default defineEventHandler(async (event) => {
  const ip = getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() || getRequestHeader(event, 'x-real-ip') || 'local'
  const now = Date.now()
  const current = attempts.get(ip)
  if (current && current.reset > now && current.count >= LIMIT) throw createError({ statusCode: 429, statusMessage: 'Too many login attempts. Try again later.' })
  if (!current || current.reset <= now) attempts.set(ip, { count: 0, reset: now + WINDOW })

  const body = await readBody(event)
  const email = String(body?.email || '').trim().toLowerCase()
  const password = String(body?.password || '')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 1 || password.length > 200) throw createError({ statusCode: 400, statusMessage: 'Invalid login input' })

  await ensureProductionAdmin()
  const account = await db.prepare('SELECT id,email,password_hash,role FROM users WHERE email=?').get(email) as any
  const valid = account ? await verifyPassword(password, account.password_hash) : false
  if (!valid) {
    const a = attempts.get(ip)!; a.count++
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }
  attempts.delete(ip)
  return await setSession(event, account.id, account.role, account.email)
})
