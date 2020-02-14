<template>
  <div>
      <!-- van-dialog: 弹出模态框，常用于消息提示、消息确认、在当前页面内完成特定的交互操作
                    弹出框组件支持函数调用和组件调用两种方式
            show-confirm-button: 是否展示确认按钮
            close-on-click-overlay: 是否在点击遮罩层后关闭弹窗
            @input: 当前组件的value值发生变化,要传递给父组件的v-model里边去,使得弹出框可以不断完成关闭,显示动作
                $emit('input',$event)就是这样配置,van-dialog内部已经把$event.target.value都集成好了
                  如果当前的标签是普通的input标签,那就要写成$emit('input',$event.target.value)
      -->
      <van-dialog
        :value="value"
        @input="$emit('input',$event)"
        :show-confirm-button="false"
        close-on-click-overlay
      >
        <van-cell-group v-if="isOneLevel">
            <!--icon: 图标
                title: 标题
                is-link: 右侧箭头图标
                @click: 点击事件
                icon="arrow-left": 左侧箭头
            -->
            <van-cell icon="location-o" title="不感兴趣" />
            <van-cell icon="location-o" title="反馈垃圾内容" is-link @click="isOneLevel=false"/>
            <van-cell icon="location-o" title="拉黑作者" />
        </van-cell-group>
        <van-cell-group v-else>
            <van-cell icon="arrow-left" @click="isOneLevel=true"/>
             <van-cell title="其他问题" icon="location-o"/>
             <van-cell title="标题夸张" icon="location-o"/>
             <van-cell title="低俗色情" icon="location-o"/>
             <van-cell title="错别字多" icon="location-o"/>
             <van-cell title="旧闻重复" icon="location-o"/>
             <van-cell title="广告软文" icon="location-o"/>
             <van-cell title="内容不实" icon="location-o"/>
             <van-cell title="涉嫌违法犯罪" icon="location-o"/>
             <van-cell title="侵权" icon="location-o"/>
            </van-cell-group>
      </van-dialog>
  </div>
</template>

<script>
export default {
  name: 'com-moreaction',
  data () {
    return {
      isOneLevel: true // 判断展示 一级 或 二级 反馈垃圾内容  true: 一级 false: 二级
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less" scoped>
</style>
