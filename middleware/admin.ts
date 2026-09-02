export default defineNuxtRouteMiddleware(async () => {
  // GitHub Pages akan berjalan sebagai frontend saja.
  // Pemeriksaan session dilakukan di browser.
  if (import.meta.server) {
    return
  }

  const supabase = useSupabase()

  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    return navigateTo('/login')
  }

  if (data.user.email !== 'celosiarae26@gmail.com') {
    await supabase.auth.signOut()
    return navigateTo('/login')
  }
})