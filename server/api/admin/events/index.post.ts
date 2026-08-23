import db from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/auth'
import { cleanString, validDate, validStatus, validStreamUrl } from '~/server/utils/validation'
export default defineEventHandler(async (event) => {
  await requireAdmin(event); const b=await readBody(event)
  const title=cleanString(b?.title,160), description=cleanString(b?.description,2000), sport=cleanString(b?.sport,80), thumbnail=cleanString(b?.thumbnail,1000), start_time=cleanString(b?.start_time,80), status=b?.status || 'upcoming', stream_url=cleanString(b?.stream_url,2000)
  if (!title || !validDate(start_time) || !validStatus(status) || !validStreamUrl(stream_url)) throw createError({statusCode:400,statusMessage:'Invalid event data'})
  const r=await db.prepare(`INSERT INTO events (title,description,sport,thumbnail,start_time,status,stream_url) VALUES (?,?,?,?,?,?,?)`).run(title,description,sport||'Sports',thumbnail,start_time,status,stream_url)
  return await db.prepare('SELECT * FROM events WHERE id=?').get(r.lastInsertRowid)
})
