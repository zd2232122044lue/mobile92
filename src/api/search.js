// 导入axios模块
import request from '@/utils/request.js'

// 获得联想建议数据
// 参数: q 联想的关键字
export function apiSuggestionList ({ q }) {
  return request({
    url: '/app/v1_0/suggestion',
    method: 'get',
    params: {
      q
    }
  })
}
