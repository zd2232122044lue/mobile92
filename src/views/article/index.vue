<template>
  <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="文章详情"></van-nav-bar>
    <div class="detail">
      <h3 class="title">{{articleDetail.title}}</h3>
      <div class="author">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="articleDetail.aut_photo"
        />
        <div class="text">
          <p class="name">{{articleDetail.aut_name}}</p>
          <p class="time">{{articleDetail.pubdate | formatTime}}</p>
        </div>
        <van-button round size="small"
          @click="followMe()"
          :loading="followLoading"
          :type="articleDetail.is_followed?'default':'info'">
          {{articleDetail.is_followed?'取消关注':'+关注'}}</van-button>
          <van-button @click="$store.commit('clearToken')">单独清除token</van-button>
      </div>
      <div class="content">
        <p v-html="articleDetail.content"></p>
      </div>
      <div class="zan">
        <van-button
          round
          size="small"
          :class="{active:articleDetail.attitude===1}"
          plain
          icon="like-o"
          style="margin-right:8px;"
        >点赞</van-button>
        <van-button
        round
        size="small"
        :class="{active:articleDetail.attitude===0}"
        plain
        icon="delete">不喜欢</van-button>
      </div>
      <com-comment></com-comment>
    </div>
  </div>
</template>

<script>
// 导入根据id获得文章详情信息的api
import { apiArticleDetail } from '@/api/article'
// 导入关注作者,取消关注作者的api
import { apiUserFollow, apiUserUnFollow } from '@/api/user.js'
// 导入评论组件
import ComComment from './components/com-comment'

export default {
  name: 'article-index',
  components: {
    ComComment
  },
  data () {
    return {
      articleDetail: {}, // 目标文章详情信息
      followLoading: false // 关注活动加载标志
    }
  },
  computed: {
    // 简化路由参数获取
    aid: function () {
      return this.$route.params.aid
    }
  },
  created () {
    this.getArticleDetail()
  },
  methods: {
    // 获得文章详情信息
    async getArticleDetail () {
      const result = await apiArticleDetail(this.aid)
      this.articleDetail = result
    },
    // 关注作者、取消关注作者
    async followMe () {
      this.followLoading = true // 开启加载状态

      await this.$sleep(800)// 暂停0.8s

      // 判断当前的关注状态，并做不同的处理活动
      if (this.articleDetail.is_followed) {
        // 取消关注
        await apiUserUnFollow(this.articleDetail.aut_id)
        // 页面上要更新关注状态--> + 关注 提示
        this.articleDetail.is_followed = false
      } else {
        // 关注(成功或失败)
        try {
          await apiUserFollow(this.articleDetail.aut_id)
          // 页面上要更新关注状态-->取消关注 提示
          this.articleDetail.is_followed = true
        } catch (err) {
          this.$toast.fail('不能自己关注自己！')
        }
      }
      this.followLoading = false // 恢复按钮状态
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 0 20px 88px;
  margin-top: 92px;
  .title {
    font-size: 36px;
    line-height: 2;
  }
  .zan {
    text-align: center;
    padding: 20px 0;
    .active {
      border-color: red;
      color: red;
    }
  }
  .author {
    padding: 20px 0;
    display: flex;
    position: sticky;
    background-color: #fff;
    top: 92px;
    z-index: 2;
    .text {
      flex: 1;
      padding-left: 20px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 40px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    p {
      font-size: 28px;
    }
    /deep/ img {
      max-width: 100%;
      background: #f9f9f9;
    }
    /deep/ code {
      white-space: pre-wrap;
    }
  }
}
</style>
