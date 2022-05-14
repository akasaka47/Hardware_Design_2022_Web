import Vue from 'vue'
import App from './App.vue'
/*导入路由*/
import router from './router'
/*导入elemnt-ui*/
import './plugins/element.js'
/* 导入全局样式表 */
import './assets/css/global.css'
import axios from 'axios'
import store from './store'

Vue.prototype.$axios = axios
// axios.defaults.baseURL = "http://localhost:8080"

// 请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
