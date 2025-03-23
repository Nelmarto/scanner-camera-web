<template>
  <div class="container">
    <div v-if="!imageCaptured" class="camera-container">
      <video ref="video" autoplay playsinline class="camera-view"></video>
      <div class="button-group">
        <button @click="captureImage">📸 Tomar Foto</button>
        <button @click="switchCamera">🔄 Cambiar Cámara</button>
      </div>
    </div>

    <div v-else class="preview-container">
      <img :src="capturedImage" class="preview" />
      <div class="button-group">
        <button @click="uploadImage">⬆️ Subir Imagen</button>
        <button @click="resetCamera">🔄 Tomar otra</button>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  props: {
    imageId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      videoStream: null,
      capturedImage: null,
      imageCaptured: false,
      useFrontCamera: false,
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
          video: {
            facingMode: this.useFrontCamera ? "user" : "environment",
            width: { ideal: 1280 }, // Mejor resolución para documentos
            height: { ideal: 720 },
          },
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
          Swal.fire("Error", "No se encontró un ID válido en la URL", "error");
          return;
        }

        const payload = JSON.stringify({
          id: this.imageId,
          image: this.capturedImage.split(",")[1],
        });

        Swal.fire({
          title: "Subiendo...",
          text: "Por favor espera mientras se envía la imagen.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const response = await fetch(
          "https://scanner-camera-api-production.up.railway.app/api/upload",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
          }
        );

        if (!response.ok) {
          throw new Error(`Error en la respuesta: ${response.status}`);
        }

        const data = await response.json();
        console.log("Respuesta de la API:", data);

        Swal.fire(
          "¡Éxito!",
          "La imagen se envió correctamente.",
          "success"
        ).then(() => {
          // Si quieres limpiar la foto y volver a la cámara
          this.resetCamera();
        });
      } catch (error) {
        console.error("Error al enviar la imagen", error);
        Swal.fire(
          "Error",
          "No se pudo enviar la imagen. Revisa tu conexión o intenta de nuevo.",
          "error"
        );
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
.camera-container,
.preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.camera-view {
  width: 100%;
  max-width: 400px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}
.preview {
  width: 100%;
  max-width: 400px;
  border-radius: 10px;
  filter: contrast(1.3) brightness(1.1); /* Mejora el documento */
}
.button-group {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}
button {
  padding: 12px;
  font-size: 16px;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}
button:hover {
  background: #0056b3;
}
/* Diseño responsivo */
@media (max-width: 600px) {
  .camera-view,
  .preview {
    width: 100%;
  }

  button {
    width: 100%;
    padding: 10px;
  }

  .button-group {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
