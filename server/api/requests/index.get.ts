import db from '~/server/utils/db'
import { requireUser } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const session = await requireUser(event)
  return await db.prepare('SELECT * FROM requests WHERE user_email = ? ORDER BY created_at DESC, id DESC').all(session.email)
})
