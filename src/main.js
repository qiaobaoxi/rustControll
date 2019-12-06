import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import routes from './routes'
import ElementUI from 'element-ui';
import axios from 'axios';
import Vueaxios from 'vue-axios';
import 'element-ui/lib/theme-chalk/index.css';
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)
Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(Vueaxios,axios);

const router = new VueRouter({
  routes
})
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.url=config.url+'?sign=1'+"&name="+sessionStorage.getItem("name");
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
// 添加响应拦截器
axios.interceptors.response.use(function (config) {
  // 在发送请求之前做些什么
  if(config.data.msg===2000){
    sessionStorage.clear();
    return router.push('/login')
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
router.beforeEach((to, from, next) => {
  //NProgress.start();
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
