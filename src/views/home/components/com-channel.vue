<template>
  <!-- van-popup 弹出层容器,用于展示弹窗,信息提示等内容,支持多个弹出层叠加展示
        v-model="Boolean变量": 设置弹出层是否显示
            现在通过:value和@input体现出来,因为具体的控制开关
        closeable: 是否显示关闭图标
        round: 是否显示圆角
        position: 弹出位置,可选值为 top bottom right left
        :style="{height: '95%'}": 弹出层高度
        close-icon-position: 关闭图标位置,可选值为top-left bottom-left bottom-right
  -->
  <van-popup
    :value="value"
    @input="$emit('input',$event)"
    closeable
    round
    position="bottom"
    :style="{height: '95%'}"
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
          <van-button type="danger" plain size="mini" round @click="isEdit=!isEdit">{{isEdit?'完成':'编辑'}}</van-button>
        </div>
      </div>
      <!--van-grid 没有设置column-num属性，默认是4列-->
      <!-- clickable: 是否开启格子点击反馈 -->
      <van-grid class="channel-content" :gutter="10" clickable>
        <!-- 宫格内容表现:
                1.text属性,设置简单内容
                2.匿名插槽,设置复杂内容
        -->
        <!-- <van-grid-item v-for="value in 8" :key="value" text="文字"> -->
        <van-grid-item v-for="(item,k) in channelList" :key="item.id">
          <span class="text" :style="{color:k===activeChannelIndex?'red':''}">{{item.name}}</span>
          <!-- van-icon: 图标组件
                  name="close": 叉号图标
                  class="close-icon": 设置样式
                  v-if="k>0": "推荐"频道不设置叉号
          -->
          <van-icon class="close-icon" name="close" v-show="isEdit && k>0"
            @click="userToRest(item.id,k)" />
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
        <!-- <van-grid-item v-for="item in channelAll" :key="item.id"> -->
       <van-grid-item v-for="item in restChannel" :key="item.id" @click="restToUser(item)">
          <div class="info">
            <span class="text">{{item.name}}</span>
          </div>
        </van-grid-item>
      </van-grid>
    </div>
  </van-popup>
</template>

<script>
// 导入 获得所有频道数据,添加频道数据,删除频道数据 的api函数
import { apiChannelAll, apiChannelAdd, apiChannelDel } from '@/api/channel.js'

export default {
  name: 'com-channel',
  props: {
    // 接收父组件v-model传递过来的数据信息
    value: {
      type: Boolean,
      default: false
    },
    // 接收父组件传递过来的"我的频道"数据
    channelList: {
      type: Array,
      // 数组的默认值要通过箭头函数方式设置
      default: () => []
    },
    // 当前激活频道的下标
    activeChannelIndex: {
      type: Number,
      default: 0
    }
  },
  computed: {
    // 获得剩余频道(全部频道-我的频道)
    restChannel () {
      // 把"我的频道"的全部id获得到,以数组格式返回
      // --map方法 对channelList做遍历,返回一个新数组
      //  元素就是channelList数组各个元素的id值,数组长度与channelList一致
      const userChannelIds = this.channelList.map(item => {
        return item.id
      })
      // 遍历全部频道,筛选出来不在"我的频道"中出现的频道
      // --filter方法 对channelAll 做筛选,让id值不在userChannelIds数组中出现的元素通过
      // --includes方法 判断数组是否包含指定的元素
      //  返回新数组
      const rest = this.channelAll.filter(item => {
        return !userChannelIds.includes(item.id)
      })
      // 返回筛选好的 剩余的频道
      return rest
    }
  },
  data () {
    return {
      channelAll: [], // 全部频道
      isEdit: false // 是否进入编辑状态
    }
  },
  created () {
    this.getChannelAll()
  },
  methods: {
    // 获得全部频道
    async getChannelAll () {
      const result = await apiChannelAll()
      this.channelAll = result.channels
    },
    // 添加频道("推荐频道"---->"我的频道")
    restToUser (channel) {
      // 1.页面更新数据
      // --channelList 父组件给传递过来的,本身是一个对象,他们的传值模式是"引用"方式
      // --父,子组件关于channelList共同操作,一方修改,另一方也可以感知
      this.channelList.push(channel)
      // 2.localStorage持久更新
      apiChannelAdd(channel)
    },
    // 删除频道("我的频道"---->"推荐频道")
    // --channelID: 删除频道的id,用来给localStorage删除的
    // --index: 被删除频道在数组中的下标位置,用给页面删除
    userToRest (channelID, index) {
      // 1.页面删除数据
      // --channelList 父组件给传递过来的,本身是一个对象,他们的传值模式是"引用"方式
      // --父,子组件关于channelList共同操作,一方修改,另一方也可以感知
      this.channelList.splice(index, 1)
      // 2.localStorage永久删除
      apiChannelDel(channelID)
    }
  }
}
</script>

<style lang="less" scoped>
.channel {
  margin-top: 70px;
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
      color: gray;
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
