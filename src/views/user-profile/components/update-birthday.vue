<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
      @change="onChange"
    ></van-datetime-picker>
  </div>
</template>

<script>
import { updateProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UpdateBirthday',
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
      minDate: new Date(1920, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
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
        const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
        await updateProfile({ birthday: currentDate })
        this.$emit('input', currentDate)
        this.$emit('close')
        this.$toast.success('修改成功')
      } catch (err) {
        this.$toast.fail('修改失败，请重试')
      }
    },
    onChange() {
      console.log(this.currentDate)
    }
  }
}
</script>

<style lang='less' scoped>
</style>
