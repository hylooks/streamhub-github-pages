import db from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/auth'
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const b = await readBody(event)
  const status = ['pending','approved','rejected'].includes(b?.status) ? b.status : 'pending'
  const result = await db.prepare('UPDATE requests SET status=? WHERE id=?').run(status, id)
  if (!result.changes) throw createError({ statusCode: 404, statusMessage: 'Request not found' })
  return await db.prepare('SELECT * FROM requests WHERE id=?').get(id)
})
