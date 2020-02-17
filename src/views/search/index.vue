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

      // 针对this.timer做清除操作,防止定时器累加
      // 另一好处:用户频繁输入,间隔时间没有超过一秒,就没有请求动作
      clearTimeout(this.timer)

      // 设置防抖,防止频繁发送请求
      // --timer是组件data的成员,就是临时的,不用在data中事先声明
      // --this.timer表示给 组件实例 动态增加一个data成员，临时使用的可以不用提前声明
      this.timer = setTimeout(async () => {
        const result = await apiSuggestionList({ q: newV })
        // data接收联想建议数据
        this.suggestionList = result.options
      }, 1000)
    }
  }
}
</script>

<style scoped lang='less'></style>
