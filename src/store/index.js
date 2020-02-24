import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 通过vuex操作localStorage实现token数据的管理
//   localStorage是浏览器技术,本身没有响应式,用户体验不好,vuex有此技能,且vuex的数据可以被vue很好的监听

// 实际达成的效果:
// 1.用户直接操作vuex
// 2.vuex操控localStorage实现用户token等信息的管理
// 3.服务器端返回的token等信息要被vuex和localStorage接收
// 4..vuex有响应式,数据变化了可以马上感知,localStorage永久存储,页面关闭或者刷新数据不会丢失

// localStorage存储用户信息的key名称,统一设置,方便后续使用
const USER_KEY = 'hm-toutiao-m-user'

export default new Vuex.Store({
  state: {
    // 通过||设定,如果localStorage没有数据,就返回{}空对象
    user: JSON.parse(localStorage.getItem(USER_KEY) || '{}')
  },
  mutations: {
    // 修改/更新用户信息
    // data: { token:xxx, refresh_token:xxx }
    updateUser (state, data) {
      // 1.vuex做更新,使得有响应式
      state.user = data
      // 2.localStorage做永久更新
      localStorage.setItem(USER_KEY, JSON.stringify(data))
    },
    // 清除用户信息
    clearUser (state) {
      // 1.vuex做清除,使得有响应式
      state.user = {}
      // 2.localStorage做永久清除
      localStorage.removeItem(USER_KEY)
    },
    // 模拟删除token数据，
    clearToken (state) {
      delete state.user.token
    }
  },
  actions: {
  },
  modules: {
  }
})
