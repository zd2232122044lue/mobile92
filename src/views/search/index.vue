<template>
  <div class="container">
    <!-- left-arrow: 向左的箭头 -->
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()" />
    <!-- van-search 搜索组件
            v-model: 用于控制搜索框中的文字
    -->
    <van-search v-model.trim="searchText" placeholder="请输入搜索关键词"/>
    <van-cell-group>
      <van-cell title="单元格" icon="search"/>
      <van-cell title="单元格" icon="search"/>
      <van-cell title="单元格" icon="search"/>
      <van-cell title="单元格" icon="search"/>
      <van-cell title="单元格" icon="search"/>
      <van-cell title="单元格" icon="search"/>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'search-index',
  data () {
    return {
      searchText: '' // 搜索关键词
    }
  }
}
</script>

<style scoped lang='less'></style>
