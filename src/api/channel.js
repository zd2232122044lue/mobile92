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

// 添加频道
export function apiChannelAdd (channel) {
  return new Promise(function (resolve) {
    const key = store.state.user.token ? CHANNEL_KET_VIP : CHANNEL_KEY_TRAVEL // 获取缓存的key

    const localChannels = localStorage.getItem(key) // 获取本地缓存,即原有的"我的频道"数据
    // 频道不会为空，最少会保留“推荐”频道项目

    // 缓存有数据
    const channels = JSON.parse(localChannels) // 频道 字符串 变为 对象
    // localStorage内部存储的频道数据样子
    // channels [{id:xx,name:xx},{id:xx,name:xx}……]
    channels.push(channel) // 添加channel {id:xx,name:xx}

    // 重新写入缓存
    localStorage.setItem(key, JSON.stringify(channels))
    // 成功执行，没有任何返回信息(添加操作代码、系统没有问题，业务上不会出错)
    // 成功率100%
    resolve()
  })
}

// 删除频道
// --参数: id(被删除频道的id)
export function apiChannelDel (id) {
  return new Promise(function (resolve) {
    const key = store.state.user.token ? CHANNEL_KET_VIP : CHANNEL_KEY_TRAVEL // 获取缓存的key

    // 频道不能通过localStorage直接对"某个项目"做删除，必须取出来操作
    // 操作完毕再把数据更新给localStorage
    const localChannels = localStorage.getItem(key) // 获取缓存

    // 缓存有数据
    let channels = JSON.parse(localChannels)
    // 通过id，把被删除的频道中全部的数据里边排除出去
    channels = channels.filter(item => item.id !== id)

    // 重新写入缓存
    localStorage.setItem(key, JSON.stringify(channels))
    resolve() // 成功执行
  })
}

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
