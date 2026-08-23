<script setup lang="ts">
const { data } = await useEvents()
const events = computed(() => data.value || [])
const live = computed(() => events.value.filter((e:any) => e.status === 'live'))
const upcoming = computed(() => events.value.filter((e:any) => e.status === 'upcoming').sort((a:any,b:any) => new Date(a.start_time).getTime()-new Date(b.start_time).getTime()))
const vod = computed(() => events.value.filter((e:any) => e.status === 'vod').sort((a:any,b:any) => new Date(b.start_time).getTime()-new Date(a.start_time).getTime()))
const sports = computed(() => Array.from(new Set(events.value.map((e:any)=>String(e.sport || 'Other').trim()).filter(Boolean))).sort())
const featured = computed(() => live.value[0] || upcoming.value[0] || vod.value[0] || null)
</script>

<template>
  <div class="space-y-12">
    <section class="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-indigo-950/70 via-slate-900 to-[#080a10]">
      <div class="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"></div>
      <div class="grid min-h-[420px] lg:grid-cols-2">
        <div class="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
          <div class="flex items-center gap-2 text-xs font-black uppercase tracking-[.22em] text-indigo-300"><span class="h-2 w-2 rounded-full bg-indigo-400"></span> Live & on demand</div>
          <h1 class="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Every event.<br><span class="text-indigo-400">One streaming hub.</span></h1>
          <p class="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">Watch live events, discover what's coming next, and revisit your VOD library from one clean experience.</p>
          <div class="mt-7 flex flex-wrap gap-3"><NuxtLink to="/events" class="btn-primary">Browse events</NuxtLink><NuxtLink to="/request" class="btn-secondary">Request an event</NuxtLink></div>
        </div>
        <div v-if="featured" class="relative min-h-[260px] overflow-hidden lg:min-h-full">
          <img v-if="featured.thumbnail" :src="featured.thumbnail" :alt="featured.title" class="h-full w-full object-cover opacity-75">
          <div v-else class="flex h-full items-center justify-center bg-gradient-to-br from-indigo-900/60 to-black text-8xl">{{ featured.status==='live' ? '🔴' : featured.status==='vod' ? '📺' : '⏰' }}</div>
          <div class="absolute inset-0 bg-gradient-to-r from-[#0b0e16] via-transparent to-transparent lg:from-[#0b0e16]/90"></div>
          <div class="absolute bottom-6 left-6 right-6"><span class="rounded-full bg-black/60 px-3 py-1 text-xs font-black backdrop-blur">{{ featured.status==='live' ? '🔴 LIVE NOW' : featured.status==='vod' ? '📺 FEATURED VOD' : '⏰ NEXT UP' }}</span><h2 class="mt-3 text-2xl font-black">{{ featured.title }}</h2><p class="mt-1 text-sm text-slate-300">{{ featured.sport }}</p><NuxtLink :to="`/events/${featured.id}`" class="mt-4 inline-block rounded-lg bg-white px-4 py-2 text-sm font-black text-slate-900">{{ featured.status==='upcoming' ? 'View event' : 'Watch now' }}</NuxtLink></div>
        </div>
      </div>
    </section>

    <section v-if="sports.length">
      <div class="mb-4 flex items-end justify-between"><div><p class="text-xs font-black uppercase tracking-[.2em] text-indigo-400">Explore</p><h2 class="section-title mt-1">Browse by sport</h2></div><NuxtLink to="/sports" class="text-sm font-bold text-indigo-300">All sports →</NuxtLink></div>
      <div class="flex gap-3 overflow-x-auto pb-2"><NuxtLink v-for="sport in sports" :key="sport" :to="`/events?sport=${encodeURIComponent(sport)}`" class="shrink-0 rounded-xl border border-slate-700 bg-slate-900/70 px-5 py-3 text-sm font-bold transition hover:border-indigo-400 hover:bg-indigo-500/10">{{ sport }}</NuxtLink></div>
    </section>

    <section v-if="live.length"><div class="mb-4 flex items-end justify-between"><div><p class="text-xs font-black uppercase tracking-[.2em] text-red-400">Happening now</p><h2 class="section-title mt-1">🔴 Live now</h2></div><NuxtLink to="/events?status=live" class="text-sm font-bold text-indigo-300">View all →</NuxtLink></div><div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><EventCard v-for="e in live.slice(0,8)" :key="e.id" :event="e"/></div></section>
    <section v-if="upcoming.length"><div class="mb-4 flex items-end justify-between"><div><p class="text-xs font-black uppercase tracking-[.2em] text-amber-300">Coming soon</p><h2 class="section-title mt-1">⏰ Upcoming</h2></div><NuxtLink to="/events?status=upcoming" class="text-sm font-bold text-indigo-300">View all →</NuxtLink></div><div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><EventCard v-for="e in upcoming.slice(0,8)" :key="e.id" :event="e"/></div></section>
    <section v-if="vod.length"><div class="mb-4 flex items-end justify-between"><div><p class="text-xs font-black uppercase tracking-[.2em] text-purple-300">Watch anytime</p><h2 class="section-title mt-1">📺 VOD</h2></div><NuxtLink to="/events?status=vod" class="text-sm font-bold text-indigo-300">View all →</NuxtLink></div><div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><EventCard v-for="e in vod.slice(0,8)" :key="e.id" :event="e"/></div></section>
    <section v-if="!events.length" class="card p-12 text-center"><div class="text-5xl">📡</div><h2 class="mt-4 text-2xl font-black">No events yet</h2><p class="mt-2 muted">Add your first event from the admin dashboard.</p></section>
  </div>
</template>
