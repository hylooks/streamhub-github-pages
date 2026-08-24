<script setup lang="ts">
import Hls from 'hls.js'

const props = defineProps<{ src: string }>()

const video = ref<HTMLVideoElement | null>(null)

const isEmbed = computed(() => {
  return /\/embed\//i.test(props.src)
})

onMounted(() => {
  if (isEmbed.value) return

  if (!video.value) return

  const isHls =
    /\.m3u8(\?|$)/i.test(props.src) ||
    props.src.includes('.m3u8')

  if (isHls) {
    if (video.value.canPlayType('application/vnd.apple.mpegurl')) {
      video.value.src = props.src
    } else if (Hls.isSupported()) {
      const h = new Hls()
      h.loadSource(props.src)
      h.attachMedia(video.value)
    }
  } else {
    video.value.src = props.src
  }
})
</script>

<template>
  <div class="overflow-hidden rounded-xl bg-black">
    <iframe
      v-if="isEmbed"
      :src="props.src"
      class="aspect-video w-full"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
      frameborder="0"
    />

    <video
      v-else
      ref="video"
      controls
      playsinline
      class="aspect-video w-full"
    />
  </div>
</template>