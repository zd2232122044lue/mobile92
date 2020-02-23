<template>
  <!-- 小智同学的页面结构 -->
 <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <van-button @click="uncon()">断开连接</van-button>
    <div class="chat-list" ref="talkArea">
      <div
        class="chat-item"
        :class="[item.name==='xz'?'left':'right']"
        v-for="(item,k) in talks"
        :key="k"
      >
        <van-image fit="cover" round v-if="item.name==='xz'" :src="XZImg" />
        <div class="chat-pao">{{item.msg}}</div>
        <van-image fit="cover" round v-if="item.name==='vip'" :src="userInfo.photo" />
      </div>
      <!-- <div class="chat-item right">
        <div class="chat-pao">没看正忙，挖沙呢</div>
        <van-image  fit="cover" round :src="userInfo.photo" />
      </div> -->
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="content" placeholder="说点什么..." @keyup.enter="send()">
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
// 导入小智头像
import XZImg from '@/assets/img/xz.png'
// 导入获取用户信息的api
import { apiUserInfo } from '@/api/user'
// 引入socket.io的客户端代码
import io from 'socket.io-client'

export default {
  name: 'user-chat',
  data () {
    return {
      // 专门存放聊天信息 一条记录代表一个消息
      // [{msg:'',timestamp:'',name:'xz'},{msg:'',timestamp:'',name:'vip'}……]
      // msg和timestamp都是api接口服务器端要求的名字  xz: 小智   vip: 用户
      talks: [],
      socket: null, // 存储socket对象
      apiUserInfo: null, // 用户信息
      XZImg, // 小智头像
      content: '', // 即将发表的聊天内容
      loading: false // 是否正在提交留言
    }
  },
  created () {
    this.getUserInfo()
    this.setSocket()
  },
  // 页面销毁之前的钩子函数
  beforeDestory () {
    // 销毁连接
    this.socket.close() // 销毁连接
  },
  methods: {
    // 关闭连接
    uncon () {
      this.socket.close()
    },

    // 建立与 服务器端的socket连接
    setSocket () {
      // query代表以请求字符串形式传递token参数
      // 请求地址为：http://ttapi.research.itcast.cn/socket.io/?token=xxx&a=xx&a=xx
      // 其中的socket.io是内部自动添加的，不用理会
      // 请求字符串：把参数信息通过?与请求地址做连接发送到服务器端，形式 ?name=value&name=value……
      this.socket = io('http://ttapi.research.itcast.cn', {
        // query:会使得参数以“请求字符串”形式挂接到请求地址的后边
        query: {
          token: this.$store.state.user.token
        }
      })
      // io调用时会与服务器端连接，成功后会自动调用如下的connect事件
      // 具体是服务器端通过emit()调用如下事件的
      this.socket.on('connect', () => {
        // 客户端与服务器连接成功后会自动调用该事件
        console.log('连接成功')
        // 小智先发言，暖下场
        this.talks.push({
          msg: '干啥呢outman，咋这长时间不联系了？',
          timestamp: Date.now(),
          name: 'xz'
        }) // name:xz 表示这句话是小智同学说的
      })
      // 服务器端----->客户端 发送消息时候会自动调用该事件
      // 进而接收回传回来的数据
      this.socket.on('message', data => {
        // data: {msg:xx,timestamp:xx}
        this.talks.push({ ...data, name: 'xz' })
        // ... 三点是做展开运算的，形成如下效果
        // this.talks.push({ msg:xx,timestamp:xx, name: 'xz' })

        // 数据追加完毕，设置滚动条跑到最底部，以便显示最新数据
        this.scrollBottom()
      })
      // 服务器端---->客户端  告知连接已关闭(非必须的)
      this.socket.on('disconnect', () => {
        console.log('连接已关闭')
      })
    },

    // 获取用户信息
    async getUserInfo () {
      this.userInfo = await apiUserInfo()
    },

    // 用户与小智热聊中……
    async send () {
      // 如果没有填写留言，停止执行
      if (!this.content) return false

      // 变为发送留言状态
      this.loading = true

      // 把用户的留言信息，变为一条聊天记录
      // msg 和  timestamp 是服务器端要求的名字
      const obj = {
        name: 'vip', // 用户标志
        msg: this.content, // 消息内容
        timestamp: Date.now() // 时间戳给什么 应该给当前的时间戳
      }
      // 应该把刚发送的消息 加到 消息列表里面
      this.talks.push(obj) // 响应式缘故--->页面及时显示

      // 使得滚动条在拖动到聊天内容最底部
      this.scrollBottom()

      // 清空本身的消息内容
      this.content = '' // 清空内容

      // 延迟0.5秒
      await this.$sleep(500)

      // 发送这条消息到服务端   emit 发送消息 on接收消息
      // 服务器端接收后会向客户端返回对话信息
      this.socket.emit('message', obj) // 发送消息

      this.loading = false // 恢复状态
    },

    // 滚动到底部
    scrollBottom () {
      this.$nextTick(() => {
        // 可以保证 在滚动的时候 视图已经更新完毕
        this.$refs.talkArea.scrollTop = this.$refs.talkArea.scrollHeight
        // scrollHeight  (文档内容实际高度，包括超出视窗的溢出部分)
        // scrollTop  (滚动条滚动距离)

        // 用到了一个this.$nextTick方法,这是由于我们的vue是通过数据驱动视图,
        //  但是数据变化之后, 视图的更新并没有立即完成
        // this.$nexttick可以保证数据变化、视图通过响应式完成了更新，之后再做一些事情
        //  如果不使用这个技术，造成的后果是：增加聊天记录后，滚动条没有滚动到最底部
        //  此时流程是这样的、是错误的：数据变化--->滚动条滚动--->视图更新，(滚动条做了一次无用功)
        //  正确的流程是：数据变化---->视图更新---->滚动条滚动，视图更新后滚动条滚动才会变得有意义
      })
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 92px 0 100px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 20px;
      .van-image{
        vertical-align: top;
        width: 80px;
        height: 80px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 80px;
        max-width: 140%;
        min-height: 80px;
        line-height: 76px;
        border: 1px solid #c2d9ea;
        border-radius: 8px;
        position: relative;
        padding: 0 20px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 28px;
        color: #333;
        &::before{
          content: "";
          width: 20px;
          height: 20px;
          position: absolute;
          top: 24px;
          border-top:1px solid #c2d9ea;
          border-right:1px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 30px;
    &::before{
      right: -12px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 30px;
    margin-right: 0;
    &::before{
      left: -10px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 88px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
