<script setup lang="ts">
const route = useRoute()
const supabase = useSupabase()

const { data, error } = await supabase
  .from('events')
  .select('*')
  .eq('id', Number(route.params.id))
  .single()

if (error) {
  console.error('Supabase event error:', error)
}

const event = ref(data)
const canPlay = computed(() => event.value?.status !== 'upcoming')
</script>
<template><div v-if="event" class="space-y-5"><div class="flex flex-wrap items-start justify-between gap-4"><div><div class="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-wider"><span class="text-indigo-300">{{event.sport}}</span><span class="text-slate-600">•</span><span :class="event.status==='live'?'text-red-400':event.status==='vod'?'text-purple-300':'text-amber-300'">{{event.status==='live'?'🔴 LIVE':event.status==='vod'?'📺 VOD':'⏰ UPCOMING'}}</span></div><h1 class="mt-2 text-3xl font-black sm:text-4xl">{{event.title}}</h1><p class="mt-2 muted">{{new Date(event.start_time).toLocaleString()}}</p></div><NuxtLink to="/events" class="btn-secondary">← Back to events</NuxtLink></div><div class="overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-2xl"><VideoPlayer v-if="canPlay && event.stream_url" :src="event.stream_url"/><div v-else class="flex aspect-video items-center justify-center p-8 text-center"><div><div class="text-5xl">⏰</div><h2 class="mt-4 text-xl font-black">Stream belum tersedia</h2><p class="mt-2 muted">Event ini dijadwalkan mulai {{new Date(event.start_time).toLocaleString()}}.</p></div></div></div><div class="card p-6"><div class="flex flex-wrap items-center gap-2"><span class="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold">{{event.sport}}</span><span class="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold">{{event.status.toUpperCase()}}</span></div><h2 class="mt-5 text-xl font-black">About this event</h2><p class="mt-2 max-w-4xl whitespace-pre-line leading-7 muted">{{event.description || 'No description available.'}}</p></div></div></template>
