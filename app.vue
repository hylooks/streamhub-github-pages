<template>
  <div class="min-h-screen bg-[#05070b]">
    <NavBar />
    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <NuxtPage />
    </main>
    <footer class="mx-auto mt-16 max-w-7xl border-t border-slate-800/80 px-4 py-8 text-sm muted sm:px-6 lg:px-8">
      <div class="flex flex-col justify-between gap-3 sm:flex-row"><span>© {{ new Date().getFullYear() }} StreamHub</span><span>Live & on-demand events you own or are licensed to distribute.</span></div>
    </footer>
  </div>
</template>
