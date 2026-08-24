import Database from 'better-sqlite3'
import { Pool } from 'pg'
import { join } from 'node:path'

const usePostgres = Boolean(process.env.DATABASE_URL)

function pgSql(sql: string) {
  let i = 0
  return sql.replace(/\?/g, () => `$${++i}`)
}

const sqlite = usePostgres ? null : (() => {
  const dbPath = process.env.SQLITE_PATH || join(process.cwd(), 'streamhub.sqlite')
  const d = new Database(dbPath)
  d.pragma('journal_mode = WAL')
  d.pragma('foreign_keys = ON')
  d.exec(`
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,email TEXT NOT NULL UNIQUE,password_hash TEXT NOT NULL,role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY,user_id INTEGER NOT NULL,expires_at INTEGER NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,description TEXT DEFAULT '',sport TEXT DEFAULT 'Sports',thumbnail TEXT DEFAULT '',start_time TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'upcoming',stream_url TEXT DEFAULT '',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS requests (id INTEGER PRIMARY KEY AUTOINCREMENT,user_email TEXT DEFAULT '',event_name TEXT NOT NULL,channel TEXT DEFAULT '',event_date TEXT DEFAULT '',request_type TEXT DEFAULT 'stream',status TEXT NOT NULL DEFAULT 'pending',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
`)
  const cols=d.prepare('PRAGMA table_info(requests)').all() as Array<{name:string}>
  if(!cols.some(c=>c.name==='user_email')) d.exec("ALTER TABLE requests ADD COLUMN user_email TEXT DEFAULT ''")
  return d
})()

const pool = usePostgres ? new Pool({
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT || 5432),
  database: process.env.DATABASE_NAME || 'streamhub',
  ssl: process.env.DATABASE_SSL === 'false'
    ? false
    : { rejectUnauthorized: false },
  max: Number(process.env.DATABASE_POOL_MAX || 10)
}) : null

let pgReady: Promise<void> = Promise.resolve()
if (pool) {
  pgReady = (async () => {
    await pool.query(`
CREATE TABLE IF NOT EXISTS users (id BIGSERIAL PRIMARY KEY,email TEXT NOT NULL UNIQUE,password_hash TEXT NOT NULL,role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY,user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at BIGINT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE IF NOT EXISTS events (id BIGSERIAL PRIMARY KEY,title TEXT NOT NULL,description TEXT DEFAULT '',sport TEXT DEFAULT 'Sports',thumbnail TEXT DEFAULT '',start_time TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'upcoming',stream_url TEXT DEFAULT '',created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE IF NOT EXISTS requests (id BIGSERIAL PRIMARY KEY,user_email TEXT DEFAULT '',event_name TEXT NOT NULL,channel TEXT DEFAULT '',event_date TEXT DEFAULT '',request_type TEXT DEFAULT 'stream',status TEXT NOT NULL DEFAULT 'pending',created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_requests_user_email ON requests(user_email);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
`)
  })()
}

class Statement {
  constructor(private sql:string) {}
  async get(...params:any[]) {
    if (pool) { await pgReady; const r=await pool.query(pgSql(this.sql),params); return r.rows[0] }
    return sqlite!.prepare(this.sql).get(...params)
  }
  async all(...params:any[]) {
    if (pool) { await pgReady; const r=await pool.query(pgSql(this.sql),params); return r.rows }
    return sqlite!.prepare(this.sql).all(...params)
  }
  async run(...params:any[]) {
    if (pool) {
      await pgReady
      let sql=this.sql.trim().replace(/;$/,'')
      if (/^INSERT\s/i.test(sql) && !/RETURNING\s/i.test(sql)) sql += ' RETURNING id'
      const r=await pool.query(pgSql(sql),params)
      return { changes:r.rowCount || 0, lastInsertRowid:r.rows[0]?.id }
    }
    return sqlite!.prepare(this.sql).run(...params)
  }
}

const db = {
  prepare(sql:string) { return new Statement(sql) },
  async exec(sql:string) { if(pool){await pgReady; await pool.query(sql)} else sqlite!.exec(sql) },
  isPostgres: usePostgres,
  async close(){ if(pool) await pool.end(); else sqlite?.close() }
}
export default db
