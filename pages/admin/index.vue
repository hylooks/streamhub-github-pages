<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const { data: events } = await useFetch('/api/events')
const { data: requests } = await useFetch('/api/admin/requests')
</script>
<template><div class="flex items-end justify-between"><div><p class="text-sm text-indigo-400">ADMIN</p><h1 class="text-3xl font-black">Dashboard</h1></div><NuxtLink to="/admin/events" class="rounded-lg bg-indigo-500 px-4 py-2">Manage events</NuxtLink></div><div class="mt-7 grid gap-4 md:grid-cols-3"><div class="card p-5"><p class="muted">Events</p><p class="mt-2 text-3xl font-black">{{events?.length||0}}</p></div><div class="card p-5"><p class="muted">Live</p><p class="mt-2 text-3xl font-black">{{(events||[]).filter((x:any)=>x.status==='live').length}}</p></div><div class="card p-5"><p class="muted">Requests</p><p class="mt-2 text-3xl font-black">{{requests?.length||0}}</p></div></div><div class="card mt-6 p-5"><div class="flex items-center justify-between"><h2 class="text-xl font-bold">Recent Requests</h2><NuxtLink to="/admin/requests" class="text-indigo-300">Manage</NuxtLink></div><div v-if="!requests?.length" class="mt-4 muted">Belum ada request.</div><div v-for="r in requests?.slice(0,5)" :key="r.id" class="mt-3 flex justify-between border-t border-slate-800 pt-3"><span>{{r.event_name}}</span><span class="text-sm muted">{{r.status}}</span></div></div></template>
