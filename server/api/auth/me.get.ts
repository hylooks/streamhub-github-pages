import { getSession } from '~/server/utils/auth'
export default defineEventHandler(async (event) => { const s=await getSession(event); return s ? { authenticated:true, role:s.role, email:s.email } : { authenticated:false, role:null, email:null } })
