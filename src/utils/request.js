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
//--store对象 是组件内部的this.$store
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
    }, function (error) {
        // 非正常响应处理(包括401)
        if (error.response.status === 401) {
            // token不OK(在服务器端已经失效了,2小时时效)
            // 强制用户重新登录系统,刷新服务器端的token时效
            router.push('/login')
            return new Promise(function () { })
            // 空的promise对象,没有机会执行catch,进而不做错误提示了
        }
        return Promise.reject(error)
    })


export default instance