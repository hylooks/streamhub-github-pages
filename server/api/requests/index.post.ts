import db from '~/server/utils/db'
import { requireUser } from '~/server/utils/auth'
import { cleanString } from '~/server/utils/validation'
export default defineEventHandler(async (event) => {
  const session=await requireUser(event); const b=await readBody(event); const event_name=cleanString(b?.event_name,160)
  if(!event_name) throw createError({statusCode:400,statusMessage:'Event name is required'})
  const channel=cleanString(b?.channel,160), event_date=cleanString(b?.event_date,80), request_type=['stream','vod'].includes(b?.request_type)?b.request_type:'stream'
  const r=await db.prepare(`INSERT INTO requests (user_email,event_name,channel,event_date,request_type) VALUES (?,?,?,?,?)`).run(session.email,event_name,channel,event_date,request_type)
  return {ok:true,id:r.lastInsertRowid,status:'pending',email:session.email}
})
