import Vue from "vue";
import VueRouter from "vue-router";

// import Login from "../components/Login.vue";
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ "../components/Login.vue");
// import Home from "../components/Home.vue";
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ "../components/Home.vue");
// import Welcome from "../components/Wlecome.vue";
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ "../components/Wlecome.vue");

// import Users from "../components/user/Users.vue";
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ "../components/user/Users.vue");
// import Rights from "../components/power/Rights.vue";
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ "../components/power/Rights.vue");
// import Roles from "../components/power/Roles.vue";
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ "../components/power/Roles.vue");

// import Cate from "../components/goods/Cate.vue";
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ "../components/goods/Cate.vue");
// import Params from "../components/goods/Params.vue";
const Params = () => import(/* webpackChunkName: "Cate_Params" */ "../components/goods/Params.vue");

// import List from "../components/goods/List.vue";
const List = () => import(/* webpackChunkName: "List_Add" */ "../components/goods/List.vue");
// import Add from "../components/goods/Add.vue";
const Add = () => import(/* webpackChunkName: "List_Add" */ "../components/goods/Add.vue");

// import Order from "../components/order/Order.vue";
const Order = () => import(/* webpackChunkName: "Order_Report" */ "../components/order/Order.vue");
// import Report from "../components/report/Report.vue";
const Report = () => import(/* webpackChunkName: "Order_Report" */ "../components/report/Report.vue");

Vue.use(VueRouter);

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
        {
          path: "/rights",
          component: Rights,
        },
        {
          path: "/roles",
          component: Roles,
        },
        {
          path: "/categories",
          component: Cate,
        },
        {
          path: "/params",
          component: Params,
        },
        {
          path: "/goods",
          component: List,
        },
        {
          path: "/goods/add",
          component: Add,
        },
        {
          path: "/orders",
          component: Order,
        },
        {
          path: "/reports",
          component: Report,
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
