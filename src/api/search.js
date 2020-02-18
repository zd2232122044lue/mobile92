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

// 根据联想关键字搜索文章
// 参数: q 联想的关键字
//       page 页码
//       per_page 返回内容条数
//   page = 1, per_page = 10 对象结构赋值: 给参数设置默认值
export function apiSearchList ({ q, page = 1, per_page = 10 }) {
  return request({
    url: '/app/v1_0/search',
    method: 'get',
    params: {
      q,
      page,
      per_page
    }
  })
}
