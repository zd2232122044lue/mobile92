<template>
  <!-- scroll-wrapper 固定容器，通过css样式控制能够生成滚动条，将来需要使用滚动动作。 -->
  <div class="scroll-wrapper">
      <!-- 下拉刷新 -->
    <!-- van-pull-refresh: 下拉刷新
          基础用法: 下拉刷新时会触发 refresh 事件，在事件的回调函数中可以进行同步或异步操作，
                    操作完成后将 v-model 设置为 false，表示加载完成。
          v-model: 是否处于加载中状态
          @refresh: 下拉刷新时触发
    -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- 上拉刷新 -->
      <!-- van-list: 列表,瀑布流滚动加载，用于展示长列表，当列表即将滚动到底部时，会触发事件并加载更多列表项。
            基础用法: List 组件通过loading和finished两个变量控制加载状态，当组件滚动到底部时，
                      会触发load事件并将loading设置成true。
                      此时可以发起异步操作并更新数据，数据更新完毕后，将loading设置成false即可。
                      若数据已全部加载完毕，则直接将finished设置成true即可。
            v-model: 是否处于加载状态，加载过程中不触发load事件
            finished: 是否已加载完成，加载完成后不再触发load事件
            finished-text: 加载完成后的提示文案
            @load: 滚动条与底部距离小于 offset 时触发
      -->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- van-cell: 单元格组件,内容独占一行进行显示
                    title: 标题
        -->
          <!-- 模板中使用超大整型的数字,需要执行转变为字符串,调用toString()方法 -->
        <van-cell v-for="item in articleList" :key="item.art_id.toString()" :title="item.title" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 导入获取文章的api函数
import { apiArticleList } from '@/api/article.js'
export default {
  name: 'com-article',
  // 子组件(home/components/com-article.vue): 要接收父组件传的频道id,具体通过props实现
  props: {
    // 当前选中的频道id信息
    channelID: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      // 文章列表相关
      articleList: [],
      ts: Date.now(), // 时间戳函数,用于分页获取文章信息
      // 下拉刷新标志
      isLoading: false,
      // 上拉相关成员 瀑布流相关成员
      list: [], // 接收加载好的数据
      loading: false, // 是否显示"加载中...".加载时设置为true,加载完成再设置为false.每次onLoad执行就设置为true,执行完毕设置为false
      finished: false // 加载是否停止的标志,false继续加载,true瀑布流停止加载
    }
  },
  created () {
    // 获取文章列表
    this.getArticleList()
  },
  methods: {
    // 瀑布流加载执行的方法
    onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      // setTimeout设置延迟加载效果,有1秒延迟
      setTimeout(() => {
        // 把数据信息追加给list数字
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 加载状态结束
        this.loading = false // 清除"加载中..."效果
        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true // 停止瀑布流加载
        }
      }, 1000)
    },
    // 下拉刷新载入
    onRefresh () {
      setTimeout(() => {
        this.onLoad() // 获取数据一次
        this.isLoading = false // 暂停拉取
        this.$toast('刷新成功')
      }, 1000)
    },
    // 获得文章列表
    async getArticleList () {
      const result = await apiArticleList({
        channel_id: this.channelID,
        timestamp: this.ts
      })
      // data接收文章数据
      this.articleList = result.results
    }
  }
}
</script>

<style lang="less" scoped>
// 给上拉列表设置样式
.scroll-wrapper {
  height: 100%;
  overflow-y: auto;
}
</style>
