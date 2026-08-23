<script setup lang="ts">
defineProps<{event:any}>()
function badge(status:string) { return status === 'live' ? '🔴 LIVE' : status === 'vod' ? '📺 VOD' : '⏰ UPCOMING' }
</script>
<template>
  <NuxtLink :to="`/events/${event.id}`" class="group card block overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-indigo-400/60">
    <div class="relative aspect-video overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-black">
      <img v-if="event.thumbnail" :src="event.thumbnail" :alt="event.title" loading="lazy" class="h-full w-full object-cover transition duration-500 group-hover:scale-105">
      <div v-else class="flex h-full w-full items-center justify-center text-5xl">{{ event.status==='live' ? '🔴' : event.status==='vod' ? '📺' : '⏰' }}</div>
      <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent"></div>
      <span class="absolute left-3 top-3 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-black tracking-wide backdrop-blur">{{ badge(event.status) }}</span>
      <span class="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-slate-200 backdrop-blur">{{ event.sport || 'Sports' }}</span>
    </div>
    <div class="p-4">
      <h3 class="line-clamp-2 font-extrabold leading-snug group-hover:text-indigo-300">{{ event.title }}</h3>
      <p class="mt-2 text-sm muted">{{ new Date(event.start_time).toLocaleString() }}</p>
    </div>
  </NuxtLink>
</template>
