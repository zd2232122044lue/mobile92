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
      更多内容
      </van-dialog>
  </div>
</template>

<script>
export default {
  name: 'com-moreaction',
  data () {
    return {
      show: true
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
