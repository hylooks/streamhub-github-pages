<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const { data, refresh } = await useFetch('/api/events')
const form = reactive({ id: 0, title: '', description: '', sport: 'Sports', thumbnail: '', start_time: '', status: 'upcoming', stream_url: '' })
const editing = ref(false)
const error = ref('')
function reset() { Object.assign(form, { id: 0, title: '', description: '', sport: 'Sports', thumbnail: '', start_time: '', status: 'upcoming', stream_url: '' }); editing.value = false; error.value = '' }
function edit(e:any) { Object.assign(form, e); form.start_time = e.start_time?.slice(0,16) || ''; editing.value = true; window.scrollTo({top:0, behavior:'smooth'}) }
async function save() {
  error.value=''
  try {
    if (editing.value) await $fetch(`/api/admin/events/${form.id}`, { method:'PUT', body:form })
    else await $fetch('/api/admin/events', { method:'POST', body:form })
    reset(); await refresh()
  } catch (e:any) { error.value = e?.data?.message || 'Gagal menyimpan event' }
}
async function remove(id:number) { if (!confirm('Hapus event ini?')) return; await $fetch(`/api/admin/events/${id}`, {method:'DELETE'}); await refresh() }
</script>
<template>
  <div class="flex items-center justify-between"><div><p class="text-sm text-indigo-400">ADMIN</p><h1 class="text-3xl font-black">Manage Events</h1></div><NuxtLink to="/admin" class="text-indigo-300">Dashboard</NuxtLink></div>
  <form @submit.prevent="save" class="card mt-6 grid gap-3 p-5 md:grid-cols-2">
    <h2 class="md:col-span-2 text-xl font-bold">{{ editing ? 'Edit Event' : 'Add Event' }}</h2>
    <input v-model="form.title" required class="input" placeholder="Title">
    <input v-model="form.sport" class="input" placeholder="Sport">
    <input v-model="form.start_time" required type="datetime-local" class="input">
    <select v-model="form.status" class="input"><option value="upcoming">Upcoming</option><option value="live">Live</option><option value="vod">VOD</option></select>
    <input v-model="form.thumbnail" class="input" placeholder="Thumbnail URL">
    <input v-model="form.stream_url" class="input" placeholder="Authorized .m3u8 URL">
    <textarea v-model="form.description" class="input md:col-span-2" placeholder="Description"></textarea>
    <div class="md:col-span-2 flex gap-2"><button class="btn-primary">{{ editing ? 'Update' : 'Add Event' }}</button><button v-if="editing" type="button" @click="reset" class="btn-secondary">Cancel</button></div>
    <p v-if="error" class="md:col-span-2 text-red-400">{{ error }}</p>
  </form>
  <div class="card mt-6 overflow-hidden"><table class="w-full text-left"><thead class="bg-slate-900"><tr><th class="p-4">Title</th><th>Status</th><th>Sport</th><th>Action</th></tr></thead><tbody><tr v-for="e in data" :key="e.id" class="border-t border-slate-800"><td class="p-4 font-semibold">{{e.title}}</td><td>{{e.status}}</td><td>{{e.sport}}</td><td class="space-x-3"><button @click="edit(e)" class="text-indigo-300">Edit</button><button @click="remove(e.id)" class="text-red-400">Delete</button></td></tr></tbody></table></div>
</template>
