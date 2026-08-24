export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  const hasync = (window as any)._Hasync = (window as any)._Hasync || []

  hasync.push(['Histats.start', '1,4425861,4,0,0,0,00010000'])
  hasync.push(['Histats.fasi', '1'])
  hasync.push(['Histats.track_hits', ''])

  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = true
  script.src = '//s10.histats.com/js15_as.js'

  document.head.appendChild(script)
})