<template>
  <div class="container">
    <h2>Capturar Imagen</h2>
    <CameraCapture v-if="imageId" :imageId="imageId" />
    <p v-else class="error">❌ No se encontró un ID en la URL.</p>
  </div>
</template>

<script>
import CameraCapture from "@/components/CameraCapture.vue";

export default {
  components: { CameraCapture },
  data() {
    return {
      imageId: null,
    };
  },
  mounted() {
    this.imageId = this.$route.query.id;
    console.log("🌍 CapturarView - ID desde la URL:", this.imageId);
  },
};
</script>
