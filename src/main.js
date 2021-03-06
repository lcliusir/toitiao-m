import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 全局样式
import './styles/index.less'
// vant
import Vant from 'vant'
// vant 样式
import 'vant/lib/index.css'
// 加载 rem 布局包
import 'amfe-flexible'
import './utils/dayjs'
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
