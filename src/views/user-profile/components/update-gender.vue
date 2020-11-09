<template>
  <div class="update-gender">
    <van-picker
      title="性别"
      :default-index="value"
      show-toolbar
      :columns="columns"
      @confirm="onConfirm"
      @cancel="onCancel"
      @change="onChange"
    />
  </div>
</template>

<script>
import { updateProfile } from '@/api/user'
export default {
  name: 'UpdateGender',
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  components: {},
  created() { },
  data() {
    return {
      columns: ['男', '女'],
      index: this.value
    }
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        duration: 0,
        forbidClick: true
      })
      try {
        const localGender = this.index
        await updateProfile({ gender: localGender })
        this.$emit('input', localGender)
        this.$emit('close')
        this.$toast.success('修改成功')
      } catch (err) {
        this.$toast.fail('修改失败，请重试')
      }
    },
    onCancel() {
      this.$emit('close')
    },
    onChange(picker, value, index) {
      this.index = index
    }
  }
}
</script>

<style lang='less' scoped>
</style>
