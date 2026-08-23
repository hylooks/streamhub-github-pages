import db from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/auth'
import { cleanString, validDate, validStatus, validStreamUrl } from '~/server/utils/validation'
export default defineEventHandler(async (event) => {
  await requireAdmin(event); const id=Number(getRouterParam(event,'id')); if(!Number.isInteger(id)||id<1) throw createError({statusCode:400,statusMessage:'Invalid event id'})
  const b=await readBody(event); const title=cleanString(b?.title,160), description=cleanString(b?.description,2000), sport=cleanString(b?.sport,80), thumbnail=cleanString(b?.thumbnail,1000), start_time=cleanString(b?.start_time,80), status=b?.status || 'upcoming', stream_url=cleanString(b?.stream_url,2000)
  if(!title||!validDate(start_time)||!validStatus(status)||!validStreamUrl(stream_url)) throw createError({statusCode:400,statusMessage:'Invalid event data'})
  const r=await db.prepare(`UPDATE events SET title=?,description=?,sport=?,thumbnail=?,start_time=?,status=?,stream_url=? WHERE id=?`).run(title,description,sport||'Sports',thumbnail,start_time,status,stream_url,id)
  if(!r.changes) throw createError({statusCode:404,statusMessage:'Event not found'})
  return await db.prepare('SELECT * FROM events WHERE id=?').get(id)
})
