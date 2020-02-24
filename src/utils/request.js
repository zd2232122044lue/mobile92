// 封装request模块
// 把axios的许多公共信息配置成一个独立文件
// 做的工作:公共根地址,超大整型数字转换处理,请求拦截器,响应拦截器,401状态码处理

// 引入axios插件
import axios from 'axios'
// 处理大数字插件
import JSONBig from 'json-bigint'

// 导入路由.使得可以执行路由跳转
import router from '@/router/index.js'

// 引入vuex(用来判断用户是否登录系统)
// --store对象 是组件内部的this.$store
import store from '@/store'

// 创建一个axios实例instance  和原来的axios没有关系
// --不直接对axios进行操作的原因
// ----当前的instance是经过各种配置的axios对象,如果系统中还需要使用"原生的axios",直接用就可以
// ----如果直接对axios做各种配置,系统中就没有纯净的axios了,他们在系统中是同一个,一个文件修改,其他文件都会感知到
const instance = axios.create({
  // 请求公共根地址
  baseURL: 'http://ttapi.research.itcast.cn/',
  // 转换器,请求完毕的数据,超大整型数字做转换处理
  transformResponse: [function (data) {
    // data返回的形式有两种
    // --1.空体字符串
    // --2.空字符串(不能转的)
    // JSONBig.parse()对大整型进行处理

    // if (data) {
    //     return JSONBig.parse(data)
    // }
    // return data

    try {
      return JSONBig.parse(data)
    } catch (err) { // 如果data是空字符串,parse处理不来,会被catch捕捉处理
      return data
    }
  }]
})

// 配置请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 判断token存在再做配置(vuex判断)
    // --根据store.user.token是否有值,判断用户是否登录系统
    if (store.state.user.token) {
      config.headers.Authorization = 'Bearer ' + store.state.user.token
    }
    return config
  }, function (error) {
    return Promise.reject(error)
  })

// 配置响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 正常响应处理
    // --有时返回data,有时返回data.data
    try {
      return response.data.data
    } catch (err) {
      return response.data
    }
  }, async function (error) {
    // 响应有错误，有可能错误状态码为401
    if (error.response.status === 401) {
      // 如果refresh_token不存在
      if (!store.state.user.refresh_token) {
        router.push('/login')
        return Promise.reject(error)
      }

      try {
        // 刷新用户token
        // 应该发送一个请求 换取新的token
        // 这里不应该再用instance  因为 instance会再次进入拦截器  用默认的axios

        // token2小时已经失效，但是refresh_token 在客户端存在，不确定是否失效，此时要通过新的axios带着
        // refresh_token，向服务器端发请求，有可能把token的时效给刷新一次
        // 执行新的axios，不要执行instance了，其为401错误的状态信息
        // 接口：【刷新用户token】
        const result = await axios({
          method: 'put',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          // 配置token
          headers: {
            Authorization: `Bearer ${store.state.user.refresh_token}`
          }
        })
        // 获取到新token后，就对vuex和localStorage进行更新
        // 注意：axios通过refresh_token向服务器端发送请求，返回的数据信息中只有token，
        //      没有refresh_token
        store.commit('updateUser', {
          token: result.data.data.token, // 拿到新的token之后
          refresh_token: store.state.user.refresh_token // 将之前 refresh_token 获取使用
        })
        // error.config对象中存有之前失败请求的所有参数信息
        // 例如url、method、data等等
        // console.dir(error)
        return instance(error.config) // 把刚才错误的请求再次发送出去 然后将promise返回
        // instance({url:xx,method:xx,data:xx})
      } catch (err) {
        // 如果错误 表示补救措施也没用了(有可能refresh_token也失效了)
        // 应该跳转到登录页 并且 把废掉的用户信息全都干掉
        store.commit('clearUser') // 所有的用户信息清空
        router.push('/login') // 跳转到回登录页
        return Promise.reject(err)
      }
    }
    return Promise.reject(error)
  })

export default instance
