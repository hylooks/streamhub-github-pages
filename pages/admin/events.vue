<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const supabase = useSupabase()

const events = ref<any[]>([])
const loading = ref(true)
const saving = ref(false)
const editing = ref(false)
const error = ref('')

const form = reactive({
  id: 0,
  title: '',
  description: '',
  sport: 'Sports',
  thumbnail: '',
  start_time: '',
  status: 'upcoming',
  stream_url: ''
})

async function loadEvents() {
  loading.value = true
  error.value = ''

  const { data, error: loadError } = await supabase
    .from('events')
    .select('*')
    .order('start_time', { ascending: false })

  if (loadError) {
    console.error('Supabase events error:', loadError)
    error.value = loadError.message
  } else {
    events.value = data || []
  }

  loading.value = false
}

function reset() {
  Object.assign(form, {
    id: 0,
    title: '',
    description: '',
    sport: 'Sports',
    thumbnail: '',
    start_time: '',
    status: 'upcoming',
    stream_url: ''
  })

  editing.value = false
  error.value = ''
}

function edit(event: any) {
  Object.assign(form, {
    id: event.id,
    title: event.title || '',
    description: event.description || '',
    sport: event.sport || 'Sports',
    thumbnail: event.thumbnail || '',
    start_time: event.start_time?.slice(0, 16) || '',
    status: event.status || 'upcoming',
    stream_url: event.stream_url || ''
  })

  editing.value = true

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

async function save() {
  error.value = ''
  saving.value = true

  try {
    const payload = {
      title: form.title,
      description: form.description,
      sport: form.sport,
      thumbnail: form.thumbnail,
      start_time: form.start_time,
      status: form.status,
      stream_url: form.stream_url
    }

    if (editing.value) {
      const { error: updateError } = await supabase
        .from('events')
        .update(payload)
        .eq('id', form.id)

      if (updateError) {
        throw updateError
      }
    } else {
      const { error: insertError } = await supabase
        .from('events')
        .insert(payload)

      if (insertError) {
        throw insertError
      }
    }

    reset()
    await loadEvents()

  } catch (e: any) {
    console.error('Supabase save event error:', e)
    error.value = e?.message || 'Gagal menyimpan event'
  } finally {
    saving.value = false
  }
}

async function remove(id: number) {
  if (!confirm('Hapus event ini?')) {
    return
  }

  error.value = ''

  const { error: deleteError } = await supabase
    .from('events')
    .delete()
    .eq('id', id)

  if (deleteError) {
    console.error('Supabase delete event error:', deleteError)
    error.value = deleteError.message
    return
  }

  await loadEvents()
}

onMounted(() => {
  loadEvents()
})
</script>

<template>
  <div class="flex items-center justify-between">
    <div>
      <p class="text-sm text-indigo-400">
        ADMIN
      </p>

      <h1 class="text-3xl font-black">
        Manage Events
      </h1>
    </div>

    <NuxtLink
      to="/admin"
      class="text-indigo-300"
    >
      Dashboard
    </NuxtLink>
  </div>

  <!-- Form -->
  <form
    @submit.prevent="save"
    class="card mt-6 grid gap-3 p-5 md:grid-cols-2"
  >
    <h2 class="text-xl font-bold md:col-span-2">
      {{ editing ? 'Edit Event' : 'Add Event' }}
    </h2>

    <input
      v-model="form.title"
      required
      class="input"
      placeholder="Title"
    >

    <input
      v-model="form.sport"
      class="input"
      placeholder="Sport"
    >

    <input
      v-model="form.start_time"
      required
      type="datetime-local"
      class="input"
    >

    <select
      v-model="form.status"
      class="input"
    >
      <option value="upcoming">
        Upcoming
      </option>

      <option value="live">
        Live
      </option>

      <option value="vod">
        VOD
      </option>
    </select>

    <input
      v-model="form.thumbnail"
      class="input"
      placeholder="Thumbnail URL"
    >

    <input
      v-model="form.stream_url"
      class="input"
      placeholder="Authorized .m3u8 / MP4 / Embed URL"
    >

    <textarea
      v-model="form.description"
      class="input md:col-span-2"
      placeholder="Description"
    ></textarea>

    <div class="flex gap-2 md:col-span-2">
      <button
        type="submit"
        class="btn-primary disabled:opacity-50"
        :disabled="saving"
      >
        {{ saving ? 'Saving...' : editing ? 'Update' : 'Add Event' }}
      </button>

      <button
        v-if="editing"
        type="button"
        @click="reset"
        class="btn-secondary"
      >
        Cancel
      </button>
    </div>

    <p
      v-if="error"
      class="text-red-400 md:col-span-2"
    >
      {{ error }}
    </p>
  </form>

  <!-- Event List -->
  <div class="card mt-6 overflow-hidden">

    <div
      v-if="loading"
      class="p-5 muted"
    >
      Loading events...
    </div>

    <div
      v-else-if="!events.length"
      class="p-5 muted"
    >
      Belum ada event.
    </div>

    <div
      v-else
      class="overflow-x-auto"
    >
      <table class="w-full text-left">
        <thead class="bg-slate-900">
          <tr>
            <th class="p-4">
              Title
            </th>

            <th class="p-4">
              Status
            </th>

            <th class="p-4">
              Sport
            </th>

            <th class="p-4">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="event in events"
            :key="event.id"
            class="border-t border-slate-800"
          >
            <td class="p-4 font-semibold">
              {{ event.title }}
            </td>

            <td class="p-4">
              {{ event.status }}
            </td>

            <td class="p-4">
              {{ event.sport }}
            </td>

            <td class="p-4">
              <div class="flex gap-3">
                <button
                  @click="edit(event)"
                  class="text-indigo-300"
                >
                  Edit
                </button>

                <button
                  @click="remove(event.id)"
                  class="text-red-400"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>