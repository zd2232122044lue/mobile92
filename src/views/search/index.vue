<template>
  <div class="container">
    <!-- left-arrow: 向左的箭头 -->
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()" />
    <!-- van-search 搜索组件
            v-model: 用于控制搜索框中的文字
            @search: 搜索框敲回车键时会触发
    -->
    <van-search
      v-model.trim="searchText"
      placeholder="请输入搜索关键词"
      @search="onSearch(searchText)"
    />
    <!-- 联想建议 -->
    <van-cell-group v-if="suggestionList.length>0">
      <van-cell
      icon="search"
      v-for="(item,k) in suggestionList"
      :key="k"
      @click="onSearch(item)"
      >
        <!-- 通过slot="title"的命名插槽去覆盖渲染掉title属性
              v-html: 针对html标签,css样式,字符串内容都可以表现
              {{}}: 插值表达式只能表现字符串内容
        -->
        <div slot="title" v-html="hightlightCell(item,searchText)"></div>
      </van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <!-- 联想历史记录管理 -->
      <van-cell title="历史记录">
        <!--  slot="right-icon": 命名插槽给cell单元格的右边显示内容(垃圾桶图标)
              name="delete": 垃圾桶图标
              style="line-height:inherit": 设置内容高度与父级一致
        -->
        <van-icon
          @click="isDeleteData=true"
          v-show="!isDeleteData"
          slot="right-icon"
          name="delete"
          style="line-height:inherit"
        ></van-icon>
        <div v-show="isDeleteData">
          <span style="margin-right: 10px" @click="delAllSuggest()">全部删除</span>
          <span @click="isDeleteData=true">完成</span>
        </div>
      </van-cell>
       <!-- 历史联想项目数据展示 -->
      <van-cell v-for="(item,k) in suggestHistories" :title="item" :key="k">
      <!-- 删除按钮 -->
      <van-icon
        v-show="isDeleteData"
        slot="right-icon"
        name="close"
        style="line-height:inherit"
        @click="delSuggest(k)"
      ></van-icon>
    </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
// 导入获得联想建议数据的api
import { apiSuggestionList } from '@/api/search'
// 设置关键字历史记录的localStorage的key的名称,方便后续使用
const SH = 'suggest-histories'

export default {
  name: 'search-index',
  data () {
    return {
      searchText: '', // 搜索关键词
      suggestionList: [], // 联想建议数据
      isDeleteData: false, // 历史记录开关
      // 联想历史记录(如果本地有数据直接使用,否则设置空数组[])
      suggestHistories: JSON.parse(localStorage.getItem(SH)) || []
    }
  },
  watch: {
    // 对关键字做监听,有变化就要获取联想数据
    searchText: async function (newV) {
      // 针对this.timer做清除操作,防止定时器累加
      // 另一好处:用户频繁输入,间隔时间没有超过一秒,就没有请求动作
      clearTimeout(this.timer)
      // 放到这是为了解决飞快逐个删除关键字,页面会有残余的问题
      //   原因: 剩余最后一个关键字的检索动作没有被清除

      // 关键字如果为空,就停止联想获取
      if (!newV) {
        this.suggestionList = [] // 清除联想数据
        return false
      }

      // 设置防抖,防止频繁发送请求
      // --timer是组件data的成员,就是临时的,不用在data中事先声明
      // --this.timer表示给 组件实例 动态增加一个data成员，临时使用的可以不用提前声明
      this.timer = setTimeout(async () => {
        const result = await apiSuggestionList({ q: newV })
        // data接收联想建议数据
        this.suggestionList = result.options
      }, 1000)
    }
  },
  methods: {
    // 搜索关键字高亮
    // -item: (例)Vue 1.0.28 源码解析
    // -keywords: (例)vue
    hightlightCell (item, keywords) {
      // 创建正则对象的两种方式
      // --const reg = /^1[35789]\d{9}$/g
      // --const reg = new RegExp('/^1[35789]\d{9}$/','g')
      //  当前情况适合通过第二种情况创建,因为要把keywords变量解析出来
      const reg = new RegExp(`${keywords}`, 'i') // 正则,忽略大小写
      // 获得到匹配的内容
      // --能匹配到: rst[0]--->vue
      // --不能匹配到: rst=null
      const rst = item.match(reg)
      // 对关键字进行高亮处理
      // --字符串.replace(被替换内容/正则,替换内容)
      try {
        // 关键字匹配到内容
        return item.replace(reg, `<span style="color:red">${rst[0]}</span>`)
      } catch (err) {
        // 关键字没有匹配到内容,相关内容不做高亮显示,显示原样即可
        return item
      }
    },

    // 跳转到搜索结果页面
    onSearch (keywords) {
      // 没有联想内容,停止后续处理
      if (!keywords) {
        return false
      }
      // 根据已有的历史记录创建Set对象(Set可以保证相同的联想关键字只存储一份)
      const data = new Set(this.suggestHistories)
      // 存储访问的关键字
      data.add(keywords)
      // 把添加好的整体历史记录变为Array数组,赋予给data成员,使得页面及时显示(响应式)
      this.suggestHistories = Array.from(data)
      // 把联想关键字数组存储到localStorage里(名称为suggest-histories)
      localStorage.setItem(SH, JSON.stringify(this.suggestHistories))

      // 路由跳转
      this.$router.push({ name: 'result', params: { q: keywords } })
    },

    // 删除"全部"联想建议历史记录
    delAllSuggest () {
      // 页面删除
      this.suggestHistories = []
      // 本地删除
      localStorage.removeItem(SH)
    },
    // 删除"单个"联想建议历史记录
    delSuggest (index) {
      // 页面删除
      this.suggestHistories.splice(index, 1)
      // 本地删除
      localStorage.setItem(SH, JSON.stringify(this.suggestHistories))
    }
  }
}
</script>

<style scoped lang='less'></style>
