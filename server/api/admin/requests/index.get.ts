import db from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  return await db.prepare('SELECT * FROM requests ORDER BY created_at DESC, id DESC').all()
})
