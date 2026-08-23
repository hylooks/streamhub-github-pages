import db from '~/server/utils/db'
export default defineEventHandler(async () => await db.prepare('SELECT * FROM events ORDER BY start_time DESC').all())
