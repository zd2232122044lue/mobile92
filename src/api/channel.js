// 导入axios模块
import request from '@/utils/request.js'

// 无论用户是否处于登录状态，都可以获取频道信息
// - 未登录：获取默认频道列表供展示（移动端的唯一标志[华为、苹果]信息会被传递给服务器端用以识别）
// - 已登录：获取当前用户拥有的频道进行展示（token数据被axios携带访问服务器端）

// 创建各种频道api

// 获取用户频道列表数据
export function apiChannelList () {
  return request({
    url: '/app/v1_0/user/channels',
    method: 'get'
  })
}
