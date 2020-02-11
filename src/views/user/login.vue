<template>
  <div class="user-login">
    <!-- 导航栏 -->
    <van-nav-bar title="登录"></van-nav-bar>
    <!-- 表单部分
      vant里边没有form相关组件,只有普通表单域组件
    vant-cell-group是对普通表单域组件做封装-->
    <van-cell-group>

      <!-- ValidationObserver 登录方式校验 点击登录按钮,校验全部组件.用此标签把全部需要被校验的项目包起来
      ref设置好,使得组件实例可以用this.$refs.xx的方式获得当前的组件对象-->
      <ValidationObserver ref="loginFormRef">

        <!-- ValidationProvider: 表单域校验  用此标签把需要被校验的项目包起来
          name: 校验失败,提示当前项目名称的
          rules: 设置校验规则,   required: 必填  phone:自定义检验手机号规则
          v-slot: 接收"作用域插槽数据",即校验失败错误信息
                  在vue新版本中,可以通过v-slot接收作用域插槽数据,格式为 v-slot="数据名称"
                  slot-scope="stData"  {{stData.errors[0]}} 表现具体校验失败错误信息的
                    在形式上 v-slot="stData" 和 slot-scope="stData" 是一样的
                    区别  v-slot  应用在template,组件标签
                          slot-scope  应用在template,组件标签,普通html标签
                    注意: 在此只能使用v-slot (用slot-scope,页面没有效果)
                  v-slot="{ errors }" 对象结构赋值 errors[0]
                    写全 v-slot="stData"  {{stData.errors[0]}}
        当前校验部分,errors[0]就可以访问到校验失败的错误信息了(固定用法)-->

        <ValidationProvider name="手机号" rules="required|phone" v-slot="{ errors }">
          <!-- 把检验的错误信息显示出来
        error-message: 显示校验失败的错误信息 
        van-field通过 :error-message 接收,显示校验错误信息
          -->

          <!-- van-field 输入框
          label: 输入框左侧文本
          placeholder: 占位提示文字
          required: 是否显示表单必填红色星号
          clearable: 是否启用清除控件-->
          <van-field
            v-model="loginForm.mobile"
            type="text"
            placeholder="请输入手机号"
            label="手机号"
            required
            clearable
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider name="验证码" rules="required" v-slot="{ errors }">
          <van-field
            v-model="loginForm.code"
            type="password"
            placeholder="请输入验证码"
            label="验证码"
            required
            clearable
            :error-message="errors[0]"
          >
            <!-- van-button 按钮
            type="primary": 类型(主要按钮 绿色)
            size="small": 尺寸
            slot="button": 命名插槽应用,提示相关按钮,是要给van-field组件内部的slot去填充的-->
            <van-button slot="button" size="small" type="primary">发送验证码</van-button>
          </van-field>
        </ValidationProvider>
      </ValidationObserver>
    </van-cell-group>
    <div class="login-btn">
      <!--van-button
        type="info": 类型(信息按钮 蓝色)
        round：是否为圆形按钮
        block：块级样式设置，占据一行
        loading: 是否是加载中状态
        loading-text:设置加载中的文字提示
      -->
      <van-button 
        type="info" 
        size="small" 
        round block 
        @click="login()"
        :loading="isLogin"
        loading-text="登录中..."
      >登录</van-button>
    </div>
  </div>
</template>

<script>
// 导入登录api方法
import { apiUserLogin } from "@/api/user.js";
// 导入表单验证模块
// --ValidationProvider 单个
// --ValidationObserver 全部
import { ValidationProvider, ValidationObserver } from "vee-validate";

export default {
  name: "user-login",
  components: {
    // 注册
    ValidationProvider,
    ValidationObserver
  },
  data() {
    return {
      isLogin: false, // 按钮默认为正常状态 
      loginForm: {
        // mobile: "", // 登录方式校验使用
        // code: ""
        mobile: "13911111111",
        code: "246810"
      }
    };
  },
  methods: {
    // 登录功能
    async login() {

      // 对全部表单做校验,没有问题再向下执行
      // --validate()返回promise对象
      // ---valid = true  校验成功
      // ---valid = false  校验失败
      const valid = await this.$refs.loginFormRef.validate()
      if(!valid){
        // 校验失败,停止后续代码执行
        return false
      }

      // 点击登录按钮,使得按钮变为加载中
      this.isLogin = true

      try {
        const result = await apiUserLogin(this.loginForm);
        // result中有 token refresh_token
        // 通过vuex维护服务器端返回的token等秘钥信息
        this.$store.commit("updateUser", result);
        // 成功信息提示
        this.$toast.success("登录成功");
        // 成功后跳转页面至首页
        this.$router.push("/");
      } catch (err) {
        // 错误信息提示
        this.$toast.fail("手机号或验证码错误" + err);
      }

      // 使得按钮变为正常状态
      this.isLogin = false
    }
  }
}
</script>

<style scoped lang='less'>
.login-btn {
  margin: 40px;
}
</style>
