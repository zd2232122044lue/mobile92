<template>
  <div class="user-login">
    <!-- 导航栏 -->
    <van-nav-bar title="登录"></van-nav-bar>
    <!-- 表单部分
      vant里边没有form相关组件,只有普通表单域组件
      vant-cell-group是对普通表单域组件做封装 -->
    <van-cell-group>
      <!-- van-field 输入框
          label: 输入框左侧文本
          placeholder: 占位提示文字
          required: 是否显示表单必填红色星号
          clearable: 是否启用清除控件 -->
      <van-field
        v-model="loginForm.mobile"
        type="text"
        placeholder="请输入手机号"
        label="手机号"
        required
        clearable
      />
      <van-field
        v-model="loginForm.code"
        type="password"
        placeholder="请输入验证码"
        label="验证码"
        required
        clearable
      >
        <!-- van-button 按钮
            type="primary": 类型(主要按钮 绿色)
            size="small": 尺寸
            slot="button": 命名插槽应用,提示相关按钮,是要给van-field组件内部的slot去填充的-->
        <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="login-btn">
      <!--van-button
        type="info": 类型(信息按钮 蓝色)
        round：是否为圆形按钮
        block：块级样式设置，占据一行 -->
      <van-button type="info" size="small" round block @click="login()">登录</van-button>
    </div>
  </div>
</template>

<script>
// 导入登录api方法
import { apiUserLogin } from '@/api/user.js'

export default {
  name: "user-login",
  data(){
    return{
      loginForm: {
        mobile:'13911111111',
        code:'246810'
      }
    }
  },
  methods:{
    // 登录功能
    async login(){
      try{
        const result = await apiUserLogin(this.loginForm)
        // result中有 token refresh_token
        // 通过vuex维护服务器端返回的token等秘钥信息
        this.$store.commit('updateUser',result)
        // 成功信息提示
        this.$toast.success('登录成功')
        // 成功后跳转页面至首页
        this.$router.push('/')
      }catch(err){
        // 错误信息提示
        this.$toast.fail('手机号或验证码错误'+err)
    }
    }
  }
}
</script>

<style scoped lang='less'>
.login-btn{
  margin: 40px;
}
</style>
