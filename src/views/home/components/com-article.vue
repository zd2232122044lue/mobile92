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
        <van-cell v-for="item in articleList" :key="item.art_id.toString()" :title="item.title">
          <!-- 命名插槽: 体现label的描述信息 -->
          <template slot="label">
            <!-- van-grid: 宫格组件,可以在水平方向上把页面分隔成等宽度的区块，用于展示内容或进行页面导航
            border: 设置宫格是否有边框
            column-num: 宫格列的数目
          van-grid-item: 宫格单元,内容区域,设置具体显示内容
          van-image: 显示图片的组件
            width: 宽度
            height: 高度
            src: 图片路径名地址
            -->
            <!-- 数据部分 通过cover.type  cover.images进行封面图片展示
                      v-if: 宫格是否有机会体现 type>0
                      column-num: type  1列 3列
            -->
            <van-grid :border="false" v-if="item.cover.type>0" :column-num="item.cover.type">
              <van-grid-item v-for="(item2,k2) in item.cover.images" :key="k2">
                <van-image width="90" height="90" :src="item2" lazy-load />
              </van-grid-item>
            </van-grid>
            <p>
              <!-- 给van-cell的右侧设置叉号按钮
                  van-icon: 图标组件
                      name: 图标样式
              -->

              <van-icon name="close" style="float:right;" @click="displayDialog()" />
              <span>作者: {{item.aut_name}}</span>&nbsp;
              <span>评论: {{item.comm_count}}</span>&nbsp;
              <!-- 使用过滤器 -->
              <span>时间: {{item.pubdate | formatTime}}</span>&nbsp;
            </p>
          </template>
        </van-cell>
      </van-list>
    </van-pull-refresh>
    <!-- 更多操作组件位置(举报,不感兴趣弹出框) -->
    <more-action v-model="showDialog"></more-action>
  </div>
</template>

<script>
// 导入获取文章的api函数
import { apiArticleList } from '@/api/article.js'
// 导入com-moreaction.vue弹出框组件
import MoreAction from './com-moreaction.vue'

export default {
  name: 'com-article',
  // 注册弹出框组件
  components: {
    MoreAction
  },
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
      showDialog: false, // 控制子组件弹出框是否显示
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
  // created () {
  //   // 获取文章列表
  //   this.getArticleList()
  // },
  methods: {
    // 获得文章列表
    async getArticleList () {
      const result = await apiArticleList({
        channel_id: this.channelID,
        timestamp: this.ts
      })
      console.log(result)
      // // data接收文章数据 直接赋值
      // this.articleList = result.results

      // articleList对新文章数据由之前的直接赋值变为现在的push追加

      // 把获得好的文章列表做return返回,具体是给onLoad瀑布使用,在瀑布流中实现push追加
      return result
    },
    // 瀑布流加载执行的方法
    async onLoad () {
      // 应用延迟器,使执行速度减慢
      await this.$sleep(800) // 该延迟器需要执行0.8秒
      // 设置await,使得当前的axios异步进程变为同步的,先执行完,再执行后续代码
      // --如果不这样做,articles.results.length会报错,因为articles里可能没有数据
      // 1. 获取文章列表数据
      const articles = await this.getArticleList()
      if (articles.results.length > 0) {
        // 2. 把获得到的文章数据push追加给articleList成员
        // -- articles.results: 文章的数组对象集[{art_id,title,aut_id,pubdate},{……},{……}]
        // -- ...articles.results: 扩展运算 {art_id,title,aut_id,pubdate},{……},{……}
        this.articleList.push(...articles.results)
        // 更新时间戳
        this.ts = articles.pre_timestamp // 继续请求,可以获得下页数据
      } else {
        // 4. 数据耗尽,停止瀑布流
        this.finished = true
      }
      // 3. 清除上拉动画效果
      this.loading = false
    },
    // onLoad () {
    // // 异步更新数据
    // // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    // // setTimeout设置延迟加载效果,有1秒延迟
    // setTimeout(() => {
    //   // 把数据信息追加给list数字
    //   for (let i = 0; i < 10; i++) {
    //     this.list.push(this.list.length + 1)
    //   }
    //   // 加载状态结束
    //   this.loading = false // 清除"加载中..."效果
    //   // 数据全部加载完成
    //   if (this.list.length >= 40) {
    //     this.finished = true // 停止瀑布流加载
    //   }
    // }, 1000)
    // },

    // 下拉刷新载入
    onRefresh () {
      setTimeout(() => {
        this.onLoad() // 获取数据一次
        this.isLoading = false // 暂停拉取
        this.$toast('刷新成功')
      }, 1000)
    },

    // 展示更多的弹层
    displayDialog () {
      this.showDialog = true
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
