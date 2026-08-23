CREATE TABLE IF NOT EXISTS users (id BIGSERIAL PRIMARY KEY,email TEXT NOT NULL UNIQUE,password_hash TEXT NOT NULL,role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY,user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at BIGINT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE IF NOT EXISTS events (id BIGSERIAL PRIMARY KEY,title TEXT NOT NULL,description TEXT DEFAULT '',sport TEXT DEFAULT 'Sports',thumbnail TEXT DEFAULT '',start_time TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'upcoming',stream_url TEXT DEFAULT '',created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE IF NOT EXISTS requests (id BIGSERIAL PRIMARY KEY,user_email TEXT DEFAULT '',event_name TEXT NOT NULL,channel TEXT DEFAULT '',event_date TEXT DEFAULT '',request_type TEXT DEFAULT 'stream',status TEXT NOT NULL DEFAULT 'pending',created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_requests_user_email ON requests(user_email);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
