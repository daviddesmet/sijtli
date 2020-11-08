import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    component: () => import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/stories",
    name: "Stories",
    component: () => import(/* webpackChunkName: "stories" */ "../views/Stories.vue")
  },
  {
    path: "/game/memory",
    name: "Memory",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "game-memory" */ "../views/Memory.vue")
  },
  {
    path: "/game/hangman",
    name: "Hangman",
    component: () => import(/* webpackChunkName: "game-hangman" */ "../views/Hangman.vue")
  },
  {
    path: "/game/puzzle",
    name: "JigsawPuzzleGame",
    component: () => import(/* webpackChunkName: "game-puzzle" */ "../views/JigsawPuzzleGame.vue")
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
