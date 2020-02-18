<template>
  <div class='container'>
    <van-nav-bar title="搜索结果" left-arrow @click-left="$router.back()" />
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
      searchList: [] // 搜索结果
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
    }
  }
}
</script>

<style scoped lang='less'></style>