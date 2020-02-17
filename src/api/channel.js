// 导入axios模块
import request from '@/utils/request.js'
// 导入vuex模块,以便知道当前用户是否登录系统
import store from '@/store'

// 无论用户是否处于登录状态，都可以获取频道信息
// - 未登录：获取默认频道列表供展示（移动端的唯一标志[华为、苹果]信息会被传递给服务器端用以识别）
// - 已登录：获取当前用户拥有的频道进行展示（token数据被axios携带访问服务器端）

// 创建各种频道api

// // 获取用户频道列表数据
// export function apiChannelList () {
//   return request({
//     url: '/app/v1_0/user/channels',
//     method: 'get'
//   })
// }

// 本地持久化存储频道设置的key
const CHANNEL_KEY_TRAVEL = 'hm-channel-travel' // 游客key
const CHANNEL_KET_VIP = 'hm-channel-vip' // 登录用户Key
// 获取用户频道列表数据
export function apiChannelList () {
  // 通过Promise封装,通过resolve返回输出具体信息,await修饰就接收到了,在home/index.vue中await apiChannelList()
  // 因为所有api接口的返回结果都是Promise对象,这样做兼容性好,应用层代码就不用修改了
  return new Promise(async (resolve) => {
    // 判断用户是否登录,并执行不同的key
    const key = store.state.user.token ? CHANNEL_KET_VIP : CHANNEL_KEY_TRAVEL
    // 获取本地频道数据
    const localChannels = localStorage.getItem(key)
    // localStorage内部存储频道数据的样子
    // -- [{id:xx.name:xx},{id:xx.name:xx}]
    if (localChannels) {
      // 如果内部有缓存好的频道,直接输出频道数据给外部
      resolve({ channels: JSON.parse(localChannels) })
    } else {
      // 如果内部没有缓存好的频道,走axios请求
      const result = await request({
        url: '/app/v1_0/user/channels',
        method: 'get'
      })
      // 在本地存储频道数据
      localStorage.setItem(key, JSON.stringify(result.channels))
      // 输出频道数据给外部
      resolve(result)
    }
  })
  // 现在无论是游客还是登录用户, 第一次获取频道数据都是发送axios请求,
  // 后续请求时就直接读取本地缓存数据了, 提高了系统性能
  // 如果用户退出系统,本地的数据会被清除
}

// 获取所有频道数据
export function apiChannelAll () {
  return request({
    url: '/app/v1_0/channels',
    method: 'get'
  })
}
