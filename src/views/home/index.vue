<template>
  <div class="container">
    <!-- van-tab/van-tabs: 标签页组件
          v-model: 通过v-model绑定当前激活标签对应的索引值，默认情况下启用第一个标签
          title: 标题
    -->
    <van-tabs v-model="activeChannelIndex">
      <!-- 给标签页设置图标,用法是命名插槽
              slot="nav-right/right" 图标放置的位置
              class="channel-more" 设置css样式
      -->
      <div slot="nav-right" class="channel-more" @click="showChannel=true">
        <!-- 图标  name="wap-nav" 3杠图标 -->
        <van-icon name="wap-nav" />
      </div>
      <!-- 使用频道弹出层组件 -->
        <!-- :channelList="channelList": 把当前用户拥有的频道传递给频道组件里边显示
             :activeChannelIndex="activeChannelIndex": 当前激活频道项目的下标
        -->
      <com-channel
        v-model="showChannel"
        :channelList="channelList"
        :activeChannelIndex="activeChannelIndex"
      ></com-channel>
      <!-- <van-tab title="推荐"> -->
      <van-tab :title="item.name" v-for="item in channelList" :key="item.id">
        <!-- 使用文章列表组件 -->
        <!-- 获取文章列表,需要频道id条件,因此在父组件中要把当前频道id作为参数传递给子组件 -->
        <!-- 父组件(home/index.vue): 通过属性值方式传递频道id到子组件 -->
        <com-article :channelID="item.id"></com-article>
      </van-tab>
      <!-- <van-tab title="数据库">数据库内容展示</van-tab>
      <van-tab title="后端">后端内容展示</van-tab>-->
    </van-tabs>
  </div>
</template>

<script>
// 导入频道弹出层组件
import ComChannel from './components/com-channel'
// 导入文章列表组件
import ComArticle from './components/com-article'
// 导入频道列表api函数
import { apiChannelList } from '@/api/channel.js'

export default {
  name: 'home-index',
  // 注册组件
  components: {
    ComArticle,
    ComChannel
  },
  data () {
    return {
      // 频道操作弹出层组件显示标志
      showChannel: false,
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
      console.log(result)
      // data接收频道列表
      this.channelList = result.channels
    }
  }
}
</script>

<style scoped lang='less'>
// 给 更多 频道获得样式
.channel-more {
  position: fixed;
  right: 0;
  background-color: white;
  line-height: 88px;
  height: 88px;
  width: 90px;
  text-align: center;
  font-size: 40px;
}

// 频道列表
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
