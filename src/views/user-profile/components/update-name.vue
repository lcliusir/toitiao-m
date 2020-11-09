<template>
  <div class="update-name">
    <van-nav-bar
      class="page-nav-bar"
      title="修改昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onUpdateName"
    ></van-nav-bar>
    <van-field
      class="inputName"
      v-model.trim="message"
      rows="1"
      type="textarea"
      maxlength="7"
      placeholder="请输入昵称"
      show-word-limit
    />
  </div>
</template>

<script>
import { updateProfile } from '@/api/user'
export default {
  name: 'UpdateName',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  components: {},
  created() { },
  data() {
    return {
      message: this.value
    }
  },
  methods: {
    async onUpdateName() {
      this.$toast.loading({
        message: '保存中...',
        duration: 0,
        forbidClick: true
      })
      try {
        const localName = this.message
        if (!localName.length) return this.$toast('昵称不能为空！')
        await updateProfile({ name: localName })
        this.$emit('input', localName)
        this.$emit('close')
        this.$toast.success('修改成功')
      } catch (err) {
        this.$toast.fail('修改失败，请重试')
      }
    }
  }
}
</script>

<style lang='less' scoped>
.update-name {
  /deep/.van-nav-bar {
    .van-nav-bar__text {
      color: #fff;
    }
  }
  .inputName {
    width: 90%;
    margin-left: 5%;
    margin-top: 20px;
  }
}
</style>
