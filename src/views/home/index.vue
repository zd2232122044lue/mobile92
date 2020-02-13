<template>
  <div class="container">
    <!-- van-tab/van-tabs: 标签页组件
      v-model: 通过v-model绑定当前激活标签对应的索引值，默认情况下启用第一个标签
      title: 标题
    -->
    <van-tabs v-model="activeChannelIndex">
      <!-- <van-tab title="推荐"> -->
      <van-tab :title="item.name" v-for="item in channelList" :key="item.id">
        <!-- 使用文章列表组件 -->
          <!-- 获取文章列表,需要频道id条件,因此在父组件中要把当前频道id作为参数传递给子组件 -->
          <!-- 父组件(home/index.vue): 通过属性值方式传递频道id到子组件 -->
        <com-article :channelID="item.id"></com-article>
      </van-tab>
      <van-tab title="数据库">数据库内容展示</van-tab>
      <van-tab title="后端">后端内容展示</van-tab>
    </van-tabs>
  </div>
</template>

<script>
// 导入文章列表组件
import ComArticle from './components/com-article'
// 导入频道列表api函数
import { apiChannelList } from '@/api/channel.js'

export default {
  name: 'home-index',
  // 注册文章列表组件
  components: {
    ComArticle
  },
  data () {
    return {
      // 用户频道列表
      channelList: [],
      // 激活频道下标标志
      activeChannelIndex: 0
    }
  },
  created () {
    // 获取频道列表
    this.getChannelList()
  },
  methods: {
    // 获取频道列表
    async getChannelList () {
      const result = await apiChannelList()
      // data接收频道列表
      this.channelList = result.channels
    }
  }
}
</script>

<style scoped lang='less'>
.van-tabs {
  // 弹性布局
  display: flex;
  // 灵活的项目将垂直显示，正如一个列一样
  flex-direction: column;
  height: 100%;
  /deep/ .van-tabs__content {
    // flex:1;的值是1 1 0%，【父控件有剩余空间占1份放大，父控件空间不足按1缩小，自身的空间大小是0%】
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;

  }
  // 给频道下边沿横向设置样式
  /deep/ .van-tabs__line {
    background-color: #1989fa;
  }
}
</style>
