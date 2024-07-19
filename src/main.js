import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

import request from "@/utils/request";

Vue.use(ElementUI);

Vue.prototype.$request=request
Vue.prototype.$baseUrl=request.defaults.baseURL 


Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
