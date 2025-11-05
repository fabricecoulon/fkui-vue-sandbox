import { createRouter, createWebHashHistory } from "vue-router";
import DefaultView from "./views/DefaultView.vue";

const routes = [{ path: "/", name: "", component: DefaultView }];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
export { routes };
