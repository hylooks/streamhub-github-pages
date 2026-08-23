<script setup lang="ts">
definePageMeta({ middleware: 'admin' })
const { data: requests, refresh } = await useFetch('/api/admin/requests')
async function setStatus(id:number,status:string){ await $fetch(`/api/admin/requests/${id}`,{method:'PUT',body:{status}}); await refresh() }
function statusClass(status: string) { return status === 'approved' ? 'text-emerald-400' : status === 'rejected' ? 'text-red-400' : 'text-amber-300' }
</script>
<template>
  <div class="flex items-center justify-between"><h1 class="text-3xl font-black">Requests</h1><NuxtLink to="/admin" class="text-indigo-300">Dashboard</NuxtLink></div>
  <div class="card mt-6 overflow-hidden"><div class="overflow-x-auto"><table class="w-full min-w-[850px] text-left"><thead class="bg-slate-900"><tr><th class="p-4">User</th><th>Event</th><th>Channel</th><th>Date</th><th>Type</th><th>Status</th><th>Action</th></tr></thead><tbody><tr v-for="r in requests" :key="r.id" class="border-t border-slate-800"><td class="p-4">{{r.user_email}}</td><td>{{r.event_name}}</td><td>{{r.channel}}</td><td>{{r.event_date}}</td><td>{{r.request_type}}</td><td class="capitalize font-semibold" :class="statusClass(r.status)">{{r.status}}</td><td class="space-x-2"><button v-if="r.status !== 'approved'" @click="setStatus(r.id,'approved')" class="text-green-400">Approve</button><button v-if="r.status !== 'rejected'" @click="setStatus(r.id,'rejected')" class="text-red-400">Reject</button></td></tr></tbody></table></div></div>
</template>
