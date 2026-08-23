<script setup lang="ts">
const { data } = await useEvents()
const events = computed(() => data.value || [])
const sports = computed(() => {
  const map = new Map<string, number>()
  for (const e of events.value as any[]) { const s=String(e.sport||'Other').trim()||'Other'; map.set(s,(map.get(s)||0)+1) }
  return [...map.entries()].sort((a,b)=>a[0].localeCompare(b[0]))
})
</script>
<template>
  <div class="space-y-8"><section><p class="text-xs font-black uppercase tracking-[.22em] text-indigo-400">Categories</p><h1 class="mt-2 text-4xl font-black">Sports</h1><p class="mt-2 max-w-2xl muted">Explore events by sport and jump directly into the filtered library.</p></section><div v-if="sports.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><NuxtLink v-for="[sport,count] in sports" :key="sport" :to="`/events?sport=${encodeURIComponent(sport)}`" class="group card relative overflow-hidden p-6 transition hover:-translate-y-1 hover:border-indigo-400/60"><div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl"></div><div class="text-3xl">🏆</div><h2 class="mt-5 text-xl font-black group-hover:text-indigo-300">{{sport}}</h2><p class="mt-1 text-sm muted">{{count}} event{{count===1?'':'s'}}</p><span class="mt-5 inline-block text-sm font-bold text-indigo-300">Browse →</span></NuxtLink></div><div v-else class="card p-12 text-center muted">No sports available yet.</div></div>
</template>
