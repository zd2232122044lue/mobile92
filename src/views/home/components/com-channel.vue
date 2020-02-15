<template>
  <!-- van-popup 弹出层容器,用于展示弹窗,信息提示等内容,支持多个弹出层叠加展示
        v-model="Boolean变量": 设置弹出层是否显示
            现在通过:value和@input体现出来,因为具体的控制开关
        closeable: 是否显示关闭图标
        round: 是否显示圆角
        position: 弹出位置,可选值为 top bottom right left
        :style="{height: '90%'}": 弹出层高度
        close-icon-position: 关闭图标位置,可选值为top-left bottom-left bottom-right
  -->
  <van-popup
    :value="value"
    @input="$emit('input',$event)"
    closeable
    round
    position="bottom"
    :style="{height: '90%'}"
    close-icon-position="top-left"
  >
    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">我的频道</span>
          <span class="desc">点击进入频道</span>
        </div>
        <div>
            <!-- plain: 是否为朴素按钮
                 round: 是否为原形按钮
            -->
          <van-button type="danger" plain size="mini" round>编辑</van-button>
        </div>
      </div>
      <!--van-grid 没有设置column-num属性，默认是4列-->
            <!-- clickable: 是否开启格子点击反馈 -->
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item v-for="value in 8" :key="value" text="文字">
          <span class="text">文字</span>
          <!-- <van-icon class="close-icon" name="close" /> -->
        </van-grid-item>
      </van-grid>
    </div>

    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">频道推荐</span>
          <span class="desc">点击添加频道</span>
        </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item v-for="value in 8" :key="value" text="文字">
          <div class="info">
            <span class="text">文字</span>
          </div>
        </van-grid-item>
      </van-grid>
    </div>
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
.channel {
  margin-top:70px;
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 16px;
      color:gray;
    }
  }
  .channel-content {
    .text {
      font-size: 16px;
    }
    .active {
      color: red;
    }
    .close-icon {
      font-size: 20px;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 999;
      background-color: #fff;
    }
    .info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
