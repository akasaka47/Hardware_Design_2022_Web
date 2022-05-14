import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/Home.vue";
import Welcome from "../components/Welcome.vue";
import Login from "../components/Login.vue"
import Data0 from "../components/data/data0.vue"
import Data1 from "../components/data/data1.vue"
import user from "../components/admin/user.vue"
import map_NY from "../components/map/map_NY.vue"
import map_NY_hot from "../components/map/map_NY_hot.vue"
import CDF_chart from "../components/data/CDF.vue"

Vue.use(VueRouter);

const routes = [      // 页面导航
  { path: "/", redirect: "/login" },    // 登录界面
  { path: "/login", component: Login },
  {
    path: "/home",
    component: Home,
    redirect: '/welcome',
    children: [
      { path: "/welcome", component: Welcome },             // 欢迎页面
      { path: "/data/train", component: Data0 },            // 训练集数据
      { path: "/data/test", component: Data1 },             // 测试集数据
      { path: "/admin/users", component: user },            // 用户管理界面
      { path: "/map/map_NY", component: map_NY },           // 南一楼地图
      { path: "/map/map_NY_hot", component: map_NY_hot },   // 热力图
      { path: "/data/CDF", component: CDF_chart }           // CDF、误差分析界面
    ],
  },
];

const router = new VueRouter({
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从哪个路径来
  // next 是一个函数，表示放行
  // next();  或  next("/login");
  if (to.path === "/") return next('/login');
  if (to.path === "/login") return next();
  const tokenstr = window.sessionStorage.getItem('token');
  if (!tokenstr) return next('/login');
  next();
})

export default router;
