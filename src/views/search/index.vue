<template>
  <div class="container">
    <!-- left-arrow: 向左的箭头 -->
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()" />
    <!-- van-search 搜索组件
            v-model: 用于控制搜索框中的文字
    -->
    <van-search v-model.trim="searchText" placeholder="请输入搜索关键词"/>
    <!-- 联想建议 -->
    <van-cell-group>
      <van-cell
      :title="item"
      icon="search"
      v-for="(item,k) in suggestionList"
      :key="k"
      />
    </van-cell-group>
  </div>
</template>

<script>
// 导入获得联想建议数据的api
import { apiSuggestionList } from '@/api/search'

export default {
  name: 'search-index',
  data () {
    return {
      searchText: '', // 搜索关键词
      suggestionList: [] // 联想建议数据
    }
  },
  watch: {
    // 对关键字做监听,有变化就要获取联想数据
    searchText: async function (newV) {
      // 关键字如果为空,就停止联想获取
      if (!newV) {
        this.suggestionList = [] // 清除联想数据
        return false
      }
      const result = await apiSuggestionList({ q: newV })
      // data接收联想建议数据
      this.suggestionList = result.options
    }
  }
}
</script>

<style scoped lang='less'></style>
