<template>
  <div class="login-container">
    <!-- 导航 -->
    <van-nav-bar class="page-nav-bar" title="登录" />
    <!-- 表单 -->
    <van-form @submit="onSubmit" ref="userFormRef">
      <!-- 手机号输入框 -->
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        type="number"
        maxlength="11"
        :rules="userFromRules.mobile"
      >
        <i slot="left-icon" class="iconfont iconshouji1"></i>
      </van-field>
      <!-- 验证码输入框 -->
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        type="number"
        maxlength="6"
        :rules="userFromRules.code"
      >
        <i slot="left-icon" class="iconfont iconyanzhengma1"></i>
        <template #button>
          <!-- 倒计时 -->
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 60"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <!-- 发送验证码 -->
          <van-button
            v-else
            round
            native-type="button"
            class="send-msg-btn"
            size="small"
            type="default"
            @click="sendMsg"
            >获取验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-box">
        <van-button class="login-btn" block type="info" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendMsg } from '@/api/user'
export default {
  name: 'LoginIndex',
  data() {
    return {
      user: {
        mobile: '',
        code: ''
      },
      userFromRules: {
        mobile: [
          { required: true, message: '手机号不能为空' },
          { pattern: /^1[3|5|6|7|8]\d{9}$/, message: '手机号不合法' }
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          { pattern: /^\d{6}$/, message: '验证码不合法' }
        ]
      },
      isCountDownShow: false
    }
  },
  methods: {
    async onSubmit() {
      const user = this.user
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true,
        duration: '0'
      })
      try {
        // 登录请求
        const { data } = await login(user)
        // 保存token
        this.$store.commit('setUser', data.data)
        console.log(this.$store.state.user)
        this.$toast.success('登录成功！')
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机或验证码错误')
        } else {
          this.$toast.fail('登录失败')
        }
      }
    },
    async sendMsg() {
      // 校验手机号--开启倒计时--调接口发验证码
      console.log(11)
      try {
        await this.$refs.userFormRef.validate('mobile')
      } catch (err) {
        return this.$toast.fail('手机号不正确')
      }
      this.isCountDownShow = true
      // 发送短信验证码
      try {
        await sendMsg(this.user.mobile)
        this.$toast.success('发送成功！')
      } catch (err) {
        this.isCountDownShow = true
        if (err.response.status === 429) {
          this.$toast('操作过于频繁，请稍后再试！')
        } else {
          this.$toast.fail('发送失败，请稍后再试！')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .iconfont {
    font-size: 37px;
  }
  .send-msg-btn {
    width: 162px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-box {
    padding: 53px 33px;
  }
  .login-btn {
    background-color: #6db4fb;
    border: none;
  }
}
</style>
