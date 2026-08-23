<script setup lang="ts">
const route = useRoute()
const { data } = await useEvents()
const events = computed(() => data.value || [])
const query = ref((route.query.q as string) || '')
const selected = ref((route.query.status as string) || 'all')
const selectedSport = ref((route.query.sport as string) || 'all')
const sports = computed(() => Array.from(new Set(events.value.map((e:any) => String(e.sport || 'Other').trim()).filter(Boolean))).sort())
const filtered = computed(() => {
  const q = query.value.toLowerCase().trim()
  return events.value.filter((e:any) => {
    const statusOk = selected.value === 'all' || e.status === selected.value
    const sportOk = selectedSport.value === 'all' || e.sport === selectedSport.value
    const text = `${e.title} ${e.sport} ${e.description || ''}`.toLowerCase()
    return statusOk && sportOk && (!q || text.includes(q))
  })
})
function syncUrl() { const q:any={}; if(query.value.trim())q.q=query.value.trim(); if(selected.value!=='all')q.status=selected.value; if(selectedSport.value!=='all')q.sport=selectedSport.value; navigateTo({path:'/events',query:q},{replace:true}) }
function setStatus(s:string){selected.value=s;syncUrl()}; function setSport(s:string){selectedSport.value=s;syncUrl()}
</script>
<template>
  <div class="space-y-6">
    <section class="rounded-2xl border border-slate-800 bg-gradient-to-r from-indigo-950/50 to-slate-900/70 p-6 sm:p-8"><p class="text-xs font-black uppercase tracking-[.22em] text-indigo-400">Browse library</p><div class="mt-2 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><h1 class="text-4xl font-black tracking-tight">Find your next event</h1><p class="mt-2 muted">Search by title, sport, status, or description.</p></div><div class="relative w-full lg:w-[380px]"><span class="absolute left-3 top-3.5 text-slate-500">⌕</span><input v-model="query" @keyup.enter="syncUrl" class="input pl-9" placeholder="Search events..." /></div></div></section>
    <div class="flex flex-wrap gap-2"><button v-for="s in ['all','live','upcoming','vod']" :key="s" @click="setStatus(s)" class="rounded-full px-4 py-2 text-sm font-bold transition" :class="selected===s?'bg-indigo-500 text-white':'bg-slate-900 text-slate-300 hover:bg-slate-800'">{{ s==='all'?'All':s==='live'?'🔴 Live':s==='upcoming'?'⏰ Upcoming':'📺 VOD' }}</button></div>
    <div v-if="sports.length" class="flex gap-2 overflow-x-auto pb-2"><button @click="setSport('all')" class="shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold" :class="selectedSport==='all'?'border-indigo-400 text-indigo-300':'border-slate-700 text-slate-400'">All sports</button><button v-for="sport in sports" :key="sport" @click="setSport(sport)" class="shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold" :class="selectedSport===sport?'border-indigo-400 text-indigo-300':'border-slate-700 text-slate-400'">{{sport}}</button></div>
    <div class="flex items-center justify-between text-sm muted"><span>{{ filtered.length }} event{{ filtered.length===1?'':'s' }} found</span><button v-if="query || selected!=='all' || selectedSport!=='all'" @click="query='';selected='all';selectedSport='all';syncUrl()" class="text-indigo-300">Clear filters</button></div>
    <div v-if="filtered.length" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><EventCard v-for="e in filtered" :key="e.id" :event="e"/></div><div v-else class="card p-12 text-center"><div class="text-5xl">🔎</div><h2 class="mt-4 text-xl font-black">No matching events</h2><p class="mt-2 muted">Try another search or clear your filters.</p></div>
  </div>
</template>
