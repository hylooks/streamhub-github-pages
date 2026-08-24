import db from '~/server/utils/db'
import { ensureDemoAccounts, setSession, verifyPassword } from '~/server/utils/auth'

const attempts = new Map<string, { count: number; reset: number }>()
const WINDOW = 15 * 60 * 1000
const LIMIT = 10

export default defineEventHandler(async (event) => {
  try {
    // 1. Ekstraksi IP yang aman di Proxy Serverless
    const rawIp = getRequestHeader(event, 'x-forwarded-for') || getRequestHeader(event, 'x-real-ip') || '127.0.0.1'
    const ip = rawIp.split(',')[0].trim()
    
    // 2. Safe Rate Limiting
    const now = Date.now()
    let current = attempts.get(ip)
    
    if (current && current.reset > now && current.count >= LIMIT) {
      throw createError({ statusCode: 429, statusMessage: 'Too many login attempts. Try again later.' })
    }
    
    if (!current || current.reset <= now) {
      current = { count: 0, reset: now + WINDOW }
      attempts.set(ip, current)
    }

    // 3. Validasi Input Body
    const body = await readBody(event)
    const email = String(body?.email || '').trim().toLowerCase()
    const password = String(body?.password || '')

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 1 || password.length > 200) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid login input' })
    }

    // 4. Pastikan Akun Demo Ada (dengan Try-Catch agar tidak memicu 500 jika DB delay)
    try {
      await ensureDemoAccounts()
    } catch (e) {
      console.warn('Warning: ensureDemoAccounts failed silently:', e)
    }

    // 5. Query User dari Database
    const account = await db.prepare('SELECT id, email, password_hash, role FROM users WHERE email = ?').get(email) as any
    
    const valid = account ? await verifyPassword(password, account.password_hash) : false
    
    if (!valid) {
      current.count++
      throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
    }

    // Reset percobaan jika login berhasil
    attempts.delete(ip)

    // 6. Set Cookie Session & Return User
    return await setSession(event, account.id, account.role, account.email)

  } catch (error: any) {
    if (error.statusCode) throw error
    
    console.error('Unhandled Login Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal Server Error'
    })
  }
})
