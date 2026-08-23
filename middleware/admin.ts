export default defineNuxtRouteMiddleware(async () => {
  const { data, error } = await useFetch('/api/auth/me')

  if (error.value || !data.value?.authenticated) {
    return navigateTo('/login')
  }

  if (data.value.role !== 'admin') {
    return navigateTo('/events')
  }
})
