import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";

const router = new VueRouter({
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/home",
      component: Home,
    },
  ],
});
router.beforeEach((to, from, next) => {
  if (to.path == "/login") return next();
  const strToken = window.sessionStorage.getItem("token");
  if (strToken) return next();
  else {
    // 没有token，重定向到登录页面
    return next("./login");
  }
});

export default router;
