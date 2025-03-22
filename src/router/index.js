import { createRouter, createWebHashHistory } from "vue-router";
import CapturarView from "@/views/CapturarView.vue";

const routes = [
  {
    path: "/capturar",
    name: "capturar",
    component: CapturarView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
