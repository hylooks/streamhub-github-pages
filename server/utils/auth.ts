import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import db from '~/server/utils/db'
const scrypt=promisify(scryptCb)
export type SessionRole='user'|'admin'
export type Session={id:string;userId:number;role:SessionRole;email:string}
const COOKIE='streamhub_session'; const SESSION_TTL=60*60*24*7
export async function hashPassword(password:string){const salt=randomBytes(16).toString('hex');const derived=await scrypt(password,salt,64) as Buffer;return `scrypt$${salt}$${derived.toString('hex')}`}
export async function verifyPassword(password:string,stored:string){const p=stored.split('$');if(p.length!==3||p[0]!=='scrypt')return false;const derived=await scrypt(password,p[1],64) as Buffer;const expected=Buffer.from(p[2],'hex');return expected.length===derived.length&&timingSafeEqual(expected,derived)}
export async function setSession(event:any,userId:number,role:SessionRole,email:string){const id=randomBytes(32).toString('base64url');const expires=Math.floor(Date.now()/1000)+SESSION_TTL;await db.prepare('INSERT INTO sessions (id,user_id,expires_at) VALUES (?,?,?)').run(id,userId,expires);setCookie(event,COOKIE,id,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:SESSION_TTL});return{role,email}}
export async function getSession(event:any):Promise<Session|null>{const id=getCookie(event,COOKIE);if(!id)return null;const row=await db.prepare(`SELECT s.id,s.user_id as userId,u.email,u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.id=? AND s.expires_at>?`).get(id,Math.floor(Date.now()/1000)) as any;return row?(row as Session):null}
export async function clearSession(event:any){const id=getCookie(event,COOKIE);if(id)await db.prepare('DELETE FROM sessions WHERE id=?').run(id);deleteCookie(event,COOKIE,{path:'/'})}
export async function requireUser(event:any){const s=await getSession(event);if(!s)throw createError({statusCode:401,statusMessage:'Login required'});return s}
export async function requireAdmin(event:any){const s=await getSession(event);if(!s||s.role!=='admin')throw createError({statusCode:403,statusMessage:'Admin access required'});return s}
export async function ensureProductionAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) return

  const existing = await db
    .prepare('SELECT id FROM users WHERE email=?')
    .get(email) as any

  if (existing) return

  await db
    .prepare('INSERT INTO users (email,password_hash,role) VALUES (?,?,?)')
    .run(email, await hashPassword(password), 'admin')
}