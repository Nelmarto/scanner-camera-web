import { createApp } from 'vue'
import App from './App.vue'
import router from './router'; 

const app = createApp(App);
app.use(router); // Agrega el router a la app
app.mount('#app');
