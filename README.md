# StreamHub — Step 6 UI/UX

This build is based on the previous `streamhub-nuxt3-search-sports.zip` and keeps its existing SQLite, authentication, admin CRUD, requests, Live/Upcoming/VOD, search, and sports filtering features.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Demo accounts
- Admin: admin@example.com / admin123
- User: user@example.com / user123

## UI additions
- Responsive streaming-style navigation
- Featured hero section
- Live / Upcoming / VOD shelves
- Sports directory
- Improved event cards
- Responsive mobile menu
- Improved login, request, and account screens
- Refined event detail/player layout

Use only streams and media you own or are authorized to distribute.


## Step 7 Production hardening
- Passwords use scrypt hashing and are stored in SQLite users table.
- Sessions use opaque random tokens stored server-side and HttpOnly cookies.
- Login attempts are rate limited in-memory.
- Admin APIs require an authenticated admin session.
- Event/request inputs are validated server-side.
- Basic security headers are enabled.
- Demo accounts are created automatically on first run: admin@example.com/admin123 and user@example.com/user123. Change these before production.


## Step 9: Production database
This version supports SQLite locally and PostgreSQL in production. The application selects PostgreSQL when `DATABASE_URL` is set; otherwise it uses `streamhub.sqlite`. Copy `.env.example` to `.env`. For production, set a private PostgreSQL connection string in `DATABASE_URL` and use `NODE_ENV=production`. Never commit `.env`.

Example: `DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME`

The PostgreSQL schema is also included in `database.postgres.sql`. The server creates the required tables/indexes automatically on startup when PostgreSQL is enabled.
