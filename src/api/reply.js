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

// 添加评论或回复信息
// 参数:
//     target 文章或评论的id(评论文章即为文章id,对评论进行回复则为评论id)
//     content 评论或回复的内容
//     art_id 文章id,对评论内容发表回复时,需要传递此参数,表明是指定文章
//                   对文章进行评论,不需要传此参数
//     C comment评论
//     R reply回复
export function apiAddCorR ({ target, content, art_id = null }) {
  return request({
    url: '/app/v1_0/comments',
    method: 'POST',
    data: {
      target,
      content,
      art_id
    }
  })
}
