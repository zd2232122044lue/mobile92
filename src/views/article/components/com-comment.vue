<template>
  <div class="comment">
    <!--van-list：实现瀑布加载效果-->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in commentList" :key="item.com_id.toString()">
        <!-- 作者头像 -->
        <div slot="icon">
          <img class="avatar" :src="item.aut_photo" alt />
        </div>
        <!-- 作者名称 -->
        <div slot="title">
          <span>{{item.aut_name}}</span>
        </div>
        <!-- 点赞 -->
        <div slot="default">
          <!-- type="item.is_liking?'danger':'default'"
          设置当前用户是否点赞,来设置不同的样式-->
          <van-button
            icon="like-o"
            size="mini"
            plain
            type="item.is_liking?'danger':'default'"
          >&nbsp;{{item.like_count}}</van-button>
        </div>
        <!-- 评论内容和时间 -->
        <div slot="label">
          <p>{{item.content}}</p>
          <p>
            <span>{{item.pubdate | formatTime}}</span>
            ·
            <!-- 给回复按钮声明单击事件,传递评论id -->
            <span @click="openReply(item.com_id.toString())">{{item.reply_count}}&nbsp;回复</span>
          </p>
        </div>
      </van-cell>
    </van-list>

    <!-- 回复列表展示-弹出层/瀑布 -->
    <van-popup v-model="showReply" position="bottom" :style="{ height: '80%' }" round>
      <!-- 瀑布加载效果 -->
      <van-list
        v-model="reply.loading"
        :finished="reply.finished"
        finished-text="没有更多了"
        @load="onLoadReply"
      >
        <van-cell v-for="item in replyList" :key="item.com_id.toString()">
          <!-- 作者头像 -->
          <div slot="icon">
            <img class="avatar" :src="item.aut_photo" alt />
          </div>
          <!-- 作者名称 -->
          <div slot="title">
            <span>{{item.aut_name}}</span>
          </div>
          <!-- 评论内容和时间 -->
          <div slot="label">
            <p v-html="item.content"></p>
            <p>
              <span>{{item.pubdate | formatTime}}</span>
            </p>
          </div>
        </van-cell>
      </van-list>
    </van-popup>
    <!-- 添加评论或回复的小构件 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model="contentCorR" placeholder="写评论或回复...">
        <!-- van-loading设置加载图标，与提交进行配置使用slot="button"命名插槽，
                表明要给van-field的指定位置填充内容(右侧)
        -->
        <van-loading v-if="submitting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
  </div>
</template>
<script>
// 导入文章评论的api
import { apiCommentList } from '@/api/comment.js'
// 导入文章评论的回复的api
import { apiReplyList } from '@/api/reply.js'

export default {
  name: 'com-comment',
  computed: {
    // 简化路由参数获取
    aid () {
      return this.$route.params.aid
    }
  },
  data () {
    return {
      // 瀑布加载相关
      list: [],
      loading: false,
      finished: false,
      // 评论相关
      commentList: [], // 评论列表
      commentID: null, // 评论分页标志
      // 回复相关
      nowComID: '', // 被单击激活的评论id
      lastID: null, // 分页标志(null,前一次返回的last_id)
      replyList: [], // 回复列表
      showReply: false, // 回复弹出层是否展示
      reply: {
        list: [],
        loading: false,
        finished: false
      },
      // 添加评论或回复成员
      contentCorR: '', // 内容
      submitting: false // 是否正在提交
    }
  },
  methods: {
    // 评论瀑布流加载
    async onLoad () {
      await this.$sleep(800) // 暂停0.8s
      // 获取评论列表
      const result = await apiCommentList({
        articleID: this.aid,
        commentID: this.commentID
      })

      // 加载状态结束
      this.loading = false
      // 数据全部加载完成
      if (result.results.length === 0) {
        this.finished = true // 瀑布流停止加载
        return false
      }
      // 把获取到的数据追加给data
      this.commentList.push(...result.results)
      // 接收commentID
      this.commentID = result.last_id

      //   // 异步更新数据
      //   setTimeout(() => {
      //     for (let i = 0; i < 5; i++) {
      //       this.list.push(this.list.length + 1)
      //     }
      //     // 加载状态结束
      //     this.loading = false
      //     // 数据全部加载完成
      //     if (this.list.length >= 10) {
      //       this.finished = true
      //     }
      //   }, 500)
    },

    // 单击回复标志,展示回复弹出层
    openReply (commentID) {
      this.nowComID = commentID
      this.showReply = true // 展开弹出层
      // 对相关状态做初始化操作
      this.replyList = [] // 清除旧的回复数据
      this.reply.finished = false // 激活瀑布流
      this.lastID = null // 回复分页偏移量
    },

    // 回复瀑布流加载
    async onLoadReply () {
      await this.$sleep(800) // 暂停0.8s
      const result = await apiReplyList({
        commentID: this.nowComID,
        lastID: this.lastID
      })
      // 加载状态结束
      this.loading = false
      // 数据全部加载完成
      if (result.results.length === 0) {
        this.finished = true
        return false
      }
      // 把获取到的回复数据追加给data
      this.replyList.push(...result.results)
      // 接收分页标志的last_id信息
      this.lastID = result.last_id
    }
  }
}
</script>
<style lang="less" scoped>
.comment {
  margin-top: 15px;
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    margin-right: 10px;
  }
  /deep/ .van-cell__title {
    .van-cell__label {
      width: 400px;
    }
  }
}
// 添加评论或回复构件
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 88px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 24px;
    color: #3296fa;
  }
}
</style>
