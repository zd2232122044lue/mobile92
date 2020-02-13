<template>
  <!-- scroll-wrapper 固定容器，通过css样式控制能够生成滚动条，将来需要使用滚动动作。 -->
  <div class="scroll-wrapper">
      <!-- 下拉刷新 -->

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
        <van-cell v-for="item in list" :key="item" :title="item" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  name: 'com-article',
  data () {
    return {
      // 下拉刷新标志
      isLoading: false,
      // 上拉相关成员 瀑布流相关成员
      list: [], // 接收加载好的数据
      loading: false, // 是否显示"加载中...".加载时设置为true,加载完成再设置为false.每次onLoad执行就设置为true,执行完毕设置为false
      finished: false // 加载是否停止的标志,false继续加载,true瀑布流停止加载
    }
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
