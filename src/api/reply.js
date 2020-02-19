// 引入封装的模块
import request from '@/utils/request'

// 回复 相关的请求函数

// 获取指定评论的所有回复信息
// 参数:
//     commentID 评论id
//     replyID 回复id
//     type: 'c' 获取评论的回复信息
//     source: commentID 表示针对指定评论获得回复
//     offset: commentID 分页参数,获取评论数据的偏移量,值为评论id
//             表示从此id的数据向后取,不传表示从第一页开始读取数据
//              timestamp(pre_timestamp)分页标志
//                 offset=null  ----------> 第一页数据(返回last_id,代表最后一条评论信息的id)
//                 offset=last_id---------> 第二页数据(返回last_id)
//                 offset=last_id---------> 第三页数据(返回last_id)
//                 offset=last_id
//                 ……
//                 如此反复，就可以实现获得下页数据的分页功能了
//     limit: 10 每次返回10条评论信息
export function apiReplyList ({ commentID, lastID }) {
  return request({
    url: '/app/v1_0/comments',
    method: 'get',
    params: {
      type: 'c',
      source: commentID,
      offset: lastID,
      limit: 10
    }
  })
}
