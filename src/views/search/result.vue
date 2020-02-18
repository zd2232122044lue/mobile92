<template>
  <div class='container'>
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()" />
    <van-list 
      v-model="loading" 
      :finished="finished" 
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="item in list" :key="item" :title="item" /> 
    </van-list>
  </div>
</template>

<script>
// 导入根据联想关键字搜索文章的api
import { apiSearchList } from '@/api/search'
export default {
  name: 'search-result',
  computed:{
    // 获得路由参数q,使得组件内部可以通过this.q的简便方式获得路由参数
    q(){
      return this.$route.params.q
    }
  },
  data(){
    return {
      searchList: [], // 搜索结果
      // 瀑布流相关
      list: [],
      loading: false,
      finished: false
    }
  },
  created(){
    // 获得搜索结果
    this.getSearchList()
  },
  methods: {
    // 获得搜索结果
    async getSearchList(){
      let result = await apiSearchList({q:this.q})
      this.searchList = result.results
    },

    // 瀑布加载
    onLoad(){
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true
        }
    }, 1000)
   }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  box-sizing: border-box;
  .van-list {
    flex: 1;
    margin-top: 92px;
  }
}
</style>