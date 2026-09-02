<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const supabase = useSupabase()

const userEmail = ref('')
const events = ref<any[]>([])

const dashboardError = ref('')
const loading = ref(true)

async function loadDashboard() {
  loading.value = true
  dashboardError.value = ''

  // Cek user yang sedang login
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError) {
    dashboardError.value = `Auth error: ${userError.message}`
  }

  userEmail.value = userData.user?.email || '(tidak ada user)'

  // Ambil events
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('start_time', { ascending: false })

  if (error) {
    console.error('Supabase admin events error:', error)
    dashboardError.value = `Events error: ${error.message}`
  } else {
    events.value = data || []
  }

  loading.value = false
}

onMounted(() => {
  loadDashboard()
})
</script>

<template>
  <div class="flex items-end justify-between">
    <div>
      <p class="text-sm text-indigo-400">
        ADMIN
      </p>

      <h1 class="text-3xl font-black">
        Dashboard
      </h1>

      <p class="mt-2 text-sm text-slate-400">
        Login: {{ userEmail || 'checking...' }}
      </p>
    </div>

    <NuxtLink
      to="/admin/events"
      class="rounded-lg bg-indigo-500 px-4 py-2"
    >
      Manage events
    </NuxtLink>
  </div>

  <!-- Error -->
  <div
    v-if="dashboardError"
    class="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400"
  >
    {{ dashboardError }}
  </div>

  <!-- Stats -->
  <div class="mt-7 grid gap-4 md:grid-cols-2">

    <div class="card p-5">
      <p class="muted">
        Events
      </p>

      <p class="mt-2 text-3xl font-black">
        {{ loading ? '...' : events.length }}
      </p>
    </div>

    <div class="card p-5">
      <p class="muted">
        Live
      </p>

      <p class="mt-2 text-3xl font-black">
        {{
          loading
            ? '...'
            : events.filter((x: any) => x.status === 'live').length
        }}
      </p>
    </div>

  </div>

  <!-- Event list -->
  <div class="card mt-6 p-5">

    <h2 class="text-xl font-bold">
      Events dari Supabase
    </h2>

    <div
      v-if="loading"
      class="mt-4 muted"
    >
      Loading...
    </div>

    <div
      v-else-if="!events.length"
      class="mt-4 muted"
    >
      Tidak ada event yang terbaca.
    </div>

    <div
      v-for="event in events"
      :key="event.id"
      class="mt-4 rounded-lg border border-slate-800 p-4"
    >
      <p class="font-bold">
        {{ event.title }}
      </p>

      <p class="mt-1 text-sm text-slate-400">
        ID: {{ event.id }}
      </p>

      <p class="text-sm text-slate-400">
        Status: {{ event.status }}
      </p>
    </div>

  </div>
</template>