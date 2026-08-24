export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  const AD_URL =
    'https://debutpoignantsudden.com/c79q098me?key=3653cf3b29d1914cd75f69d847f614f4'

  const STORAGE_KEY = 'streamhub_clickunder_opened'

  const handleClick = () => {
    if (sessionStorage.getItem(STORAGE_KEY)) return

    sessionStorage.setItem(STORAGE_KEY, '1')
    window.open(AD_URL, '_blank', 'noopener,noreferrer')
  }

  window.addEventListener('click', handleClick, true)
})