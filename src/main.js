import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入lib-flexible(设置 rem 基准值,也就是font-size)
import 'amfe-flexible/index.min.js'

// 引入vant组件库
import Vant from 'vant'
import 'vant/lib/index.css'

// 引入全局的自定义样式  因为要覆盖vant的样式
import '@/assets/css/global.less' 

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
