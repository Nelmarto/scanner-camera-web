<template>
  <div class="container">
    <h2>Capturar Imagen</h2>

    <div v-if="!imageCaptured">
      <video ref="video" autoplay playsinline class="camera-view"></video>
      <button @click="captureImage">Tomar Foto</button>
      <button @click="switchCamera">Cambiar Cámara</button>
    </div>

    <div v-else>
      <img :src="capturedImage" class="preview" />
      <button @click="uploadImage">Subir Imagen</button>
      <button @click="resetCamera">Tomar otra</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imageId: {
      type: String,
      required: true, // Asegurar que venga como obligatorio
    },
  },
  data() {
    return {
      videoStream: null,
      capturedImage: null,
      imageCaptured: false,
      useFrontCamera: false, // Estado para alternar entre cámaras
    };
  },
  mounted() {
    this.startCamera();
    console.log("📷 CameraCapture - ID recibido:", this.imageId);
    if (!this.imageId) {
      console.error("❌ ERROR: No se recibió un ID en CameraCapture.vue");
    }
  },
  methods: {
    async startCamera() {
      try {
        if (this.videoStream) {
          this.videoStream.getTracks().forEach((track) => track.stop());
        }

        this.videoStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: this.useFrontCamera ? "user" : "environment" }, // Frontal o trasera
        });

        this.$refs.video.srcObject = this.videoStream;
      } catch (error) {
        console.error("No se pudo acceder a la cámara", error);
      }
    },
    switchCamera() {
      this.useFrontCamera = !this.useFrontCamera; // Alternar entre frontal y trasera
      this.startCamera(); // Reiniciar la cámara con la nueva configuración
    },
    captureImage() {
      const canvas = document.createElement("canvas");
      const video = this.$refs.video;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, canvas.width, canvas.height);
      this.capturedImage = canvas.toDataURL("image/png"); // Convierte a Base64
      this.imageCaptured = true;
      this.videoStream.getTracks().forEach((track) => track.stop()); // Detiene la cámara
    },
    resetCamera() {
      this.imageCaptured = false;
      this.capturedImage = null;
      this.startCamera();
    },
    async uploadImage() {
      try {
        if (!this.imageId) {
          console.error("No se encontró un ID en la URL CameraCapture.vue");
          return;
        }

        const payload = JSON.stringify({
          id: this.imageId,
          image: this.capturedImage.split(",")[1],
        });
        console.log("Enviando:", payload); // Ver qué se está enviando

        const response = await fetch("http://localhost:8082/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
        });

        if (!response.ok) {
          throw new Error(`Error en la respuesta: ${response.status}`);
        }

        const data = await response.json();
        console.log("Respuesta de la API:", data);
      } catch (error) {
        console.error("Error al enviar la imagen", error);
      }
    },
  },
};
</script>

<style>
.container {
  text-align: center;
  padding: 20px;
}
.camera-view {
  width: 100%;
  max-width: 400px;
}
.preview {
  width: 100%;
  max-width: 400px;
}
button {
  margin: 10px;
  padding: 10px;
  cursor: pointer;
}
</style>
