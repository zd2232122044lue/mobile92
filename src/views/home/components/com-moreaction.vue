<template>
  <div>
      <!-- van-dialog: 弹出模态框，常用于消息提示、消息确认、在当前页面内完成特定的交互操作
                    弹出框组件支持函数调用和组件调用两种方式
            show-confirm-button: 是否展示确认按钮
            close-on-click-overlay: 是否在点击遮罩层后关闭弹窗
            @input: 当前组件的value值发生变化,要传递给父组件的v-model里边去,使得弹出框可以不断完成关闭,显示动作
                $emit('input',$event)就是这样配置,van-dialog内部已经把$event.target.value都集成好了
                  如果当前的标签是普通的input标签,那就要写成$emit('input',$event.target.value)
             @close: 关闭弹窗,恢复状态
      -->
      <van-dialog
        :value="value"
        @input="$emit('input',$event)"
        :show-confirm-button="false"
        close-on-click-overlay
        @close="isOneLevel=true"
      >
        <van-cell-group v-if="isOneLevel">
            <!--icon: 图标
                title: 标题
                is-link: 右侧箭头图标
                @click: 点击事件
                icon="arrow-left": 左侧箭头
            -->
            <van-cell icon="location-o" title="不感兴趣" @click="articleDislike()"/>
            <van-cell icon="location-o" title="反馈垃圾内容" is-link @click="isOneLevel=false"/>
            <van-cell icon="location-o" title="拉黑作者" />
        </van-cell-group>
        <van-cell-group v-else>
            <van-cell icon="arrow-left" @click="isOneLevel=true"/>
             <van-cell
              v-for="item in reportsList"
              :key="item.value"
              :title="item.title"
              icon="location-o"
              @click="articleReport(item.value)"
              />
            </van-cell-group>
      </van-dialog>
  </div>
</template>

<script>
// 导入不感兴趣文章,举报文章api函数
import { apiArticleDislike, apiArticleReport } from '@/api/article.js'

export default {
  name: 'com-moreaction',
  data () {
    return {
      // 举报类型
      reportsList: [
        { title: '其他问题', value: 0 },
        { title: '标题夸张', value: 1 },
        { title: '低俗色情', value: 2 },
        { title: '错别字多', value: 3 },
        { title: '旧闻重复', value: 4 },
        { title: '广告软文', value: 5 },
        { title: '内容不实', value: 6 },
        { title: '涉嫌违法犯罪', value: 7 },
        { title: '侵权', value: 8 }
      ],
      isOneLevel: true // 判断展示 一级 或 二级 反馈垃圾内容  true: 一级 false: 二级
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    // 接收不喜欢文章id
    articleID: {
      type: String,
      required: true
    }
  },
  methods: {
    // 对不感兴趣文章做处理
    async articleDislike () {
      await apiArticleDislike(this.articleID)
      // 删除成功提示
      this.$toast.success('处理成功!!')
      // 让弹出框消失
      this.$emit('input', false)
      // 调用自己的dislikeSuccess事件,完成页面文章删除功能
      this.$emit('dislikeSuccess')
    },
    // 对举报的文章做处理  (type:类型)
    async articleReport (type) {
      try {
        await apiArticleReport({ articleID: this.articleID, type })
      } catch (err) {
        if (err.response.status === 409) {
          return this.$toast.fail('文章已经被举报过了')
        } else {
          return this.$toast.fail('文章举报失败')
        }
      }
      // 成功提示
      this.$toast.success('举报成功!!')
      // 让弹出框消失
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
