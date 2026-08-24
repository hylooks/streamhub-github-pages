import crypto from 'node:crypto'
import db from './db'

const SALT_LEN = 16
const KEY_LEN = 64

// 1. Hashing Password yang Aman & Kompatibel
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(SALT_LEN).toString('hex')
    crypto.scrypt(password, salt, KEY_LEN, (err, derivedKey) => {
      if (err) reject(err)
      resolve(`${salt}:${derivedKey.toString('hex')}`)
    })
  })
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!storedHash || !storedHash.includes(':')) return resolve(false)
    const [salt, key] = storedHash.split(':')
    crypto.scrypt(password, salt, KEY_LEN, (err, derivedKey) => {
      if (err) return resolve(false)
      resolve(crypto.timingSafeEqual(Buffer.from(key, 'hex'), derivedKey))
    })
  })
}

// 2. Insert Akun Demo (Kompatibel PostgreSQL & SQLite)
export async function ensureDemoAccounts() {
  try {
    const adminEmail = 'admin@streamhub.com'
    const existingAdmin = await db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail)
    
    if (!existingAdmin) {
      const defaultPasswordHash = await hashPassword('admin123')
      await db.prepare(
        'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)'
      ).run(adminEmail, defaultPasswordHash, 'admin')
      console.log('✅ Demo Admin Account Created: admin@streamhub.com / admin123')
    }
  } catch (err) {
    console.error('Error in ensureDemoAccounts:', err)
  }
}

// 3. Handling Session Cookie (HTTPS Safe)
export async function setSession(event: any, userId: number | string, role: string, email: string) {
  const sessionId = crypto.randomBytes(32).toString('hex')
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 hari

  // Save to DB
  await db.prepare(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
  ).run(sessionId, userId, expiresAt)

  // Set Cookie ke Browser
  setCookie(event, 'streamhub_session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60
  })

  return {
    success: true,
    user: { id: userId, email, role }
  }
}
