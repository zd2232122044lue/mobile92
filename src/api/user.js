// 导入axios模块
import request from '@/utils/request.js'

// 创建各种api方法

/*
    对登录账户信息进行校验(es6按需导出动作)
        @param {手机号码} mobile
        @param {验证码} code
        本来传递的参数为data  data: {mobile:xx,code:xx}
          现在改造为{ mobile, code }(对象结构赋值),使得不用看文档,也可以知道传递的具体参数
        业务组件应用(与之前套路一致)：apiUserLogin({mobile:'13922223333',code:2233})
*/
export function apiUserLogin ({ mobile, code }) {
  // 请求axios,request就是axios的复制品,操作结构完全一致
  // return返回执行结果,是Promise对象
  return request({
    url: '/app/v1_0/authorizations',
    method: 'post',
    data: {
      // 对象成员简易赋值
      mobile, // mobile:mobile
      code // code:code
    }
    // params: get请求成员标志
    // data: 非get请求成员标志
  })
}

// 关注作者
// 参数: target 被关注用户id
export function apiUserFollow (target) {
  return request({
    method: 'post',
    url: '/app/v1_0/user/followings',
    data: {
      // 成员简易赋值
      target
    }
  })
}

// 取消关注作者
// 参数: target 取消关注用户id
export function apiUserUnFollow (target) {
  return request({
    method: 'delete',
    url: `/app/v1_0/user/followings/${target}`
  })
}

// 获取用户自己信息
export const apiUserInfo = () => {
  return request({
    url: '/app/v1_0/user',
    method: 'GET'
  })
}

// 获取用户个人资料
export function apiUserProfile () {
  return request({
    url: '/app/v1_0/user/profile', // 地址
    method: 'get'
  })
}

// 修改用户头像
// 参数:  fdObj FormData对象,拥有photo成员,代表被上传头像的文件对象
//           FormData是html5发布的技术,可以实现普通表单域信息和上传文件域信息的收集工作
export function apiUserPhoto (fdObj) {
  return request({
    url: '/app/v1_0/user/photo', // 编辑头像的地址
    method: 'patch', // 设置头像的类型
    data: fdObj
  })
}

// 更新用户资料
// 参数:
//     name 用户昵称
//     gender 用户性别
//     birthday 生日
export function apiSaveProfile ({ name, gender, birthday }) {
  return request({
    url: '/app/v1_0/user/profile', // 编辑资料的地址
    data: {
      name,
      gender,
      birthday
    },
    method: 'patch'
  })
}
