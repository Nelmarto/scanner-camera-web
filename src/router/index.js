import { createRouter, createWebHistory } from "vue-router";
import CapturarView from "@/views/CapturarView.vue";

const routes = [
  {
    path: "/capturar",
    name: "capturar",
    component: CapturarView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
