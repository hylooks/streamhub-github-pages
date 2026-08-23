import db from '~/server/utils/db'
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const row = await db.prepare('SELECT * FROM events WHERE id = ?').get(id)
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Event not found' })
  return row
})
