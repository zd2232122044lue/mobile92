import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入lib-flexible(设置 rem 基准值,也就是font-size)
import 'amfe-flexible/index.min.js'

// 引入vant组件库
import Vant from 'vant'
import 'vant/lib/index.css'

// 引入全局的自定义样式  在vant的样式文件之后引入,因为要覆盖vant的样式
import '@/assets/css/global.less'

// 引入vee-validate校验规则文件
import '@/utils/validate.js'

Vue.use(Vant)

// 创建一个延迟器
// --给vue增加继承成员,名称为$sleep,可自定义
Vue.prototype.$sleep = time => {
  // 返回一个Promise对象，应用端可以设置async/await使得异步变为同步
  //  同步可以使得后续代码都按照先后顺序执行
  return new Promise((resolve) => {
    // 定时器，规定在多久之后做一点事情，可以设定当前的延迟器等待的时间
    window.setTimeout(() => {
      // 该resolve()没有任何实质数据，应用端也不用接受
      resolve()
    }, time)
  })
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
