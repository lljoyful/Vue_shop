import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
import Welcome from "../components/Wlecome.vue";
import Users from "../components/user/Users.vue";

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
      //重定向到子路由，需要些”/“
      redirect: "/welcome",
      children: [
        {
          path: "/welcome",
          component: Welcome,
        },
        {
          path: "/users",
          component: Users,
        },
      ],
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
