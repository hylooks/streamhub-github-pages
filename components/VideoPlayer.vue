<script setup lang="ts">
import Hls from 'hls.js'

const props = defineProps<{ src: string }>()

const video = ref<HTMLVideoElement | null>(null)
const iframe = ref<HTMLIFrameElement | null>(null)
const showClickOverlay = ref(false)

const STORAGE_KEY = 'streamhub_clickunder_opened'

const isEmbed = computed(() => {
  return /^https?:\/\//i.test(props.src) && !/\.(m3u8|mp4|webm|ogg)(\?.*)?$/i.test(props.src)
})

const openClickunder = () => {
  if (typeof window === 'undefined') return

  if (sessionStorage.getItem(STORAGE_KEY)) {
    showClickOverlay.value = false
    return
  }

  sessionStorage.setItem(STORAGE_KEY, '1')

  window.open(
    'https://debutpoignantsudden.com/c79q098me?key=3653cf3b29d1914cd75f69d847f614f4',
    '_blank',
    'noopener,noreferrer'
  )

  showClickOverlay.value = false
}

onMounted(() => {
  if (isEmbed.value) {
    showClickOverlay.value =
      !sessionStorage.getItem(STORAGE_KEY)

    return
  }

  if (!video.value) return

  if (video.value.canPlayType('application/vnd.apple.mpegurl')) {
    video.value.src = props.src
  } else if (Hls.isSupported()) {
    const h = new Hls()
    h.loadSource(props.src)
    h.attachMedia(video.value)
  } else {
    video.value.src = props.src
  }
})
</script>

<template>
  <div class="relative overflow-hidden rounded-xl bg-black">
    <video
      v-if="!isEmbed"
      ref="video"
      controls
      playsinline
      class="aspect-video w-full"
    />

    <iframe
      v-else
      ref="iframe"
      :src="props.src"
      class="aspect-video w-full border-0"
      allowfullscreen
      allow="autoplay; fullscreen"
    />

    <button
      v-if="isEmbed && showClickOverlay"
      type="button"
      aria-label="Continue to video"
      class="absolute inset-0 z-10 h-full w-full cursor-pointer bg-transparent"
      @click="openClickunder"
    />
  </div>
</template>