<template>
<!-- van-popup 弹出层容器,用于展示弹窗,信息提示等内容,支持多个弹出层叠加展示
        v-model="Boolean变量": 设置弹出层是否显示
            现在通过:value和@input体现出来,因为具体的控制开关
        closeable: 是否显示关闭图标
        round: 是否显示圆角
        position: 弹出位置,可选值为 top bottom right left
        :style="{height: '20%'}": 弹出层高度
        close-icon-position: 关闭图标位置,可选值为top-left bottom-left bottom-right
-->
  <van-popup
    :value="value"
    @input="$emit('input',$event)"
    closeable
    round
    position="bottom"
    :style="{height: '20%'}"
    close-icon-position="top-left"
  >
  </van-popup>
</template>

<script>
export default {
  name: 'com-channel',
  props: {
    // 接收父组件v-model传递过来的数据信息
    value: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less" scoped>
</style>
