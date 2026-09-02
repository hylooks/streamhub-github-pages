<script setup lang="ts">
const supabase = useSupabase()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function login() {
  error.value = ''
  loading.value = true

  try {
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (loginError) {
      throw loginError
    }

    if (!data.user) {
  throw new Error('Login gagal: Supabase tidak mengembalikan user.')
}

if (data.user.email !== 'celosiarae26@gmail.com') {
  await supabase.auth.signOut()
  throw new Error('Akun ini bukan akun admin.')
}

await navigateTo('/admin')
  } catch (e: any) {
    error.value = e?.message || 'Login gagal'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-md">
    <div class="rounded-3xl border border-slate-800 bg-slate-950 p-7 shadow-2xl sm:p-10">
      <p class="text-xs font-black uppercase tracking-[.22em] text-indigo-400">
        StreamHub
      </p>

      <h1 class="mt-2 text-3xl font-black">
        Admin Sign in
      </h1>

      <p class="mt-2 text-sm muted">
        Sign in to manage events.
      </p>

      <form @submit.prevent="login" class="mt-7 space-y-4">
        <input
          v-model="email"
          class="input"
          placeholder="Admin email"
          autocomplete="email"
          required
        >

        <input
          v-model="password"
          type="password"
          class="input"
          placeholder="Password"
          autocomplete="current-password"
          required
        >

        <button
          :disabled="loading"
          class="btn-primary w-full disabled:opacity-50"
        >
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>

      <p v-if="error" class="mt-4 text-sm text-red-400">
        {{ error }}
      </p>
    </div>
  </div>
</template>