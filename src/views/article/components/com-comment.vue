<template>
  <div class="comment">
    <!--van-list：实现瀑布加载效果-->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了"
              @load="onLoad">
      <van-cell v-for="item in list" :key="item">
        <!-- 作者头像 -->
        <div slot="icon">
          <img class="avatar"
               src="http://toutiao.meiduo.site/Fn6-mrb5zLTZIRG3yH3jG8HrURdU" alt="">
        </div>
        <!-- 作者名称 -->
        <div slot="title">
          <span>只是为了好玩儿</span>
        </div>
        <!-- 点赞 -->
        <div slot="default">
          <van-button icon="like-o" size="mini" plain> &nbsp;12 </van-button>
        </div>
        <!-- 评论内容和时间 -->
        <div slot="label">
          <p>hello world</p>
          <p>
            <span>2019-7-17 14:08:20</span>
            ·
            <span>4&nbsp;回复</span>
          </p>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>
<script>
export default {
  name: 'com-comment',
  data () {
    return {
      list: [],
      loading: false,
      finished: false
    }
  },
  methods: {
    onLoad () {
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 5; i++) {
          this.list.push(this.list.length + 1)
        }
        // 加载状态结束
        this.loading = false
        // 数据全部加载完成
        if (this.list.length >= 10) {
          this.finished = true
        }
      }, 500)
    }
  }
}
</script>
<style lang="less" scoped>
.comment{
  margin-top:15px;
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    margin-right: 10px;
  }
  /deep/ .van-cell__title{
    .van-cell__label{
      width:400px;
    }
  }
}
</style>
