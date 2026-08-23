<script setup lang="ts">
import Hls from 'hls.js'
const props=defineProps<{src:string}>(); const video=ref<HTMLVideoElement|null>(null)
onMounted(()=>{ if(!video.value) return; if(video.value.canPlayType('application/vnd.apple.mpegurl')) video.value.src=props.src; else if(Hls.isSupported()){const h=new Hls();h.loadSource(props.src);h.attachMedia(video.value)} })
</script>
<template><div class="overflow-hidden rounded-xl bg-black"><video ref="video" controls playsinline class="aspect-video w-full"/></div></template>
