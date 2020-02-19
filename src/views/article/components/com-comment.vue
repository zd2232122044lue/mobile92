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
            <span @click="showReply=true">{{item.reply_count}}&nbsp;回复</span>
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
        <van-cell v-for="item in reply.list" :key="item" :title="item">
          <!-- 作者头像 -->
          <div slot="icon">
            <img class="avatar" src="http://toutiao.meiduo.site/Fn6-mrb5zLTZIRG3yH3jG8HrURdU" alt />
          </div>
          <!-- 作者名称 -->
          <div slot="title">
            <span>度娘</span>
          </div>
          <!-- 评论内容和时间 -->
          <div slot="label">
            <p>好厉害呀</p>
            <p>
              <span>2019-12-30 15:15:15</span>
            </p>
          </div>
        </van-cell>
      </van-list>
    </van-popup>
  </div>
</template>
<script>
// 导入文章评论的api
import { apiCommentList } from '@/api/comment.js'

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
      showReply: false, // 回复弹出层是否展示
      reply: {
        list: [],
        loading: false,
        finished: false
      }
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

    // 回复瀑布流加载
    onLoadReply () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.reply.list.push(this.reply.list.length + 1)
        }

        // 加载状态结束
        this.reply.loading = false

        // 数据全部加载完成
        if (this.reply.list.length >= 40) {
          this.reply.finished = true
        }
      }, 1000)
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
</style>
