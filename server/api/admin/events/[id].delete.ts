import db from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/auth'
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const result = await db.prepare('DELETE FROM events WHERE id=?').run(id)
  if (!result.changes) throw createError({ statusCode: 404, statusMessage: 'Event not found' })
  return { ok: true }
})
