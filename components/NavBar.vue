<script setup lang="ts">
const { data: session, refresh } = await useFetch('/api/auth/me')
const isLoggedIn = computed(() => !!session.value?.authenticated)
const isAdmin = computed(() => session.value?.role === 'admin')
const menuOpen = ref(false)
const links = [
  { label: 'Home', to: '/' },
  { label: 'Live', to: '/events?status=live' },
  { label: 'Upcoming', to: '/events?status=upcoming' },
  { label: 'VOD', to: '/events?status=vod' },
  { label: 'Sports', to: '/sports' },
  { label: 'Request', to: '/request' }
]
async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await refresh()
  menuOpen.value = false
  await navigateTo('/')
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-slate-800/80 bg-[#05070b]/90 backdrop-blur-xl">
    <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between gap-4">
        <NuxtLink to="/" class="shrink-0 text-xl font-black tracking-tight">STREAM<span class="text-indigo-400">HUB</span></NuxtLink>
        <div class="hidden items-center gap-1 lg:flex">
          <NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/70 hover:text-white">{{ link.label }}</NuxtLink>
        </div>
        <div class="flex items-center gap-2">
          <NuxtLink to="/events" class="hidden rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold sm:block">🔍 Search</NuxtLink>
          <NuxtLink v-if="isAdmin" to="/admin" class="hidden rounded-lg bg-indigo-500 px-3 py-2 text-sm font-bold sm:block">Admin</NuxtLink>
          <template v-if="isLoggedIn">
            <span class="hidden rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold uppercase tracking-wider sm:block">{{ session?.role }}</span>
            <button @click="logout" class="hidden rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold sm:block">Logout</button>
          </template>
          <NuxtLink v-else to="/login" class="hidden rounded-lg bg-indigo-500 px-3 py-2 text-sm font-bold sm:block">Login</NuxtLink>
          <button @click="menuOpen=!menuOpen" class="rounded-lg border border-slate-700 px-3 py-2 lg:hidden">☰</button>
        </div>
      </div>
      <div v-if="menuOpen" class="border-t border-slate-800 py-3 lg:hidden">
        <div class="grid gap-1">
          <NuxtLink v-for="link in links" :key="link.to" @click="menuOpen=false" :to="link.to" class="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800">{{ link.label }}</NuxtLink>
          <NuxtLink v-if="isAdmin" @click="menuOpen=false" to="/admin" class="rounded-lg bg-indigo-500 px-3 py-2.5 text-sm font-bold">Admin</NuxtLink>
          <button v-if="isLoggedIn" @click="logout" class="rounded-lg bg-slate-800 px-3 py-2.5 text-left text-sm font-semibold">Logout · {{ session?.role }}</button>
          <NuxtLink v-else @click="menuOpen=false" to="/login" class="rounded-lg bg-indigo-500 px-3 py-2.5 text-sm font-bold">Login</NuxtLink>
        </div>
      </div>
    </nav>
  </header>
</template>
