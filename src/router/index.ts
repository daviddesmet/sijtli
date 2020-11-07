import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/game/memory",
    name: "MemoryGame",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "game-memory" */ "../views/MemoryGame.vue")
  },
  {
    // pathMatch is the name of the param, e.g., going to /not/found yields
    // { params: { pathMatch: ['not', 'found'] }}
    // this is thanks to the last *, meaning repeated params and it is necessary if you
    // plan on directly navigating to the not-found route using its name
    path: "/:pathMatch(.*)*",
    // redirect: "404"
    component: () => import(/* webpackChunkName: "notfound" */ "../views/NotFound.vue")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
